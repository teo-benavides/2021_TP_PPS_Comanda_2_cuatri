import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from '../../models/user.model';
import { NavController } from '@ionic/angular';

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
      default:
        break;
    }
  }
}
