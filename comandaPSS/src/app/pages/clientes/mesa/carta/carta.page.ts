import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/models/interfaces/producto.model';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.page.html',
  styleUrls: ['./carta.page.scss'],
})
export class CartaPage implements OnInit {
  productos: Producto[];

  constructor(
    private productoService: ProductoService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.productoService.getProductos()
    .then(
      p => p.subscribe(data => this.productos = data)
    );
  }

  getComidas(): Producto[] {
    return this.productos.filter((p) => p.tipo === "comida");
  }

  getBebidas(): Producto[] {
    return this.productos.filter((p) => p.tipo === "bebida");
  }
}
