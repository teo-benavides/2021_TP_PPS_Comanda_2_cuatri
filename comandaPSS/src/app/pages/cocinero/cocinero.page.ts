import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AltaProductoComponent } from 'src/app/altas/modals/alta-producto/alta-producto.component';

@Component({
  selector: 'app-cocinero',
  templateUrl: './cocinero.page.html',
  styleUrls: ['./cocinero.page.scss'],
})
export class CocineroPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: AltaProductoComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false
    });
    return await modal.present();
  }
}
