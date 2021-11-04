import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadisticasPage } from './estadisticas.page';
import { GraficosComponent } from './components/graficos/graficos.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasPage,
    children: [
      {
        path: '',
        redirectTo: 'grafica',
      },
      {
        path: 'grafica',
        component: GraficosComponent,
      },
      {
        path: 'comentarios',
        component: ComentariosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadisticasPageRoutingModule {}
