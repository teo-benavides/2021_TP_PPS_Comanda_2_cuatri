import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SwiperOptions } from 'swiper';
import SwiperCore, { Pagination } from 'swiper/core';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-detalle-comentario',
  templateUrl: './detalle-comentario.component.html',
  styleUrls: ['./detalle-comentario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetalleComentarioComponent implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;
  @Input() fotos: string[] = [];
  config: SwiperOptions = {
    spaceBetween: 10,
    slidesPerView: 1,
    pagination: true,
    scrollbar: { draggable: true },
  };

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  cancelar() {
    this.modalController.dismiss();
  }
}
