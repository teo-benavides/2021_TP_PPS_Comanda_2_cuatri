import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  ActionSheetButton,
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { AltaUsuarioComponent } from '../../../altas/modals/alta-usuario/alta-usuario.component';
import { perfil } from 'src/app/models/interfaces/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public nav: NavController,
    private modalController: ModalController,
    public actionSheetController: ActionSheetController
  ) {
    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    this.loading = true;
    const { clave, correo } = this.formLogin.value;
    await this.auth.login(correo, clave);
    this.loading = false;
  }

  fastAccess(correo, clave) {
    this.formLogin.setValue({ correo, clave });
  }

  async presentModalRegistro(type: perfil) {
    const modal = await this.modalController.create({
      component: AltaUsuarioComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      backdropDismiss: false,
      componentProps: {
        type,
      },
    });
    return await modal.present();
  }

  async presentActionSheet() {
    const correos: string[] = [
      'mozo@mozo.com',
      'coc@coc.com',
      'bart@bart.com',
      'cliente@cliente.com',
      'metre1@metre1.com',
      'castrocarlos313@gmail.com',
      'super@super.com',
    ];

    const buttons: ActionSheetButton[] = correos.map((correo) => {
      return {
        text: correo,
        icon: 'person',
        handler: () => {
          this.fastAccess(correo, '123456');
        },
      };
    });

    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Acceso rapido',
      cssClass: 'acceso',
      buttons,
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
