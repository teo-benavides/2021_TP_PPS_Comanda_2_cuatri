import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from 'src/app/models/interfaces/user.model';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  cliente: Cliente = null;

  constructor(private localStorage: Storage) {}

  ngOnInit() {
    this.localStorage.get('user').then((data) => {
      this.cliente = data;
    });
  }
}
