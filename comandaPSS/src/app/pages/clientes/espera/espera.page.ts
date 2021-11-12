import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-espera',
  templateUrl: './espera.page.html',
  styleUrls: ['./espera.page.scss'],
})
export class EsperaPage implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.usuarioService.esperandoMesaUsuario();
  }
}
