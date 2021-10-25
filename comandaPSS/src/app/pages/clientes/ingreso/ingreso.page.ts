import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/models/interfaces/user.model';
import { QrService } from '../../../services/qr.service';
import { UsuarioService } from '../../../services/usuario.service';
import { NavController } from '@ionic/angular';
import { SystemService } from '../../../utility/services/system.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage implements OnInit {
  cliente: User = null;

  constructor(
    private storage: Storage,
    private qr: QrService,
    private usuario: UsuarioService,
    private nav: NavController,
    private system: SystemService
  ) {}

  async ngOnInit() {
    this.cliente = (await this.storage.get('user')) as User;

    console.log(this.cliente);
  }

  async scanQr() {
    try {
      var loading = await this.system.presentLoading('Ingresando a la lista');
      loading.present();
      if (await this.qr.ingresoQR()) {
        await this.usuario.cambiarEstadoIngresoUsuario(
          this.cliente.uid,
          'espera'
        );
        this.cliente.estadoIngreso = 'espera';
        this.storage.set('user', this.cliente);
        this.nav.navigateBack('/cliente/espera');
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.dismiss();
    }
  }
}
