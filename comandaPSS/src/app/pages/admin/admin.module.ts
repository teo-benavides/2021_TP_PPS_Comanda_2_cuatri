import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { ConfirmaUsuarioComponent } from './components/confirma-usuario/confirma-usuario.component';
import { AltasComponent } from './components/altas/altas.component';
import { UtilityModule } from '../../utility/utility.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    UtilityModule,
  ],
  declarations: [AdminPage, ConfirmaUsuarioComponent, AltasComponent],
})
export class AdminPageModule {}
