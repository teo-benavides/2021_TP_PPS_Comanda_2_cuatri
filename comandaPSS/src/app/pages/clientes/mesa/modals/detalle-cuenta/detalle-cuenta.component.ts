import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Pedido } from 'src/app/models/interfaces/pedido.model';
import { Preparacion } from 'src/app/models/interfaces/preparacion.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { PreparacionService } from 'src/app/services/preparacion.service';

@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.component.html',
  styleUrls: ['./detalle-cuenta.component.scss'],
})
export class DetalleCuentaComponent implements OnInit {
  @Input() pedido: Pedido;
  @Input() propina: number;
  preparaciones: Preparacion[];

  constructor(
    private preparacionService: PreparacionService,
    private pedidoService: PedidoService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.preparacionService.getPreparacionesByPedidoId(this.pedido.pedidoId)
      .then((p) => p.subscribe(
        (data) => this.preparaciones = data
      ));
  }

  confirmar() {
    this.pedido.estado = "aPagar";
    this.pedidoService.updatePedido(this.pedido).then(
      () => this.cerrarModal()
    );
    
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

}
