import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ChatComponent } from 'src/app/consultas/modals/chat/chat.component';
import { Cliente } from 'src/app/models/interfaces/user.model';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {
  cliente: Cliente = null;

  constructor(
    private modalController: ModalController,
    private nav: NavController,
    private localStorage: Storage
  ) {}

  ngOnInit() {
    this.localStorage.get('user').then((data) => {
      console.log(data);
      this.cliente = data;
    });
  }

  navigateToCarta() {
    // no funciona el path local (o sea "carta")
    this.nav.navigateForward('cliente/mesa/carta');
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
