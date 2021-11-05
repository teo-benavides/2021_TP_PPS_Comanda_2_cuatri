import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { EstadisticaInfo } from '../../../models/interfaces/encuestas.model';
@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements AfterViewInit {
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  @Input() datos: EstadisticaInfo;
  doughnutChart: Chart<'doughnut', number[], string>;

  constructor() {}

  ngAfterViewInit() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.datos.tipo,
        datasets: [
          {
            label: 'Clientes',
            data: this.datos.data,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',

            hoverBackgroundColor: '#FFCE56',
          },
        ],
      },
    });
  }
}
