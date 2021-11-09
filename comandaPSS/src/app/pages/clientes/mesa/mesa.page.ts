import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private nav: NavController,
  ) { }

  ngOnInit() {
  }

  navigateToCarta() {
    // no funciona el path local (o sea "carta")
    this.nav.navigateForward('cliente/mesa/carta');
  }
}
