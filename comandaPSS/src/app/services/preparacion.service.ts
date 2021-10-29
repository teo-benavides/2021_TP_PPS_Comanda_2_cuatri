import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

import { SystemService } from 'src/app/utility/services/system.service';
import { Preparacion, PreparacionEstado } from 'src/app/models/interfaces/preparacion.model';
import { ErrorStrings } from 'src/app/models/enums/errorStrings';
import { filter, map, reduce } from 'rxjs/operators';
import { TipoProducto } from '../models/interfaces/producto.model';

@Injectable({
  providedIn: 'root',
})
export class PreparacionService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private system: SystemService
  ) {}

  async crearPreparacion(preparacion: Preparacion): Promise<void> {
    try {
      await this.db.collection('Preparaciones').doc(preparacion.preparacionId).set(preparacion);
    } catch (error) {
      console.log(error);
      throw Error(ErrorStrings.BadPreparacion);
    }
  }

  async updatePreparacion(preparacion: Preparacion): Promise<void> {
    //this.db.collection<Preparacion>('Preparaciones').doc(preparacion.preparacionId).
  }

  async updatePreparacionState(preparacionId: string, state: PreparacionEstado) {
    this.db
    .collection<Preparacion>('Preparaciones')
    .doc(preparacionId)
    .update({"estado": state});
  }

  async getPreparaciones(estado: PreparacionEstado, tipo: TipoProducto): Promise<Observable<Preparacion[]>> {
    return this.db
      .collection<Preparacion>('Preparaciones', (ref) =>
        ref
          .where('estado', '==', estado)
          .where('producto.tipo', '==', tipo)
      )
      .valueChanges();
  }
}
