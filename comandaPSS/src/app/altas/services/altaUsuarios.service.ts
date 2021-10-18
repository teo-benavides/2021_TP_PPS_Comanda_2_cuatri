import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Network } from '@ionic-native/network/ngx';
import { NavController } from '@ionic/angular';
import { SystemService } from 'src/app/utility/services/system.service';
import { perfil, User } from '../../login/models/user.model';
import { Storage } from '@ionic/storage-angular';
import { Base64 } from '@ionic-native/base64/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class AltaUsuariosService {
  constructor(
    private register: AngularFireAuth,
    private db: AngularFirestore,
    private nav: NavController,
    private system: SystemService,
    private network: Network,
    private storage: Storage,
    private base64: Base64,
    private file: AngularFireStorage
  ) {}

  async createUser(newUser: User) {
    try {
      var loading = await this.system.presentLoading('Creado usuario');
      loading.present();
      if (this.network.type === this.network.Connection.NONE)
        throw new Error('No internet');
      const {
        user: { uid },
      } = await this.register.createUserWithEmailAndPassword(
        newUser.correo,
        newUser.clave
      );

      newUser.uid = uid;

      if (newUser.foto !== '') {
        let b64 = await this.base64.encodeFile(newUser.foto);
        b64 = b64.split('\n').join('');
        b64 = b64.split(';')[2];
        b64 = b64.split(',')[1];
        const r = await this.file
          .ref(`/foto/${newUser.uid}`)
          .putString(b64, 'base64', { contentType: 'image/jpeg' });
        const url = await r.ref.getDownloadURL();
        newUser.foto = url;
      }

      await this.db.collection('Usuarios').doc(newUser.uid).set(newUser);
      this.system.presentToast('La cuenta se a creado con éxito!');
    } catch (error) {
      console.log(error);
      const err = error === 'No internet' ? 'No internet' : error['code'];
      this.system.presentToastError(err);
    } finally {
      loading.dismiss();
    }
  }

  async loginAnonimo(nombre: string, foto: string = '') {
    await this.storage.set('user', { nombre, foto });

    this.nav.navigateForward('/');
  }
}
