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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
