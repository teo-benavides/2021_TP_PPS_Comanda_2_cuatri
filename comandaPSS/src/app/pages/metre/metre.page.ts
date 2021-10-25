import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AltaUsuarioComponent } from 'src/app/altas/modals/alta-usuario/alta-usuario.component';
import { User } from 'src/app/models/interfaces/user.model';
import { UsuarioService } from '../../services/usuario.service';
import { AsignarMesaComponent } from './modals/asignar-mesa/asignar-mesa.component';

@Component({
  selector: 'app-metre',
  templateUrl: './metre.page.html',
  styleUrls: ['./metre.page.scss'],
})
export class MetrePage implements OnInit {
  usuarios: User[] = [];

  constructor(
    public usuario: UsuarioService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.usuario.getUsuariosEnEspera().subscribe((data) => {
      console.log(data);
      this.usuarios = data;
    });
  }

  async agregarCliente() {
    const modal = await this.modalController.create({
      component: AltaUsuarioComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        type: 'cliente',
      },
    });
    return await modal.present();
  }

  async asignar(uid: string) {
    console.log(uid);

    const modal = await this.modalController.create({
      component: AsignarMesaComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        uid,
      },
    });
    return await modal.present();
  }
}
