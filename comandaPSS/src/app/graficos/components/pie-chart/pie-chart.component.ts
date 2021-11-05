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
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild('pieCanvas') private pieCanvas: ElementRef;
  @Input() datos: EstadisticaInfo;
  pieChart: Chart<'pie', number[], string>;

  constructor() {}

  ngAfterViewInit() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.datos.tipo,
        datasets: [
          {
            label: 'Dataset 1',
            data: this.datos.data,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
}
