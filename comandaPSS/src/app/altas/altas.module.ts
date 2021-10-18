import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AltaUsuarioComponent } from './components/alta-usuario/alta-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Base64 } from '@ionic-native/base64/ngx';
@NgModule({
  declarations: [AltaUsuarioComponent],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  exports: [AltaUsuarioComponent],
  providers: [Base64],
})
export class AltasModule {}
