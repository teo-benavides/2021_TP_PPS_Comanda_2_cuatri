import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Preparacion } from 'src/app/models/interfaces/preparacion.model';
import { PreparacionService } from 'src/app/services/preparacion.service';

@Component({
  selector: 'app-pedido-details',
  templateUrl: './pedido-details.component.html',
  styleUrls: ['./pedido-details.component.scss'],
})
export class PedidoDetailsComponent implements OnInit {
  @Input() pedidoId: string = '';
  preparaciones: Preparacion[];
  constructor(private modalController: ModalController, private preparacionService: PreparacionService) { }

  ngOnInit() {
    this.preparacionService.getPreparacionesByPedidoId(this.pedidoId)
    .then(
      p => p.subscribe(data => {this.preparaciones = data; console.log(this.preparaciones);})
    );
  }

  cancelar() {
    this.modalController.dismiss();
  }
}
