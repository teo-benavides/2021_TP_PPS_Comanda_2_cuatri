import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/models/interfaces/user.model';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  cliente: User = null;

  constructor(private storage: Storage) {}

  ngOnInit() {
    this.storage.get('user').then((data) => {
      this.cliente = data;
    });
  }
}
