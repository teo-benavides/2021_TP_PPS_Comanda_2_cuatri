import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Storage } from '@ionic/storage-angular';
import { SystemService } from '../utility/services/system.service';
import { Comentario, Estadisticas } from '../models/interfaces/encuestas.model';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private localStorage: Storage,
    private system: SystemService
  ) {}

  async crearEncuesta(
    mozo: 'Si' | 'No',
    plato: number,
    entrega: boolean,
    experiencia: string,
    text: string,
    path: string[]
  ) {
    const estadisticaDoc = this.angularFirestore.doc('Encuestas/Estadisticas');
    const estadistica = (await (await estadisticaDoc.ref.get()).data()) as any;

    estadistica.entrega[entrega ? 'Si' : 'No'] += 1;
    estadistica.experiencia[experiencia] += 1;
    estadistica.mozo[mozo] += 1;
    estadistica.plato[plato] += 1;

    await estadisticaDoc.update(estadistica);

    const { correo } = await this.localStorage.get('user');
    const fotos = [];

    if (path.length > 0) {
      for (let i = 0; i < path.length; i++) {
        const base64 = await this.system.fileToBase64(path[i]);

        const r = await this.angularFireStorage
          .ref(`/foto/${this.system.createId()}`)
          .putString(base64, 'base64', { contentType: 'image/jpeg' });

        const url = await r.ref.getDownloadURL();
        fotos.push(url);
      }
    }

    const comentariosDoc = this.angularFirestore.doc('Encuestas/Comentarios');
    const { Clientes } = (await (await comentariosDoc.ref.get()).data()) as any;

    Clientes.push({
      fotos,
      text,
      correo,
    });

    await comentariosDoc.update({ Clientes });
  }

  public get getComentarios(): Observable<Comentario[]> {
    return this.angularFirestore
      .doc('Encuestas/Comentarios')
      .valueChanges()
      .pipe(
        map((data: any) => {
          return data.Clientes as Comentario[];
        })
      );
  }

  async getEstadisticas(): Promise<Estadisticas> {
    const estadisticaDoc = this.angularFirestore.doc('Encuestas/Estadisticas');
    const { mozo, entrega, experiencia, plato } = (
      await estadisticaDoc.ref.get()
    ).data() as any;

    return new Estadisticas(mozo, plato, entrega, experiencia);
  }
}
