import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/models/interfaces/user.model';
import { NavController } from '@ionic/angular';
import { estadoIngreso, Cliente } from '../../models/interfaces/user.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  color: string = 'primary';

  constructor(
    private storage: Storage,
    private nav: NavController,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const user: Cliente = await this.storage.get('user');
    await this.notificationService.init();

    switch (user.perfil) {
      case 'dueño':
      case 'supervisor':
        this.nav.navigateForward('/admin');
        this.color = 'primary';
        break;
      case 'metre':
        this.nav.navigateForward('/metre');
        this.color = 'tertiary';

        break;
      case 'cocinero':
        this.nav.navigateForward('/cocinero');
        this.color = 'tertiary';

        break;
      case 'bartender':
        this.nav.navigateForward('/bartender');
        this.color = 'tertiary';

        break;
      case 'mozo':
        this.nav.navigateForward('/mozo');
        this.color = 'tertiary';

        break;
      case 'cliente':
      case 'anonimo':
        this.checkRouteCliente(user.estadoIngreso);
        this.color = 'secondary';

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
