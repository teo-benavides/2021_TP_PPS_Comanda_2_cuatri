import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { SystemService } from '../utility/services/system.service';
import { User, estado, estadoIngreso } from '../models/interfaces/user.model';
import { Observable } from 'rxjs';
import { ErrorStrings } from '../models/enums/errorStrings';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Mesa } from '../models/interfaces/mesas.model';
import { MesasService } from './mesas.service';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(
    private db: AngularFirestore,
    private system: SystemService,
    private register: AngularFireAuth,
    private http: HttpClient,
    private network: Network,
    private file: AngularFireStorage,
    private storage: Storage,
    private nav: NavController
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
      const msg =
        error['code'] === 'auth/email-already-in-use'
          ? ErrorStrings.EmailRepetido
          : ErrorStrings.CrearUsuario;

      this.system.presentToastError(msg);
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

  async cambiarEstadoUsuario(
    uid: string,
    email: string,
    estado: estado
  ): Promise<boolean> {
    let flag = false;

    try {
      await this.db.collection('Usuarios').doc(uid).update({ estado });
      flag = true;

      const reject = (estado !== 'confirmado').toString();

      await this.http
        .get(
          `${environment.backendUrl}sendMail?dest=${email}&subject=Estado de cuenta&reject=${reject}`
        )
        .toPromise();
    } catch (error) {
      console.log(error);
    }

    return flag;
  }

  getUsuarioAConfirmar(): Observable<User[]> {
    return this.db
      .collection<User>('Usuarios', (ref) =>
        ref.where('perfil', '==', 'cliente').where('estado', '==', 'pendiente')
      )
      .valueChanges();
  }

  getUsuariosEnEspera(): Observable<User[]> {
    return this.db
      .collection<User>('Usuarios', (ref) =>
        ref
          .where('perfil', '==', 'cliente')
          .where('estado', '==', 'confirmado')
          .where('estadoIngreso', '==', 'espera')
      )
      .valueChanges();
  }

  async asignarMesaUsuario(uid: string, mesaId: string): Promise<void> {
    const user = {
      mesa: this.db.doc(`Mesas/${mesaId}`).ref,
      estadoIngreso: 'buscando',
    };

    try {
      await this.db.collection('Usuarios').doc(uid).update(user);
      await this.db
        .collection('Mesas')
        .doc(mesaId)
        .update({ estado: 'ocupada' });

      this.system.presentToast('La cuenta se a creado con éxito!');
    } catch (error) {
      console.log(error);
      this.system.presentToastError(ErrorStrings.AsignarMesa);
    }
  }

  cambiarEstadoIngresoUsuario(
    uid: string,
    estadoIngreso: estadoIngreso
  ): Promise<void> {
    return this.db.collection('Usuarios').doc(uid).update({ estadoIngreso });
  }

  esperandoMesaUsuario() {
    this.storage.get('user').then(async (u) => {
      const sub = this.db
        .doc<User>(`Usuarios/${u.uid}`)
        .valueChanges()
        .pipe(map(this.getMesa))
        .subscribe(async (data) => {
          const user = await data;
          if (user.estadoIngreso === 'buscando') {
            await this.storage.set('user', user);
            this.nav.navigateBack('/cliente/buscar');
            sub.unsubscribe();
          }
        });
    });
  }

  private async getMesa(user: any) {
    if (user.mesa === undefined) return user as User;

    user.mesa = (await user.mesa.get()).data();

    return user as User;
  }
}
