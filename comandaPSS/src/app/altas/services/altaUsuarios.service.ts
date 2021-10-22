import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Network } from '@ionic-native/network/ngx';
import { NavController } from '@ionic/angular';
import { SystemService } from 'src/app/utility/services/system.service';
import { perfil, User } from 'src/app/models/interfaces/user.model';
import { Storage } from '@ionic/storage-angular';
import { Base64 } from '@ionic-native/base64/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ERROR } from '../../models/enums/error';

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
    private file: AngularFireStorage
  ) {}

  async createUser(newUser: User, clave: string) {
    let flag = false;

    try {
      var loading = await this.system.presentLoading('Creando usuario');
      loading.present();
      if (this.network.type === this.network.Connection.NONE)
        throw new Error('No internet');
      const {
        user: { uid },
      } = await this.register.createUserWithEmailAndPassword(
        newUser.correo,
        clave
      );

      newUser.uid = uid;

      if (newUser.foto !== '') {
        let b64 = await this.system.fileToBase64(newUser.foto);

        const r = await this.file
          .ref(`/foto/${newUser.uid}`)
          .putString(b64, 'base64', { contentType: 'image/jpeg' });
        const url = await r.ref.getDownloadURL();
        newUser.foto = url;
      }

      await this.db.collection('Usuarios').doc(newUser.uid).set(newUser);
      this.system.presentToast('La cuenta se a creado con éxito!');
      flag = true;
    } catch (error) {
      console.log(error);
      this.system.presentToastError(ERROR.CREARUSUARIO);
    } finally {
      loading.dismiss();
      return flag;
    }
  }

  async loginAnonimo(nombre: string, foto: string = '') {
    await this.storage.set('user', { nombre, foto });

    this.nav.navigateForward('/');
  }
}
