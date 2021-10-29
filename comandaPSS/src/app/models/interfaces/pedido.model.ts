import { Mesa } from "./mesas.model";
import { Preparacion } from "./preparacion.model";
import { Producto } from "./producto.model";

export interface Pedido {
    pedidoId: string;
    mesa: Mesa;
    tiempoEstimado: number; // en minutos
    precioTotal: number; // int
    estado: PedidoEstado;
    preparaciones: Array<Preparacion>;
}

export type PedidoEstado = "pendiente" | "preparando" | "terminado" | "entregado" | "pagado";

