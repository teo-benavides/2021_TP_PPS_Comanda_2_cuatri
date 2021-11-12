import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { SystemService } from '../utility/services/system.service';
import {
  User,
  estado,
  estadoIngreso,
  Anonimo,
  Cliente,
} from '../models/interfaces/user.model';
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
import { FirebaseError } from '@firebase/util';
import { perfil } from '../models/interfaces/user.model';
import { ErrorTest } from '../models/enums/errorTest';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(
    private angularFirestore: AngularFirestore,
    private system: SystemService,
    private angularFireAuth: AngularFireAuth,
    private http: HttpClient,
    private network: Network,
    private angularFireStorage: AngularFireStorage,
    private localStorage: Storage,
    private nav: NavController,
    private notificationService: NotificationService,
    private mesasService: MesasService
  ) {}

  async existeEmail(correo: string) {
    const { empty } = await this.angularFirestore
      .collection('Usuarios')
      .ref.where('correo', '==', correo)
      .limit(1)
      .get();

    return !empty;
  }

  async createUser(newUser: User, clave: string) {
    let flag = false;

    try {
      var loading = await this.system.presentLoading('Creando usuario');
      loading.present();
      if (this.network.type === this.network.Connection.NONE)
        throw new Error('No internet');
      if (await this.existeEmail(newUser.correo))
        throw new FirebaseError('auth/email-already-in-use', '');

      const {
        user: { uid },
      } = await this.angularFireAuth.createUserWithEmailAndPassword(
        newUser.correo,
        clave
      );

      newUser.uid = uid;

      if (newUser.foto !== '') {
        let b64 = await this.system.fileToBase64(newUser.foto);

        const r = await this.angularFireStorage
          .ref(`/foto/${newUser.uid}`)
          .putString(b64, 'base64', { contentType: 'image/jpeg' });
        const url = await r.ref.getDownloadURL();
        newUser.foto = url;
      }

      await this.angularFirestore
        .collection('Usuarios')
        .doc(newUser.uid)
        .set(newUser);

      if (newUser.estado === 'pendiente' && newUser.perfil === 'cliente')
        await this.notificationService.registroCliente();

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

  async loginAnonimo(anonimo: Anonimo) {
    const data = await this.angularFirestore
      .collection<any>('Usuarios')
      .ref.where('correo', '==', anonimo.correo)
      .limit(1)
      .get();

    if (!data.empty) {
      // throw ErrorStrings.EmailRepetido;
      //Para testing

      console.log(data.docs[0].data());

      let user = data.docs[0].data();

      if (user.perfil !== 'anonimo') throw ErrorTest.IngresoAnonimo;

      user = this.parseMesa(user);

      await this.localStorage.set('user', user);
      return;
    }

    anonimo.uid = this.system.createId();

    if (anonimo.foto !== '') {
      let b64 = await this.system.fileToBase64(anonimo.foto);

      const r = await this.angularFireStorage
        .ref(`/foto/${anonimo.uid}`)
        .putString(b64, 'base64', { contentType: 'image/jpeg' });
      const url = await r.ref.getDownloadURL();
      anonimo.foto = url;
    }

    await this.angularFirestore
      .collection('Usuarios')
      .doc(anonimo.uid)
      .set(anonimo);

    await this.localStorage.set('user', anonimo);
  }

  async cambiarEstadoUsuario(
    uid: string,
    email: string,
    estado: estado
  ): Promise<boolean> {
    let flag = false;

    try {
      await this.angularFirestore
        .collection('Usuarios')
        .doc(uid)
        .update({ estado });
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
    return this.angularFirestore
      .collection<User>('Usuarios', (ref) =>
        ref.where('perfil', '==', 'cliente').where('estado', '==', 'pendiente')
      )
      .valueChanges();
  }

  getUsuariosEnEspera(): Observable<Cliente[]> {
    return this.angularFirestore
      .collection<Cliente>('Usuarios', (ref) =>
        ref
          .where('perfil', 'in', ['cliente', 'anonimo'])
          .where('estado', '==', 'confirmado')
          .where('estadoIngreso', '==', 'espera')
      )
      .valueChanges();
  }

  async asignarMesaUsuario(uid: string, mesaId: string): Promise<void> {
    const user = {
      mesa: this.angularFirestore.doc(`Mesas/${mesaId}`).ref,
      estadoIngreso: 'buscando',
      encuestaHecha: false,
    };

    try {
      await this.angularFirestore.collection('Usuarios').doc(uid).update(user);
      await this.angularFirestore
        .collection('Mesas')
        .doc(mesaId)
        .update({ estado: 'ocupada' });

      this.system.presentToast('La cuenta se a creado con éxito!');
    } catch (error) {
      console.log(error);
      this.system.presentToastError(ErrorStrings.AsignarMesa);
    }
  }

  async desasignarMesa(cliente: Cliente): Promise<void> {
    try {
      await this.angularFirestore
        .collection('Usuarios')
        .doc(cliente.uid)
        .update({
          mesa: null,
          estadoIngreso: 'no ingreso',
        });
      this.mesasService.updateEstado(cliente.mesa.mesaId, 'desocupada');
    } catch (error) {
      console.log(error);
    }
  }

  cambiarEstadoIngresoUsuario(
    uid: string,
    estadoIngreso: estadoIngreso
  ): Promise<void> {
    return this.angularFirestore
      .collection('Usuarios')
      .doc(uid)
      .update({ estadoIngreso });
  }

  esperandoMesaUsuario() {
    this.localStorage.get('user').then(async (u) => {
      const sub = this.angularFirestore
        .doc<Cliente>(`Usuarios/${u.uid}`)
        .valueChanges()
        .pipe(map(this.parseMesa))
        .subscribe(async (data) => {
          const user = await data;
          if (user.estadoIngreso === 'buscando') {
            await this.localStorage.set('user', user);
            this.nav.navigateBack('/cliente/buscar');
            sub.unsubscribe();
          }
        });
    });
  }

  private async parseMesa(user: any) {
    if (user.mesa === undefined) return user as Cliente;

    user.mesa = (await user.mesa.get()).data();

    return user as Cliente;
  }
}
