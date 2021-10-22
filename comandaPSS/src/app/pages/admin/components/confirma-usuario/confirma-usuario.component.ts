import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/interfaces/user.model';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-confirma-usuario',
  templateUrl: './confirma-usuario.component.html',
  styleUrls: ['./confirma-usuario.component.scss'],
})
export class ConfirmaUsuarioComponent implements OnInit {
  usuarios: User[];

  constructor(public usuario: UsuarioService) {}

  ngOnInit() {
    this.usuario.getUsuarioAConfirmar().subscribe((data: User[]) => {
      this.usuarios = data;
      console.log(data);
    });
  }
}
