import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { IonicModule } from '@ionic/angular';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

@NgModule({
  declarations: [BarChartComponent, DonutChartComponent, PieChartComponent],
  imports: [IonicModule, CommonModule],
  exports: [BarChartComponent, DonutChartComponent, PieChartComponent],
})
export class GraficosModule {}
