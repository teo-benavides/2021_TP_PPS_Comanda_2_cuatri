import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/models/interfaces/user.model';
import { NavController } from '@ionic/angular';
import { estadoIngreso } from '../../models/interfaces/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  constructor(private storage: Storage, private nav: NavController) {}

  async ngOnInit() {
    await this.storage.create();
    const user: User = await this.storage.get('user');

    switch (user.perfil) {
      case 'dueño':
      case 'supervisor':
        this.nav.navigateForward('/admin');
        break;
      case 'metre':
        this.nav.navigateForward('/metre');
        break;
      case 'cocinero':
        this.nav.navigateForward('/cocinero');
        break;
      case 'cliente':
      case 'anonimo':
        this.checkRouteCliente(user.estadoIngreso);
      default:
        break;
    }
  }

  checkRouteCliente(estado: estadoIngreso) {
    switch (estado) {
      case 'no ingreso':
        this.nav.navigateForward('/cliente/ingreso');
        break;
      case 'espera':
        this.nav.navigateForward('/cliente/espera');
        break;
      case 'buscando':
        this.nav.navigateForward('/cliente/buscar');
        break;
      case 'mesa':
        this.nav.navigateForward('/cliente/mesa');
        break;
      default:
        this.nav.navigateForward('/cliente/ingreso');
        break;
    }
  }
}
