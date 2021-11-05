export interface Comentario {
  fotos: string[];
  text: string;
  correo: string;
}

export interface EstadisticaInfo {
  nombre: string;
  tipo: string[];
  data: number[];
}

export class Estadisticas {
  mozo: Record<string, number>;
  plato: Record<string, number>;
  entrega: Record<string, number>;
  experiencia: Record<string, number>;

  constructor(
    mozo: Record<string, number>,
    plato: Record<string, number>,
    entrega: Record<string, number>,
    experiencia: Record<string, number>
  ) {
    this.mozo = mozo;
    this.plato = plato;
    this.entrega = entrega;
    this.experiencia = experiencia;
  }

  public get statsMozo(): EstadisticaInfo {
    return {
      nombre: 'Atencion del mozo',
      tipo: Object.keys(this.mozo),
      data: Object.values(this.mozo),
    };
  }

  public get statsPlato(): EstadisticaInfo {
    return {
      nombre: 'Calidad del plato',
      tipo: Object.keys(this.plato),
      data: Object.values(this.plato),
    };
  }
  public get statsEntrega(): EstadisticaInfo {
    return {
      nombre: 'Pedidos entregados con exito',
      tipo: Object.keys(this.entrega),
      data: Object.values(this.entrega),
    };
  }
  public get statsExperiencia(): EstadisticaInfo {
    return {
      nombre: 'Calificacion del restaurante',
      tipo: Object.keys(this.experiencia),
      data: Object.values(this.experiencia),
    };
  }
}
