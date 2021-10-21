export interface Mesa {
  mesaId: string;
  numeroMesa: number;
  cantidadComensales: number;
  tipo: tipoMesa;
  foto: string;
  estado: estadoMesa;
}

export type tipoMesa = 'vip' | 'discapacitado' | 'estandar';
export type estadoMesa = 'desocupada' | 'ocupada';
