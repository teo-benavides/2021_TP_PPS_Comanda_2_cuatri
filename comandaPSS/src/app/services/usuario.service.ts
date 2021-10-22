import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SystemService } from '../utility/services/system.service';
import { User, estado } from '../models/interfaces/user.model';
import { Observable } from 'rxjs';
import { ERROR } from '../models/enums/error';
import { NavController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(
    private db: AngularFirestore,
    private system: SystemService,
    private register: AngularFireAuth,
    private nav: NavController,
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
    console.log('TODO');
    // await this.storage.set('user', { nombre, foto });

    // this.nav.navigateForward('/');
  }

  async cambiarEstadoUsuario(uid: string, estado: estado): Promise<boolean> {
    let flag = false;

    try {
      await this.db.collection('Usuarios').doc(uid).update({ estado });
      flag = true;
    } catch (error) {}

    return flag;
  }

  getUsuarioAConfirmar(): Observable<User[]> {
    return this.db
      .collection<User>('Usuarios', (ref) =>
        ref.where('perfil', '==', 'cliente').where('estado', '==', 'pendiente')
      )
      .valueChanges();
  }
}
