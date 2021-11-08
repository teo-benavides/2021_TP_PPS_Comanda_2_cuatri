import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './modals/chat/chat.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChatComponent],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  exports: [ChatComponent],
})
export class ConsultasModule {}
