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
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit {
  @ViewChild('barCanvas') barCanvas: ElementRef;
  @Input() datos: EstadisticaInfo;
  @Input() horizontal: boolean = false;
  barChart: any;

  constructor() {}

  ngAfterViewInit() {
    console.log(this.barCanvas, this.datos);
    Chart.register(...registerables);
    let options = {};

    if (this.horizontal) {
      options = {
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
      };
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.datos.tipo,
        datasets: [
          {
            label: 'Clientes',
            data: this.datos.data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 0.2)',
            borderWidth: 1,
          },
        ],
      },
      options,
    });
  }
}
