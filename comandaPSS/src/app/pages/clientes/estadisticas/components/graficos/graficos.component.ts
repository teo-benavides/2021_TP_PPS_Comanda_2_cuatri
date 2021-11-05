import { Component, OnInit } from '@angular/core';
import { EncuestasService } from '../../../../../services/encuestas.service';
import { Estadisticas } from '../../../../../models/interfaces/encuestas.model';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss'],
})
export class GraficosComponent implements OnInit {
  route: string = '/cliente/espera';
  estadisticas: Estadisticas;

  constructor(private encuestasService: EncuestasService) {}

  ngOnInit() {
    this.encuestasService.getEstadisticas().then((data) => {
      this.estadisticas = data;
    });
  }
}
