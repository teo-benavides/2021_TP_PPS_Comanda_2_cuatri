import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Mesa } from 'src/app/models/interfaces/mesas.model';
import { MesasService } from '../../../../services/mesas.service';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-asignar-mesa',
  templateUrl: './asignar-mesa.component.html',
  styleUrls: ['./asignar-mesa.component.scss'],
})
export class AsignarMesaComponent implements OnInit {
  @Input() uid: string;
  mesas: Mesa[] = [];

  constructor(
    private modalController: ModalController,
    private mesasService: MesasService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.mesasService.getMesasDesocupadas().subscribe((data) => {
      console.log(data);
      this.mesas = data;
    });
  }

  cancelar() {
    this.modalController.dismiss();
  }

  asignar(mesaId: string) {
    this.usuarioService.asignarMesaUsuario(this.uid, mesaId).then(() => {
      this.cancelar();
    });
  }
}
