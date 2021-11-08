import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UtilityModule } from '../../utility/utility.module';
import { MozoPage } from './mozo.page';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ListaChatsComponent } from './components/lista-chats/lista-chats.component';
import { MozoPageRoutingModule } from './mozo-routing.module';
import { PedidoDetailsComponent } from './components/pedido-details/pedido-details.component';
import { ConsultasModule } from '../../consultas/consultas.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MozoPageRoutingModule,
    UtilityModule,
    ConsultasModule,
  ],
  declarations: [
    MozoPage,
    PedidosComponent,
    ListaChatsComponent,
    PedidoDetailsComponent,
  ],
})
export class MozoPageModule {}
