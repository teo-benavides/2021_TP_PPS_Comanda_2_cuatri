import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Base64 } from '@ionic-native/base64/ngx';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { AltaUsuarioComponent } from './modals/alta-usuario/alta-usuario.component';
import { AltaMesaComponent } from './modals/alta-mesa/alta-mesa.component';

@NgModule({
  declarations: [AltaUsuarioComponent, AltaMesaComponent],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, NgxQRCodeModule],
  exports: [AltaUsuarioComponent, AltaMesaComponent],
  providers: [Base64],
})
export class AltasModule {}
