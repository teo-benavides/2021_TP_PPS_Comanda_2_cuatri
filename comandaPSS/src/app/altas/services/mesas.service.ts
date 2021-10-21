import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SystemService } from 'src/app/utility/services/system.service';
import { Mesa } from '../../models/mesas.model';

// TODO: Agregarle tipados de retorno a los metodos

@Injectable({
  providedIn: 'root',
})
export class MesasService {
  constructor(
    private db: AngularFirestore,
    private file: AngularFireStorage,
    private system: SystemService
  ) {}

  async mesaExiste(numeroMesa: number) {
    const data = await this.db
      .collection<Mesa>('Mesas', (ref) =>
        ref.where('numeroMesa', '==', numeroMesa)
      )
      .ref.get();
    console.log(data);
    return !data.empty;
  }

  async getUltimaMesa() {
    const data = await this.db.collection<Mesa>('Mesas').ref.get();

    if (data.empty) return 1;

    const mesas: number[] = [];

    data.forEach((d) => mesas.push(d.data().numeroMesa));

    return Math.max(...mesas) + 1;
  }

  crearId(): string {
    return this.db.createId();
  }

  async crearMesa(mesa: Mesa, qr: string) {
    let flag = false;

    const loading = await this.system.presentLoading('Creando mesa');
    try {
      loading.present();

      const b64 = await this.system.fileToBase64(mesa.foto);
      const r = await this.file
        .ref(`/mesas/${mesa.mesaId}`)
        .putString(b64, 'base64', { contentType: 'image/png' });

      await this.file
        .ref(`/qr/${mesa.mesaId}-Numero:${mesa.numeroMesa}`)
        .putString(qr, 'base64', { contentType: 'image/jpeg' });

      mesa.foto = await r.ref.getDownloadURL();

      await this.db.collection('Mesas').doc(mesa.mesaId).set(mesa);
      flag = true;

      this.system.presentToast('Se a creado una mesa');
    } catch (error) {
      console.log(error);

      this.system.presentToastError();
    } finally {
      loading.dismiss();
      return flag;
    }
  }
}
