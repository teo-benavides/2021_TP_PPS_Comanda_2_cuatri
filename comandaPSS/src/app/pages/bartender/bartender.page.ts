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
  selector: 'app-bartender',
  templateUrl: './bartender.page.html',
  styleUrls: ['./bartender.page.scss'],
})
export class BartenderPage implements OnInit {
  bebidasPendientes: Preparacion[];
  bebidasPreparando: Preparacion[];

  constructor(
    public productoService: ProductoService,
    public preparacionService: PreparacionService,
    public pedidoService: PedidoService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.preparacionService
      .getPreparaciones('pendiente', 'bebida')
      .then((p) => p.subscribe((data) => (this.bebidasPendientes = data)));
    this.preparacionService
      .getPreparaciones('preparando', 'bebida')
      .then((p) => p.subscribe((data) => (this.bebidasPreparando = data)));
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AltaProductoComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        tipo: 'bebida',
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
  //     pedidoId: "09876",
  //     preparacionId: "345345",
  //     producto: await this.productoService.getById("MtUApEVwyCbirtYarvYO").then(val => val)
  //   };

  //   let pedido: Pedido = {
  //     estado: "preparando",
  //     pedidoId: "09876",
  //     precioTotal: 123,
  //     tiempoEstimado: 60,
  //     mesa: null,
  //     preparaciones: []
  //   };

  //   pedido.preparaciones.push(p);
  //   this.pedidoService.crearPedido(pedido);
  // }
}
