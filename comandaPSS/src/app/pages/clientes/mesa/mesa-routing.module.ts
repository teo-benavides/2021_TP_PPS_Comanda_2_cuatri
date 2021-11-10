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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesaPageRoutingModule {}
