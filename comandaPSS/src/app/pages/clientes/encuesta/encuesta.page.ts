import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SystemService } from '../../../utility/services/system.service';
import { EncuestasService } from '../../../services/encuestas.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {
  fotoPath: string[] = [];
  fotoUrl: string[] = [];
  encuestaForm: FormGroup;
  route: string = '/cliente/mesa';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private system: SystemService,
    private navController: NavController,
    private encuestasService: EncuestasService
  ) {}

  ngOnInit() {
    this.encuestaForm = this.formBuilder.group({
      mozo: ['', [Validators.required]],
      plato: [1, [Validators.required]],
      entrega: [true, [Validators.required]],
      experiencia: ['', [Validators.required]],
      comentario: ['', [Validators.required]],
    });
  }

  async getFoto() {
    if (this.fotoPath.length >= 3) {
      return this.system.presentToastError(
        'Solo se puede subir 3 fotos como maximo'
      );
    }

    const { file, img } = await this.system.getPicture();

    if (file || img) {
      this.fotoPath.push(file);
      this.fotoUrl.push(img);
    }
  }

  deleteFoto(index: number) {
    this.fotoPath = this.fotoPath.filter((value, i) => {
      if (i !== index) return value;
    });

    this.fotoUrl = this.fotoUrl.filter((value, i) => {
      if (i !== index) return value;
    });
  }

  onSubmit() {
    console.log(this.encuestaForm.value);
    this.loading = true;

    const { mozo, plato, entrega, experiencia, comentario } =
      this.encuestaForm.value;

    this.encuestasService
      .crearEncuesta(
        mozo,
        plato,
        entrega,
        experiencia,
        comentario,
        this.fotoPath
      )
      .finally(() => {
        this.navController.navigateBack(this.route);
        this.loading = false;
      });
  }
}
