import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SystemService } from '../utility/services/system.service';
import { User, estado } from '../models/interfaces/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private db: AngularFirestore, private system: SystemService) {}

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
