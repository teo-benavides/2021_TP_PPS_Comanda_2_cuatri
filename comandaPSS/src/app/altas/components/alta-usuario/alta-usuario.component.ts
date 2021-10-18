import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SystemService } from '../../../utility/services/system.service';
import { dniQR } from '../../../utility/config/QR.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { perfil, User } from '../../../login/models/user.model';
import { AltaUsuariosService } from '../../services/altaUsuarios.service';

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.component.html',
  styleUrls: ['./alta-usuario.component.scss'],
})
export class AltaUsuarioComponent implements OnInit {
  @Input() type: perfil = 'cliente';
  formUsuario: FormGroup;
  isConfirm: boolean = false;
  foto: string = '';
  constructor(
    private modalController: ModalController,
    private system: SystemService,
    private alta: AltaUsuariosService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isConfirm = this.type === 'dueño' || this.type === 'supervisor';

    this.createForm(this.type);

    console.log(this.formUsuario.value, this.formUsuario.value['cuil']);
  }

  cancelar() {
    this.modalController.dismiss();
  }

  async getDNI() {
    const dni = await this.system.getQr(dniQR);

    const dniArr = dni.text.split('@');

    this.formUsuario.get('nombre').setValue(dniArr[1]);
    this.formUsuario.get('apellido').setValue(dniArr[2].split(' ')[0]);
    this.formUsuario.get('dni').setValue(dniArr[4]);

    console.log(dniArr, dniArr[1], dniArr[2].split(' ')[1], dniArr[4]);
  }

  async getFoto() {
    const { img, file } = await this.system.getPicture();

    this.foto = img;
    this.formUsuario.get('foto').setValue(file);
  }

  createForm(perfil: perfil | any) {
    console.log(perfil);

    switch (perfil) {
      case 'dueño':
      case 'supervisor':
        this.formUsuario = this.fb.group({
          nombre: ['', [Validators.required]],
          apellido: ['', [Validators.required]],
          correo: ['', [Validators.required, Validators.email]],
          clave: ['', [Validators.required, Validators.minLength(6)]],
          dni: ['', [Validators.required]],
          cuil: ['', [Validators.required]],
          perfil: [perfil, [Validators.required]],
          foto: ['', [Validators.required]],
        });
        break;
      case 'bartender':
      case 'metre':
      case 'mozo':
      case 'cocinero':
        this.formUsuario = this.fb.group({
          nombre: ['', [Validators.required]],
          apellido: ['', [Validators.required]],
          correo: ['', [Validators.required, Validators.email]],
          clave: ['', [Validators.required, Validators.minLength(6)]],
          dni: ['', [Validators.required]],
          cuil: ['', [Validators.required]],
          perfil: [perfil, [Validators.required]],
          foto: [''],
        });
        break;
      case 'cliente':
        this.formUsuario = this.fb.group({
          nombre: ['', [Validators.required]],
          apellido: ['', [Validators.required]],
          correo: ['', [Validators.required, Validators.email]],
          clave: ['', [Validators.required, Validators.minLength(6)]],
          dni: ['', [Validators.required]],
          perfil: [perfil, [Validators.required]],
          foto: [''],
        });
        break;
      case 'anonimo':
        this.formUsuario = this.fb.group({
          nombre: ['', [Validators.required]],
          perfil: [perfil, [Validators.required]],
          foto: [''],
        });
        break;
      default:
        console.log('No existe');
        break;
    }

    console.log(this.formUsuario.value);
  }

  submit() {
    if (this.formUsuario.value['perfil'] === 'anonimo')
      return this.alta.loginAnonimo(
        this.formUsuario.value['nombre'],
        this.foto
      );

    const newUser: User = this.formUsuario.value;

    console.log(this.formUsuario.value);

    newUser.isConfirm = this.isConfirm;
    this.alta.createUser(newUser);
  }
}
