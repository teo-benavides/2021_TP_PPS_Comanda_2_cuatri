import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from 'src/app/models/interfaces/user.model';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from 'src/app/consultas/modals/chat/chat.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  cliente: Cliente = null;

  constructor(
    private localStorage: Storage,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.localStorage.get('user').then((data) => {
      this.cliente = data;
    });
  }

  async modalConsultas() {
    const modal = await this.modalController.create({
      component: ChatComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        path: this.cliente.mesa.numeroMesa,
        color: 'secondary',
      },
    });
    return await modal.present();
  }
}
