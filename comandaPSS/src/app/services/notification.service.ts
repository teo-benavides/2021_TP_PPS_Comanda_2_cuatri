import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Storage } from '@ionic/storage-angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SystemService } from '../utility/services/system.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  listener: any;

  constructor(
    private firebaseX: FirebaseX,
    private localStorage: Storage,
    private angularFirestore: AngularFirestore,
    private system: SystemService,
    private http: HttpClient
  ) {}

  async init() {
    const token = await this.firebaseX.getToken();
    const { uid } = await this.localStorage.get('user');

    await this.angularFirestore.doc(`Usuarios/${uid}`).update({ token });

    this.listener = this.firebaseX.onMessageReceived().subscribe((msg) => {
      console.log(msg);
      this.system.presentToast(msg.body, 3000);
    });
  }

  endProcess() {
    this.listener.unsubscribe();
  }

  async registroCliente() {
    await this.http.get(`${environment.backendUrl}registroCliente`).toPromise();
  }

  async ingresoCliente() {
    await this.http.get(`${environment.backendUrl}ingresoCliente`).toPromise();
  }
}
