import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';
import { ConfirmaUsuarioComponent } from './components/confirma-usuario/confirma-usuario.component';
import { AltaMesaComponent } from '../../altas/modals/alta-mesa/alta-mesa.component';
import { AltasComponent } from './components/altas/altas.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'confirmar',
        component: ConfirmaUsuarioComponent,
      },
      {
        path: 'altas',
        component: AltasComponent,
      },
      {
        path: '',
        redirectTo: 'confirmar',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
