import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from 'src/app/models/interfaces/user.model';
import { ModalController, NavController } from '@ionic/angular';
import { ChatComponent } from 'src/app/consultas/modals/chat/chat.component';
import { QrService } from 'src/app/services/qr.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SystemService } from 'src/app/utility/services/system.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  cliente: Cliente = null;

  constructor(
    private localStorage: Storage,
    private modalController: ModalController,
    private qrService: QrService,
    private usuarioService: UsuarioService,
    private system: SystemService,
    private nav: NavController,
  ) {}

  ngOnInit() {
    this.localStorage.get('user').then((data) => {
      this.cliente = data;
    });
  }

  async scanQr() {
    try {
      var loading = await this.system.presentLoading('Ingresando a la lista');
      loading.present();
      if (await this.qrService.scanAndCompare(this.cliente.mesa?.mesaId)) {
        await this.usuarioService.cambiarEstadoIngresoUsuario(
          this.cliente.uid,
          "mesa"
        );
        //await this.notificationService.ingresoCliente();
        this.cliente.estadoIngreso = 'mesa';
        this.localStorage.set('user', this.cliente);
        this.nav.navigateBack('/cliente/mesa');
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.dismiss();
    }
  }

  async modalConsultas() {
    const modal = await this.modalController.create({
      component: ChatComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        path: this.cliente.mesa.numeroMesa,
        color: 'secondary',
      },
    });
    return await modal.present();
  }
}
