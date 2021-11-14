import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RealizarPedidoPageRoutingModule } from './realizar-pedido-routing.module';

import { RealizarPedidoPage } from './realizar-pedido.page';
import { UtilityModule } from '../../../../utility/utility.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RealizarPedidoPageRoutingModule,
    UtilityModule,
  ],
  declarations: [RealizarPedidoPage],
})
export class RealizarPedidoPageModule {}
