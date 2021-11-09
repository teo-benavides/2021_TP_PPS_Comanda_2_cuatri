import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

import { SystemService } from 'src/app/utility/services/system.service';
import { Producto } from 'src/app/models/interfaces/producto.model';
import { ErrorStrings } from 'src/app/models/enums/errorStrings';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private system: SystemService
  ) {}

  async productoExiste(producto: Producto): Promise<boolean> {
    const data = await this.db
      .collection<Producto>('Productos')
      .ref.where('nombre', '==', producto.nombre)
      .get();

    return !data.empty;
  }

  async getById(id: string) {
    return this.db
      .collection<Producto>("Productos")
      .doc(id)
      .get()
      .toPromise()
      .then(val => val.data());
  }

  async getProductos() {
    return this.db
      .collection<Producto>("Productos")
      .valueChanges();
  }

  async crearProducto(producto: Producto, qr: string): Promise<void> {
    let productoExiste: boolean = await this.productoExiste(producto);
    
    if (productoExiste) {
      throw new Error(ErrorStrings.ProductoYaExiste);
    }

    try {
      // Upload QR code
      await this.storage
        .ref(`/qr/${producto.productoId}-Nombre:${producto.nombre}`)
        .putString(qr, 'base64', { contentType: 'image/jpeg' });

      // Upload photos
      let photos: Array<string> = await Promise.all(
        [
          this.uploadPhoto(producto.foto1, producto.productoId + "1"),
          this.uploadPhoto(producto.foto2, producto.productoId + "2"),
          this.uploadPhoto(producto.foto3, producto.productoId + "3")
        ]
      );
      
      // Assign photo URLs
      producto.foto1 = photos[0];
      producto.foto2 = photos[1];
      producto.foto3 = photos[2];

      await this.db.collection('Productos').doc(producto.productoId).set(producto);
    } catch (error) {
      console.log(error);
      throw Error(ErrorStrings.CrearProducto);
    }
  }

  async uploadPhoto(filePath: string, id: string): Promise<string> {
    const b64 = await this.system.fileToBase64(filePath);
    const r = await this.storage
      .ref(`/productos/${id}`)
      .putString(b64, 'base64', { contentType: 'image/png' });
    return r.ref.getDownloadURL();
  }
}
