import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { EstadisticasPageRoutingModule } from './estadisticas-routing.module';

import { EstadisticasPage } from './estadisticas.page';
import { GraficosComponent } from './components/graficos/graficos.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { DetalleComentarioComponent } from './modals/detalle-comentario/detalle-comentario.component';
import { UtilityModule } from '../../../utility/utility.module';
import { GraficosModule } from '../../../graficos/graficos.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilityModule,
    SwiperModule,
    EstadisticasPageRoutingModule,
    GraficosModule,
  ],
  declarations: [
    EstadisticasPage,
    GraficosComponent,
    ComentariosComponent,
    DetalleComentarioComponent,
  ],
})
export class EstadisticasPageModule {}
