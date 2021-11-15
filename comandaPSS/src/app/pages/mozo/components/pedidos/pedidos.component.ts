import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Pedido } from 'src/app/models/interfaces/pedido.model';
import { Preparacion } from 'src/app/models/interfaces/preparacion.model';
import { NotificationService } from 'src/app/services/notification.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PreparacionService } from 'src/app/services/preparacion.service';
import { ProductoService } from 'src/app/services/producto.service';
import { PedidoDetailsComponent } from '../pedido-details/pedido-details.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  pedidosConfirmar: Pedido[];
  pedidosEntregar: Pedido[];
  pedidosCobrar: Pedido[];
  pedidosPreparando: Pedido[];

  constructor(
    public pedidoService: PedidoService,
    private productoService: ProductoService,
    private preparacionService: PreparacionService,
    private modalController: ModalController,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.pedidoService.getPedidos("pendiente")
      .then(
        p => p.subscribe(data => this.pedidosConfirmar = data)
      );
    this.pedidoService.getPedidos("terminado")
      .then(
        p => p.subscribe(data => this.pedidosEntregar = data)
      );
    this.pedidoService.getPedidos("aPagar")
      .then(
        p => p.subscribe(data => this.pedidosCobrar = data)
      );
    this.pedidoService.getPedidos("preparando")
      .then(
        p => p.subscribe(data => this.pedidosPreparando = data)
      );
  }

  public async confirmarPedido(pedido: Pedido) {
    pedido.estado = "preparando";
    this.pedidoService.updatePedido(pedido);
    this.preparacionService.hasComidasForPedido(pedido.pedidoId)
      .then(
        (val) => val ? this.notificationService.nuevasComidas() : null
      );
    this.preparacionService.hasBebidasForPedido(pedido.pedidoId)
      .then(
        (val) => val ? this.notificationService.nuevasBebidas() : null
      );
  }

  public rechazarPedido(pedido: Pedido) {
    this.pedidoService.deletePedido(pedido);
  }

  public entregarPedido(pedido: Pedido) {
    pedido.estado = "entregado";
    this.pedidoService.updatePedido(pedido);
  }

  public cobrarPedido(pedido: Pedido) {
    this.pedidoService.deletePedido(pedido);
    // liberar mesa
  }

  async presentModal(pedido: Pedido) {
    const pedidoId = pedido.pedidoId;
    const modal = await this.modalController.create({
      component: PedidoDetailsComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        pedidoId
      },
    });
    return await modal.present();
  }

  public async debugCrearPedido() {
    let p: Preparacion = {
      estado: "pendiente",
      pedidoId: "mozo-test",
      preparacionId: "1234",
      producto: await this.productoService.getById("p6SloIaDyiov2Exax4ba").then(val => val)
    };

    let p2: Preparacion = {
      estado: "pendiente",
      pedidoId: "mozo-test",
      preparacionId: "12345",
      producto: await this.productoService.getById("p6SloIaDyiov2Exax4ba").then(val => val)
    };

    let pedido: Pedido = {
      estado: "pendiente",
      pedidoId: "mozo-test",
      precioTotal: 123,
      tiempoEstimado: 60,
      mesaId: "",
      numeroMesa: 1,
      preparaciones: []
    };

    // agregar preparaciones para mostrar en modal o lo que sea
    pedido.preparaciones.push(p);
    pedido.preparaciones.push(p2);
    this.pedidoService.crearPedido(pedido);
  }
}
