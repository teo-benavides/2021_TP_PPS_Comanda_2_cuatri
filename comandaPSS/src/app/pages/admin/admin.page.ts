import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AltaUsuarioComponent } from 'src/app/altas/modals/alta-usuario/alta-usuario.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async presentModal() {
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
}
