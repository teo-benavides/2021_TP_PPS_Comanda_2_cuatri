export interface Producto {
    productoId: string;
    nombre: string;
    descripcion: string;
    fechaElaboracion: Date;
    foto1: string;
    foto2: string;
    foto3: string;
    precio: number; // int
    tipo: TipoProducto;
  }
  
export type TipoProducto = 'comida' | 'bebida';
  