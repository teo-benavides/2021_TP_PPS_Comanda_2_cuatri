import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { max } from 'rxjs/operators';
import { Pedido } from 'src/app/models/interfaces/pedido.model';
import { Producto } from 'src/app/models/interfaces/producto.model';
import { Cliente } from 'src/app/models/interfaces/user.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import { SystemService } from 'src/app/utility/services/system.service';
import { Storage } from '@ionic/storage-angular';
import { DetalleCartaComponent } from '../modals/detalle-carta/detalle-carta.component';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.page.html',
  styleUrls: ['./realizar-pedido.page.scss'],
})
export class RealizarPedidoPage implements OnInit {
  productos: Producto[];
  pedido: Pedido;
  cliente: Cliente = null;

  constructor(
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private modalController: ModalController,
    private nav: NavController,
    private system: SystemService,
    private localStorage: Storage
  ) {}

  ngOnInit() {
    this.localStorage.get('user').then((data) => {
      console.log(data);
      this.cliente = data;
    });

    this.productoService
      .getProductos()
      .then((p) => p.subscribe((data) => (this.productos = data)));

    this.pedido = {
      pedidoId: this.system.createId(),
      mesaId: '',
      numeroMesa: 0,
      tiempoEstimado: 0,
      precioTotal: 0,
      estado: 'pendiente',
      preparaciones: [],
    };
  }

  getComidas(): Producto[] {
    return this.productos.filter((p) => p.tipo === 'comida');
  }

  getBebidas(): Producto[] {
    return this.productos.filter((p) => p.tipo === 'bebida');
  }

  getProductoTotalCount(): number {
    return this.pedido.preparaciones.length;
  }

  getProductoCount(productoId: string): number {
    return this.pedido.preparaciones.filter(
      (prep) => prep.producto.productoId === productoId
    ).length;
  }

  getPrecioTotal(): number {
    if (this.pedido.preparaciones.length > 0) {
      return this.pedido.preparaciones
        .map((prep) => prep.producto.precio)
        .reduce((prev, cur) => prev + cur);
    }
    return 0;
  }

  getTiempoEstimado(): number {
    if (this.pedido.preparaciones.length > 0) {
      return Math.max(
        ...this.pedido.preparaciones.map((prep) => prep.producto.tiempoEstimado)
      );
    }
    return 0;
  }

  removeProducto(productoId: string) {
    const index = this.pedido.preparaciones.findIndex(
      (prep) => prep.producto.productoId === productoId
    );
    if (index > -1) {
      this.pedido.preparaciones.splice(index, 1);
    }
  }

  addProducto(producto: Producto) {
    this.pedido.preparaciones.push({
      preparacionId: this.system.createId(),
      producto: producto,
      estado: 'confirmandoPedido',
      pedidoId: this.pedido.pedidoId,
    });
  }

  realizarPedido() {
    this.pedido.mesaId = this.cliente.mesa.mesaId;
    this.pedido.numeroMesa = this.cliente.mesa.numeroMesa;
    this.pedido.precioTotal = this.getPrecioTotal();
    this.pedido.tiempoEstimado = this.getTiempoEstimado();
    this.pedidoService.crearPedido(this.pedido);
    this.nav.navigateBack('cliente/mesa');
  }

  async detalleFoto(producto: Producto) {
    const fotos = [producto.foto1, producto.foto2, producto.foto3];
    const modal = await this.modalController.create({
      component: DetalleCartaComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: true,
      componentProps: {
        fotos,
      },
    });
    return await modal.present();
  }
}
