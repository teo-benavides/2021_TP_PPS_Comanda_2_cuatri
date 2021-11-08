import { Component, OnInit } from '@angular/core';
import { Mesa } from 'src/app/models/interfaces/mesas.model';
import { MesasService } from '../../../../services/mesas.service';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../../../../consultas/modals/chat/chat.component';

@Component({
  selector: 'app-lista-chats',
  templateUrl: './lista-chats.component.html',
  styleUrls: ['./lista-chats.component.scss'],
})
export class ListaChatsComponent implements OnInit {
  mesas: Mesa[];

  constructor(
    private mesasService: MesasService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.mesasService.getMesasOcupadas().subscribe((data) => {
      console.log(data);
      this.mesas = data;
    });
  }

  async modalConsultas(path: number) {
    console.log(path);

    const modal = await this.modalController.create({
      component: ChatComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        path,
        color: 'tertiary',
      },
    });
    return await modal.present();
  }
}
