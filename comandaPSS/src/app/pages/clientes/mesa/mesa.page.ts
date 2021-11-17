import { Component, ElementRef, OnInit } from '@angular/core';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { ChatComponent } from 'src/app/consultas/modals/chat/chat.component';
import { Cliente } from 'src/app/models/interfaces/user.model';
import { Storage } from '@ionic/storage-angular';
import { Pedido, PedidoEstado } from 'src/app/models/interfaces/pedido.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { QrService } from 'src/app/services/qr.service';
import { DetalleCuentaComponent } from './modals/detalle-cuenta/detalle-cuenta.component';
import { PreparacionService } from 'src/app/services/preparacion.service';
import { Preparacion } from 'src/app/models/interfaces/preparacion.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MesasService } from 'src/app/services/mesas.service';
import { SystemService } from '../../../utility/services/system.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {
  cliente: Cliente = null;
  pedido: Pedido = null;

  constructor(
    private modalController: ModalController,
    private nav: NavController,
    private localStorage: Storage,
    private pedidoService: PedidoService,
    private preparacionService: PreparacionService,
    private usuarioService: UsuarioService,
    private mesasService: MesasService,
    private qrService: QrService,
    public actionSheetController: ActionSheetController,
    private system: SystemService
  ) {}

  ngOnInit() {
    this.localStorage.get('user').then((data) => {
      console.log(data);
      this.cliente = data;
      this.pedidoService.getPedidoByMesaId(this.cliente.mesa.mesaId).then((p) =>
        p.subscribe((data) => {
          this.pedido = data[0];
          console.log(data[0]);
          if (this.pedido?.estado === 'pagado') {
            this.usuarioService
              .desasignarMesa(this.cliente)
              .then(() => this.nav.navigateRoot('/cliente/ingreso'))
              .catch(console.log);
            this.pedidoService.deletePedido(this.pedido);
          }
        })
      );
    });
  }

  navigateToCarta() {
    // no funciona el path local (o sea "carta")
    this.nav.navigateForward('cliente/mesa/carta');
  }

  navigateToRealizarPedido() {
    this.nav.navigateForward('cliente/mesa/realizar-pedido');
  }

  async encuesta() {
    if ((await this.localStorage.get('user')).encuestaHecha) {
      return this.system.presentToastError(
        'Solo se permite realizar la encuesta una vez por cliente.'
      );
    }
    this.nav.navigateForward('/cliente/mesa/encuesta');
  }

  estadistica() {
    this.nav.navigateForward('cliente/mesa/estadisticas');
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

  getEstadoPedido(estadoPedido: string) {
    const estado = estadoPedido || '';
    switch (estado) {
      case 'pendiente':
        return 'Confirmando pedido';
      case 'preparando':
        return 'Preparando pedido';
      case 'terminado':
        return 'Entregando pedido';
      case 'confirmarEntrega':
        return 'Esperando confirmación del cliente';
      case 'entregado':
        return 'Pedido entregado';
      case 'aPagar':
        return 'Esperando confirmación de pago';
      case 'pagado':
        return 'Pedido pagado';
      default:
        return 'No se ha realizado un pedido';
    }
  }

  desactivarEncuesta(estadoPedido: string) {
    const estado = estadoPedido || '';
    switch (estado) {
      case 'pendiente':
      case 'preparando':
      case 'terminado':
      case 'confirmarEntrega':
        return true;
      case 'entregado':
      case 'aPagar':
      case 'pagado':
        return false;
      default:
        return true;
    }
  }

  getTiempoEstimado(pedido: number) {
    if (!this.pedido) {
      return '-- MIN';
    }

    switch (this.pedido.estado) {
      case 'pendiente':
        return '-- MIN';
      case 'preparando':
      case 'terminado':
      case 'confirmarEntrega':
        return `${this.pedido.tiempoEstimado} MIN`;
      case 'entregado':
      case 'aPagar':
      case 'pagado':
        return `Precio: $ ${this.pedido.precioTotal} `;
      default:
        return 'No se ha realizado un pedido';
    }
  }

  confirmarEntrega() {
    this.pedido.estado = 'entregado';
    this.pedidoService.updatePedido(this.pedido);
  }

  async pedirCuenta() {
    const propina = await this.qrService.scanPropina();
    if (propina > -1) {
      const modal = await this.modalController.create({
        component: DetalleCuentaComponent,
        swipeToClose: true,
        presentingElement: await this.modalController.getTop(),
        backdropDismiss: false,
        componentProps: {
          pedido: this.pedido,
          propina: propina,
        },
      });
      return await modal.present();
    }
  }

  async encuestaDone() {
    return;
  }
}
