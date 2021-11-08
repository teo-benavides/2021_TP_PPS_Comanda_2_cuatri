import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Mensaje } from '../models/interfaces/chat.model';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { SystemService } from '../utility/services/system.service';
import { ErrorStrings } from '../models/enums/errorStrings';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public correo: string;

  constructor(
    private angularFirestore: AngularFirestore,
    private storage: Storage,
    private system: SystemService
  ) {}

  async init() {
    this.correo = (await this.storage.get('user')).correo;
  }

  getConsultas(path: string) {
    return this.angularFirestore
      .collection(`Consultas/${path}/chat`)
      .valueChanges()
      .pipe(
        map((d) => {
          const msg: Mensaje[] = d.map<Mensaje>((d: any) => {
            return {
              ...d,
              date: d.date.toDate(),
            };
          });
          return msg.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
          });
        })
      );
  }

  enviarConsulta(path: string, msg: string) {
    const payload: Mensaje = {
      msg,
      date: new Date(),
      correo: this.correo,
    };
    this.angularFirestore
      .collection(`Consultas/${path}/chat`)
      .add(payload)
      .catch((error) => {
        console.log(error);
        this.system.presentToastError(ErrorStrings.BadConsulta);
      });
  }
}
