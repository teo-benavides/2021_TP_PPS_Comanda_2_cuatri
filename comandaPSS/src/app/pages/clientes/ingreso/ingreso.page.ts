import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Cliente, User } from 'src/app/models/interfaces/user.model';
import { QrService } from '../../../services/qr.service';
import { UsuarioService } from '../../../services/usuario.service';
import { NavController } from '@ionic/angular';
import { SystemService } from '../../../utility/services/system.service';
import { Anonimo } from '../../../models/interfaces/user.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage implements OnInit {
  cliente: Cliente = null;
  flag: boolean = false;
  constructor(
    private storage: Storage,
    private qr: QrService,
    private UsuarioService: UsuarioService,
    private nav: NavController,
    private system: SystemService,
    private notificationService: NotificationService,
    private navController: NavController
  ) {}

  async ngOnInit() {
    this.cliente = (await this.storage.get('user')) as User;
    this.flag = ((await this.storage.get('dobleIngreso')) as boolean) || false;
    console.log(this.cliente, this.flag);
  }

  async scanQr() {
    try {
      var loading = await this.system.presentLoading('Ingresando a la lista');
      loading.present();
      if (await this.qr.ingresoQR()) {
        await this.UsuarioService.cambiarEstadoIngresoUsuario(
          this.cliente.uid,
          'espera'
        );
        await this.notificationService.ingresoCliente();
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

  estadistica() {
    this.navController.navigateBack('/cliente/estadisticas');
  }
}
