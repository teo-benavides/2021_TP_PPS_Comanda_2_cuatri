import { Pedido } from "./pedido.model";
import { Producto } from "./producto.model";

export interface Preparacion {
    preparacionId: string;
    producto: Producto;
    estado: PreparacionEstado;
    pedidoId: string;
}

export type PreparacionEstado = "confirmandoPedido" | "pendiente" | "preparando" | "terminado";