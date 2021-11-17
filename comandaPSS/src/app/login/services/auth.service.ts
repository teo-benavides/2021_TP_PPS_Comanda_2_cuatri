import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Network } from '@ionic-native/network/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { SystemService } from '../../utility/services/system.service';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/models/interfaces/user.model';
import { Base64 } from '@ionic-native/base64/ngx';
import { NotificationService } from 'src/app/services/notification.service';

/*

  Comandos utilizados:

  ng add @angular/fire
  npm install @ionic/storage-angular
  ionic cordova plugin add cordova-plugin-network-information
  npm install @ionic-native/network

  NOTA: Se recomienda crear una PAGE llamado main y que esta
  contenga las rutas hacia el resto de la aplicacion. El metodo
  init se puede llamar en el app.component.ts para verificar la
  sesion del usuario.
*/

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: Storage,
    private network: Network,
    private nav: NavController,
    private system: SystemService,
    private notificationService: NotificationService
  ) {}

  async login(correo: string, clave: string) {
    try {
      var loading = await this.system.presentLoading('Iniciando sesión');
      loading.present();

      await this.storage.create();
      if (this.network.type === this.network.Connection.NONE)
        throw new Error('No internet');
      const { user } = await this.auth.signInWithEmailAndPassword(
        correo,
        clave
      );

      const data = await (
        await this.db.collection<any>('Usuarios').doc(user.uid).ref.get()
      ).data();

      const userInfo = await this.getMesa(data);

      if (userInfo.estado !== 'confirmado') {
        await this.auth.signOut();

        const msgEstado =
          userInfo.estado === 'pendiente' ? 'no fue validada' : 'fue rechazada';
        this.system.presentToast(`La cuenta ${msgEstado}`);
        return;
      }

      await this.storage.set('user', userInfo);

      //await this.system.playAudio('login');

      this.nav.navigateForward('/');
    } catch (error) {
      console.log(error);
      const err = error === 'No internet' ? 'No internet' : error['code'];
      this.errorLogin(err);
    } finally {
      loading.dismiss();
    }
  }

  async logout() {
    this.notificationService.endProcess();
    await this.auth.signOut();
    await this.storage.remove('user');
    await this.storage.remove('dobleIngreso');

    this.nav.navigateRoot('/sesion');
  }

  async isLog() {
    await this.storage.create();
    const user: User = await this.storage.get('user');

    return user !== null;
  }

  async errorLogin(code: string = '') {
    let message = '';

    switch (code) {
      case 'auth/email-already-exists':
        message = 'Ya existe un usuario registrado con ese correo';
        break;
      case 'auth/internal-error':
        message = 'Error al conectarse al servidor';
        break;
      case 'auth/user-not-found':
        message = 'No existe el usuario';
        break;
      case 'auth/invalid-email':
        message = 'El correo es inválido';
        break;
      case 'auth/invalid-password':
        message = 'La contraseña es inválida';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'no internet':
        message = 'El dispositivo no tiene conexión a internet';
        break;
      case 'Camara':
        message = 'Error de cámara';
        break;
      case 'Cámara no autorizda':
        message =
          'Se requiere autorización del usuario para utilizar la cámara';
        break;
      case 'QR - invalido':
        message = 'Código QR inválido';
        break;
      default:
        message = 'Error inesperado';
        break;
    }

    this.system.presentToastError(message);
  }

  private async getMesa(user: any) {
    if (!user.mesa) return user as User;

    user.mesa = (await user.mesa.get()).data();

    return user as User;
  }
}
