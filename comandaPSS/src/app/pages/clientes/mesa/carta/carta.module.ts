import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartaPageRoutingModule } from './carta-routing.module';

import { CartaPage } from './carta.page';
import { UtilityModule } from '../../../../utility/utility.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartaPageRoutingModule,
    UtilityModule,
  ],
  declarations: [CartaPage],
})
export class CartaPageModule {}
