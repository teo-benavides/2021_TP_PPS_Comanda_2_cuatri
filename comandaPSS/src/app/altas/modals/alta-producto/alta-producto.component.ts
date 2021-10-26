import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SystemService } from 'src/app/utility/services/system.service';
import { ProductoService } from 'src/app/services/producto.service';
import { Producto } from 'src/app/models/interfaces/producto.model';
import { ErrorStrings } from 'src/app/models/enums/errorStrings';
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
  formProducto: FormGroup;
  productoId: string = '';
  elementType = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
  fotoUrl: string = '';

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
      fechaElaboracion: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(1)]],
      tipo: ['comida', [Validators.required]],
      foto: ['', [Validators.required]],
    });
  }

  cancelar() {
    this.modalController.dismiss();
  }

  async getFoto() {
    const foto = await this.system.getPicture();

    if (foto.img && foto.file) {
      this.fotoUrl = foto.img;
      this.formProducto.get('foto').setValue(foto.file);
    }
  }

  async onSubmit() {
    const loading = await this.system.presentLoading('Creando producto');
    loading.present();

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const productoIdBase64 = canvas.toDataURL('image/jpeg').toString();

    let nuevoProducto: Producto = this.formProducto.value;
    nuevoProducto.productoId = this.productoId;

    this.productoService.crearProducto(nuevoProducto, productoIdBase64.split(',')[1])
      .then(
        () => {
          this.system.presentToast('Se ha creado un producto');
          this.cancelar();
        }
      ).catch(
        (error: Error) => this.system.presentToastError(error.message)
      )
    
    loading.dismiss();
  }
}
