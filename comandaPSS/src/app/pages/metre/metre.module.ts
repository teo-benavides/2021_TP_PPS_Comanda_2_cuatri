import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetrePageRoutingModule } from './metre-routing.module';

import { MetrePage } from './metre.page';
import { UtilityModule } from '../../utility/utility.module';
import { AltasModule } from '../../altas/altas.module';
import { AsignarMesaComponent } from './modals/asignar-mesa/asignar-mesa.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetrePageRoutingModule,
    UtilityModule,
    AltasModule,
  ],
  declarations: [MetrePage, AsignarMesaComponent],
})
export class MetrePageModule {}
