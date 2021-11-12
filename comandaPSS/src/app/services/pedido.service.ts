import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

import { SystemService } from 'src/app/utility/services/system.service';
import { Pedido, PedidoEstado } from 'src/app/models/interfaces/pedido.model';
import { ErrorStrings } from 'src/app/models/enums/errorStrings';
import { Preparacion } from '../models/interfaces/preparacion.model';
import { filter, map, reduce } from 'rxjs/operators';
import { TipoProducto } from '../models/interfaces/producto.model';
import { PreparacionService } from './preparacion.service';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private system: SystemService,
    private preparacionService: PreparacionService
  ) {}

  async crearPedido(pedido: Pedido): Promise<void> {
    pedido.preparaciones.forEach((p) => {
      p.pedidoId = pedido.pedidoId;
      this.preparacionService.crearPreparacion(p);
    });
    pedido.preparaciones = [];
    try {
      await this.db.collection('Pedidos').doc(pedido.pedidoId).set(pedido);
    } catch (error) {
      console.log(error);
      throw Error(ErrorStrings.BadPedido);
    }
  }

  async updatePedido(pedido: Pedido): Promise<void> {
    try {
      await this.db.collection('Pedidos').doc(pedido.pedidoId).set(pedido);
    } catch (error) {
      console.log(error);
      throw Error(ErrorStrings.BadPedido);
    }
  }

  async deletePedido(pedido: Pedido): Promise<void> {
    try {
      await this.preparacionService.deletePreparacionesByPedidoId(pedido.pedidoId);
      await this.db.collection('Pedidos').doc(pedido.pedidoId).delete();
    } catch (error) {
      console.log(error);
      throw Error(ErrorStrings.BadPedido);
    }
  }

  async getPedidoByMesaId(mesaId: string) {
    return this.db
      .collection<Pedido>('Pedidos', (ref) =>
        ref
          .where('mesaId', '==', mesaId)
      )
      .valueChanges();
  }

  async getPedidos(state: PedidoEstado): Promise<Observable<Pedido[]>> {
    return this.db
      .collection<Pedido>('Pedidos', (ref) =>
        ref
          .where('estado', '==', state)
      )
      .valueChanges();
  }

  async getPedidosPendientes(): Promise<Observable<Pedido[]>> {
    return this.db
      .collection<Pedido>('Pedidos', (ref) =>
        ref
          .where('estado', '==', 'pendiente')
      )
      .valueChanges();
  }

  async getComidasPendientes(): Promise<Observable<Preparacion[]>> {
    return this.getPreparacionesPendientes("comida");
  }

  async getBebidasPendientes(): Promise<Observable<Preparacion[]>> {
    return this.getPreparacionesPendientes("bebida");
  }

  async getComidasPreparando(): Promise<Observable<Preparacion[]>> {
    return this.getPreparacionesPreparando("comida");
  }

  async getBebidasPreparando(): Promise<Observable<Preparacion[]>> {
    return this.getPreparacionesPreparando("bebida");
  }

  private async getPreparacionesPendientes(tipo: TipoProducto): Promise<Observable<Preparacion[]>> {
    return this.db
      .collection<Pedido>('Pedidos', (ref) =>
        ref
          .where('estado', '==', 'preparando')
      )
      .valueChanges()
      .pipe(
        // Agarro array de Pedido
        map(
          pedidos => pedidos
          // Mapeo el array de pedidos a un array de arrays de Preparaciones
          .map(
            pedido => pedido.preparaciones
          )
          // Aplano el array de arrays de Preparaciones
          .reduce(
            (acc, val) => acc.concat(val),
            []
          )
          // Filtro solo las Preparaciones en estado pendiente
          .filter(
            prep => prep.estado == "pendiente"
          )
          // Filtro solo las Preparaciones del tipo indicado
          .filter(
            prep => prep.producto.tipo === tipo
          )
        ),
      )
  }

  private async getPreparacionesPreparando(tipo: TipoProducto): Promise<Observable<Preparacion[]>> {
    return this.db
      .collection<Pedido>('Pedidos', (ref) =>
        ref
          .where('estado', '==', 'preparando')
      )
      .valueChanges()
      .pipe(
        // Agarro array de Pedido
        map(
          pedidos => pedidos
          // Mapeo el array de pedidos a un array de arrays de Preparaciones
          .map(
            pedido => pedido.preparaciones
          )
          // Aplano el array de arrays de Preparaciones
          .reduce(
            (acc, val) => acc.concat(val),
            []
          )
          // Filtro solo las Preparaciones en estado preparando
          .filter(
            prep => prep.estado == "preparando"
          )
          // Filtro solo las Preparaciones del tipo indicado
          .filter(
            prep => prep.producto.tipo === tipo
          )
        ),
      )
  }
}
