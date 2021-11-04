import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaPageRoutingModule } from './encuesta-routing.module';

import { EncuestaPage } from './encuesta.page';
import { UtilityModule } from '../../../utility/utility.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaPageRoutingModule,
    UtilityModule,
    ReactiveFormsModule,
  ],
  declarations: [EncuestaPage],
})
export class EncuestaPageModule {}
