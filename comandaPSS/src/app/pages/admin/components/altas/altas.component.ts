import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AltaMesaComponent } from 'src/app/altas/modals/alta-mesa/alta-mesa.component';
import { AltaUsuarioComponent } from 'src/app/altas/modals/alta-usuario/alta-usuario.component';

@Component({
  selector: 'app-altas',
  templateUrl: './altas.component.html',
  styleUrls: ['./altas.component.scss'],
})
export class AltasComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async presentModalAltaUsuarios() {
    const modal = await this.modalController.create({
      component: AltaUsuarioComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        type: 'dueño',
      },
    });
    return await modal.present();
  }

  async presentModalAltaMesa() {
    const modal = await this.modalController.create({
      component: AltaMesaComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        type: 'dueño',
      },
    });
    return await modal.present();
  }
}
