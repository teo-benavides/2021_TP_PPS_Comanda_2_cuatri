export interface Producto {
    productoId: string;
    nombre: string;
    descripcion: string;
    fechaElaboracion: Date;
    foto: string;
    precio: number; // int
    tipo: TipoProducto;
  }
  
  export type TipoProducto = 'comida' | 'bebida';
  