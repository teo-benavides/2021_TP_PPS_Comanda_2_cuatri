import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SystemService } from '../../../utility/services/system.service';
import { dniQR } from '../../../utility/config/QR.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { perfil, User, estado } from 'src/app/models/interfaces/user.model';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.component.html',
  styleUrls: ['./alta-usuario.component.scss'],
})
export class AltaUsuarioComponent implements OnInit {
  @Input() type: perfil = 'cliente';
  formUsuario: FormGroup;
  estado: estado = 'pendiente';
  foto: string = '';
  constructor(
    private modalController: ModalController,
    private system: SystemService,
    private alta: UsuarioService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.estado =
      this.type === 'dueño' || this.type === 'supervisor'
        ? 'confirmado'
        : 'pendiente';

    this.createForm(this.type);

    console.log(this.formUsuario.value, this.formUsuario.value['cuil']);
  }

  cancelar() {
    this.modalController.dismiss();
  }

  async getDNI() {
    const dni = await this.system.getQr(dniQR);

    const dniArr = dni.text.split('@');

    this.formUsuario.get('nombre').setValue(this.formatNombre(dniArr[1]));
    this.formUsuario
      .get('apellido')
      .setValue(this.formatNombre(dniArr[2].split(' ')[0]));
    this.formUsuario.get('dni').setValue(dniArr[4]);

    console.log(dniArr, dniArr[1], dniArr[2].split(' ')[1], dniArr[4]);
  }

  formatNombre(palabra: string) {
    let str = palabra.toLowerCase();

    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * getFoto
   *
   * llama al metodo getPicture el cual va a sacar una foto,
   * este va a devolver un objecto que contiene:
   *
   *  img: string  => url local para mostrar en la app;
   *  file: string => path del archivo que se guardo en el dispositivo
   */

  async getFoto() {
    const foto = await this.system.getPicture();

    if (foto.img && foto.file) {
      this.foto = foto.img;
      this.formUsuario.get('foto').setValue(foto.file);
    }
  }

  /**
   *  Cambia los input del formulario dependiendo del perfil que se le pase por parametro
   *
   * @param perfil
   */

  createForm(perfil: perfil | any) {
    console.log(perfil);
    this.foto = '';
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

  /**
   *  En caso de que el perfil seleccionado sea anonimo iniciaria sesion automaticamente,
   *   caso contrario se enviara los datos del formulario al metodo createUser
   */

  async onSubmit() {
    if (this.formUsuario.value['perfil'] === 'anonimo')
      return this.alta.loginAnonimo(
        this.formUsuario.value['nombre'],
        this.foto
      );
    let newUser: User = null;
    if (this.formUsuario.value['perfil'] === 'cliente') {
      const { nombre, apellido, correo, dni, perfil, foto } =
        this.formUsuario.value;

      newUser = {
        nombre,
        apellido,
        correo,
        dni,
        perfil,
        foto,
        estado: this.estado,
        estadoIngreso: 'no ingreso',
      };
    } else {
      const { nombre, apellido, correo, dni, cuil, perfil, foto } =
        this.formUsuario.value;

      newUser = {
        nombre,
        apellido,
        correo,
        dni,
        cuil,
        perfil,
        foto,
        estado: this.estado,
      };
    }

    const { clave } = this.formUsuario.value;

    const complete = await this.alta.createUser(newUser, clave);
    if (complete) this.cancelar();
  }
}
