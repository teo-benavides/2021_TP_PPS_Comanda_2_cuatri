import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/admin.module').then((m) => m.AdminPageModule),
      },
      {
        path: 'metre',
        loadChildren: () =>
          import('../metre/metre.module').then((m) => m.MetrePageModule),
      },
      {
        path: 'cocinero',
        loadChildren: () =>
          import('src/app/pages/cocinero/cocinero.module').then(
            (m) => m.CocineroPageModule
          ),
      },
      {
        path: 'bartender',
        loadChildren: () =>
          import('src/app/pages/bartender/bartender.module').then(
            (m) => m.BartenderPageModule
          ),
      },
      {
        path: 'cliente',
        children: [
          {
            path: 'ingreso',
            loadChildren: () =>
              import('../clientes/ingreso/ingreso.module').then(
                (m) => m.IngresoPageModule
              ),
          },
          {
            path: 'espera',
            loadChildren: () =>
              import('../clientes/espera/espera.module').then(
                (m) => m.EsperaPageModule
              ),
          },
          {
            path: 'mesa',
            loadChildren: () =>
              import('../clientes/mesa/mesa.module').then(
                (m) => m.MesaPageModule
              ),
          },
          {
            path: 'buscar',
            loadChildren: () =>
              import('../clientes/buscar/buscar.module').then(
                (m) => m.BuscarPageModule
              ),
          },
          {
            path: 'encuesta',
            loadChildren: () =>
              import('../clientes/encuesta/encuesta.module').then(
                (m) => m.EncuestaPageModule
              ),
          },
          {
            path: 'estadisticas',
            loadChildren: () =>
              import('../clientes/estadisticas/estadisticas.module').then(
                (m) => m.EstadisticasPageModule
              ),
          },
          {
            path: '',
            redirectTo: 'ingreso',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
