import { Component, OnInit } from '@angular/core';
import { Comentario } from 'src/app/models/interfaces/encuestas.model';
import { EncuestasService } from '../../../../../services/encuestas.service';
import { DetalleComentarioComponent } from '../../modals/detalle-comentario/detalle-comentario.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnInit {
  route: string = '/cliente/espera';

  comentarios: Comentario[];

  constructor(
    private encuestasService: EncuestasService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.encuestasService.getComentarios.subscribe((data) => {
      console.log(data);
      this.comentarios = data;
    });
  }

  async detalleFoto(fotos: string[]) {
    const modal = await this.modalController.create({
      component: DetalleComentarioComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: true,
      componentProps: {
        fotos,
      },
    });
    return await modal.present();
  }
}
