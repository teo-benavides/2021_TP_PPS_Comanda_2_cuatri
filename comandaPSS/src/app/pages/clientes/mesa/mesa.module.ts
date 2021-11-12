import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesaPageRoutingModule } from './mesa-routing.module';

import { MesaPage } from './mesa.page';
import { UtilityModule } from '../../../utility/utility.module';
import { DetalleCuentaComponent } from './modals/detalle-cuenta/detalle-cuenta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesaPageRoutingModule,
    UtilityModule,
  ],
  declarations: [MesaPage, DetalleCuentaComponent],
})
export class MesaPageModule {}
