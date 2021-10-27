import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { CocineroPage } from './cocinero.page';

import { UtilityModule } from '../../utility/utility.module';
import { CocineroPageRoutingModule } from './cocinero-routing.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CocineroPageRoutingModule,
    UtilityModule,
  ],
  declarations: [CocineroPage],
})
export class CocineroPageModule {}
