import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaChatsComponent } from './components/lista-chats/lista-chats.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';

import { MozoPage } from './mozo.page';

const routes: Routes = [
  {
    path: '',
    component: MozoPage,
    children: [
      {
        path: 'pedidos',
        component: PedidosComponent,
      },
      {
        path: 'lista-chats',
        component: ListaChatsComponent,
      },
      {
        path: '',
        redirectTo: 'pedidos',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MozoPageRoutingModule {}
