import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, ModalController } from '@ionic/angular';
import { SystemService } from 'src/app/utility/services/system.service';
import { ProductoService } from 'src/app/services/producto.service';
import { Producto } from 'src/app/models/interfaces/producto.model';
import { ErrorStrings } from 'src/app/models/enums/errorStrings';
import { TipoProducto } from '../../../models/interfaces/producto.model';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.scss'],
})
export class AltaProductoComponent implements OnInit {
  @Input() tipo: TipoProducto;
  formProducto: FormGroup;
  productoId: string = '';
  elementType = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
  // La última consigna requiere 3 fotos para las altas de productos
  foto1: string = '';
  foto2: string = '';
  foto3: string = '';
  today: string = new Date(Date.now()).toISOString();

  constructor(
    private modalController: ModalController,
    private system: SystemService,
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.productoId = this.system.createId();
    this.formProducto = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      tiempoEstimado: ['', [Validators.required, Validators.min(1)]],
      fechaElaboracion: [new Date(), [Validators.required]],
      precio: ['', [Validators.required, Validators.min(1)]],
      tipo: [this.tipo, [Validators.required]],
      foto1: ['', [Validators.required]],
      foto2: ['', [Validators.required]],
      foto3: ['', [Validators.required]],
    });
  }

  cancelar() {
    this.modalController.dismiss();
  }

  async setFoto(fotoId: number) {
    const foto = await this.system.getPicture();

    if (foto.img && foto.file) {
      switch (fotoId) {
        case 1:
          this.foto1 = foto.img;
          this.formProducto.get('foto1').setValue(foto.file);
          break;

        case 2:
          this.foto2 = foto.img;
          this.formProducto.get('foto2').setValue(foto.file);
          break;

        case 3:
          this.foto3 = foto.img;
          this.formProducto.get('foto3').setValue(foto.file);
          break;

        default:
          break;
      }
    }
  }

  async onSubmit() {
    const loading = await this.system.presentLoading('Creando producto');
    loading.present();

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const productoIdBase64 = canvas.toDataURL('image/jpeg').toString();
    let nuevoProducto: Producto = this.formProducto.value;
    nuevoProducto.productoId = this.productoId;

    this.productoService
      .crearProducto(nuevoProducto, productoIdBase64.split(',')[1])
      .then(() => {
        this.system.presentToast('Se ha creado un producto');
        loading.dismiss();
        this.cancelar();
      })
      .catch((error: Error) => {
        this.system.presentToastError(error.message);
        loading.dismiss();
      });
  }
}
