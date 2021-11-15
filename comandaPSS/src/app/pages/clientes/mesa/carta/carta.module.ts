import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { CartaPageRoutingModule } from './carta-routing.module';

import { CartaPage } from './carta.page';
import { UtilityModule } from '../../../../utility/utility.module';
import { DetalleCartaComponent } from '../modals/detalle-carta/detalle-carta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartaPageRoutingModule,
    UtilityModule,
    SwiperModule
  ],
  declarations: [CartaPage, DetalleCartaComponent],
})
export class CartaPageModule {}
