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
    public mesa: MesasService,
    private usuario: UsuarioService
  ) {}

  ngOnInit() {
    this.mesa.getMesasDesocupadas().subscribe((data) => {
      console.log(data);
      this.mesas = data;
    });
  }

  cancelar() {
    this.modalController.dismiss();
  }

  asignar(mesaId: string) {
    this.usuario.asignarMesaUsuario(this.uid, mesaId).then(() => {
      this.cancelar();
    });
  }
}
