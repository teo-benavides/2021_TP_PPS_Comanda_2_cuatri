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
    private file: AngularFireStorage,
    private system: SystemService
  ) {}

  async productoExiste(producto: Producto): Promise<boolean> {
    const data = await this.db
      .collection<Producto>('Productos')
      .ref.where('nombre', '==', producto.nombre)
      .get();

    return !data.empty;
  }

  async crearProducto(producto: Producto, qr: string): Promise<void> {
    let productoExiste: boolean = await this.productoExiste(producto);
    
    if (productoExiste) {
      throw new Error(ErrorStrings.ProductoYaExiste);
    }
  
    try {   
      const b64 = await this.system.fileToBase64(producto.foto);
      const r = await this.file
        .ref(`/productos/${producto.productoId}`)
        .putString(b64, 'base64', { contentType: 'image/png' });

      await this.file
        .ref(`/qr/${producto.productoId}-Nombre:${producto.nombre}`)
        .putString(qr, 'base64', { contentType: 'image/jpeg' });

      producto.foto = await r.ref.getDownloadURL();

      await this.db.collection('Productos').doc(producto.productoId).set(producto);
    } catch (error) {
      console.log(error);
      throw Error(ErrorStrings.CrearProducto);
    }
  }
}
