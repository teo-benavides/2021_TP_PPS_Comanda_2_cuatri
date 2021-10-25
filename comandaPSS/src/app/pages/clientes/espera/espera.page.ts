import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-espera',
  templateUrl: './espera.page.html',
  styleUrls: ['./espera.page.scss'],
})
export class EsperaPage implements OnInit {
  constructor(private UsuarioService: UsuarioService) {}

  ngOnInit() {
    this.UsuarioService.esperandoMesaUsuario();
  }
}
