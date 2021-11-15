import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';

import { RealizarPedidoPageRoutingModule } from './realizar-pedido-routing.module';

import { RealizarPedidoPage } from './realizar-pedido.page';
import { UtilityModule } from '../../../../utility/utility.module';
import { DetalleCartaComponent } from '../modals/detalle-carta/detalle-carta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RealizarPedidoPageRoutingModule,
    UtilityModule,
    SwiperModule
  ],
  declarations: [RealizarPedidoPage, DetalleCartaComponent],
})
export class RealizarPedidoPageModule {}
