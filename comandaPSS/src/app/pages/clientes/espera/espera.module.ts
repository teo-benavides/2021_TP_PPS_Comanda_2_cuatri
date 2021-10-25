import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EsperaPageRoutingModule } from './espera-routing.module';

import { EsperaPage } from './espera.page';
import { UtilityModule } from '../../../utility/utility.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EsperaPageRoutingModule,
    UtilityModule,
  ],
  declarations: [EsperaPage],
})
export class EsperaPageModule {}
