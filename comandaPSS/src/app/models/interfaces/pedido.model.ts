import { Mesa } from "./mesas.model";
import { Preparacion } from "./preparacion.model";
import { Producto } from "./producto.model";

export interface Pedido {
    pedidoId: string;
    mesaId: string;
    numeroMesa: number;
    tiempoEstimado: number; // en minutos
    precioTotal: number; // int
    estado: PedidoEstado;
    preparaciones: Array<Preparacion>;
}

export type PedidoEstado = "pendiente" | "preparando" | "terminado" | "entregado" | "aPagar" | "pagado";

