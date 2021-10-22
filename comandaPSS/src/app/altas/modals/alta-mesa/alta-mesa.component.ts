import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SystemService } from 'src/app/utility/services/system.service';
import { MesasService } from '../../services/mesas.service';
import { Mesa } from '../../../models/interfaces/mesas.model';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.component.html',
  styleUrls: ['./alta-mesa.component.scss'],
})
export class AltaMesaComponent implements OnInit {
  formMesa: FormGroup;
  mesaId: string = '';
  elementType = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
  fotoUrl: string = '';

  constructor(
    private modalController: ModalController,
    private system: SystemService,
    private mesa: MesasService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.mesaId = this.mesa.crearId();
    this.formMesa = this.fb.group({
      numeroMesa: ['', [Validators.required, Validators.min(1)]],
      cantidadComensales: ['', [Validators.required, Validators.min(1)]],
      tipo: ['estandar', [Validators.required]],
      foto: ['', [Validators.required]],
    });

    const numero = await this.mesa.getUltimaMesa();
    this.formMesa.get('numeroMesa').setValue(numero);
  }

  cancelar() {
    this.modalController.dismiss();
  }

  async getFoto() {
    const foto = await this.system.getPicture();

    if (foto.img && foto.file) {
      this.fotoUrl = foto.img;
      this.formMesa.get('foto').setValue(foto.file);
    }
  }

  async onSubmit() {
    const existe = await this.mesa.mesaExiste(
      this.formMesa.value['numeroMesa']
    );

    if (!existe) {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      const mesaIdBase64 = canvas.toDataURL('image/jpeg').toString();

      let nuevaMesa: Mesa = this.formMesa.value;
      nuevaMesa.estado = 'desocupada';
      nuevaMesa.mesaId = this.mesaId;

      if (await this.mesa.crearMesa(nuevaMesa, mesaIdBase64.split(',')[1]))
        this.cancelar();
    } else {
      this.system.presentToast('Ya existe mesa con ese numero');
    }
  }
}
