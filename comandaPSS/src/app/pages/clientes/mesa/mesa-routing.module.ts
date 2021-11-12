import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesaPage } from './mesa.page';

const routes: Routes = [
  {
    path: '',
    component: MesaPage,
  },
  {
    path: 'carta',
    loadChildren: () =>
      import('./carta/carta.module').then((m) => m.CartaPageModule),
  },
  {
    path: 'realizar-pedido',
    loadChildren: () =>
      import('./realizar-pedido/realizar-pedido.module').then(
        (m) => m.RealizarPedidoPageModule
      ),
  },
  {
    path: 'encuesta',
    loadChildren: () =>
      import('../encuesta/encuesta.module').then((m) => m.EncuestaPageModule),
  },
  {
    path: 'estadisticas',
    loadChildren: () =>
      import('../estadisticas/estadisticas.module').then(
        (m) => m.EstadisticasPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesaPageRoutingModule {}
