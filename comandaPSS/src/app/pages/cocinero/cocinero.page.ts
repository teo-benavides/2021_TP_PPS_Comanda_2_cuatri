import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AltaProductoComponent } from 'src/app/altas/modals/alta-producto/alta-producto.component';
import { Preparacion } from 'src/app/models/interfaces/preparacion.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/models/interfaces/pedido.model';
import { SystemService } from 'src/app/utility/services/system.service';
import { ProductoService } from 'src/app/services/producto.service';
import { PreparacionService } from 'src/app/services/preparacion.service';

@Component({
  selector: 'app-cocinero',
  templateUrl: './cocinero.page.html',
  styleUrls: ['./cocinero.page.scss'],
})
export class CocineroPage implements OnInit {
  comidasPendientes: Preparacion[];
  comidasPreparando: Preparacion[];

  constructor(
    public productoService: ProductoService,
    public preparacionService: PreparacionService,
    public pedidoService: PedidoService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.preparacionService
      .getPreparaciones('pendiente', 'comida')
      .then((p) => p.subscribe((data) => (this.comidasPendientes = data)));
    this.preparacionService
      .getPreparaciones('preparando', 'comida')
      .then((p) => p.subscribe((data) => (this.comidasPreparando = data)));
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AltaProductoComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        tipo: 'comida',
      },
    });
    return await modal.present();
  }

  public prepararPreparacion(preparacion: Preparacion) {
    this.preparacionService.updatePreparacionState(
      preparacion.preparacionId,
      'preparando'
    );
  }

  public terminarPreparacion(preparacion: Preparacion) {
    this.preparacionService.updatePreparacionState(
      preparacion.preparacionId,
      'terminado'
    );
  }

  // public async debugCrearPedido() {
  //   let p: Preparacion = {
  //     estado: "pendiente",
  //     pedidoId: "1234567890",
  //     preparacionId: "1234",
  //     producto: await this.productoService.getById("p6SloIaDyiov2Exax4ba").then(val => val)
  //   };

  //   let pedido: Pedido = {
  //     estado: "preparando",
  //     pedidoId: "1234567890",
  //     precioTotal: 123,
  //     tiempoEstimado: 60,
  //     mesa: null,
  //     preparaciones: []
  //   };

  //   pedido.preparaciones.push(p);
  //   this.pedidoService.crearPedido(pedido);
  // }
}
