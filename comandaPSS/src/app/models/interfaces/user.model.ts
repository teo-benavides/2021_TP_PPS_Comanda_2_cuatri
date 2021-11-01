import { Mesa } from './mesas.model';

export interface User {
  uid?: string;
  nombre: string;
  apellido: string;
  correo: string;
  dni: string;
  cuil?: string;
  perfil: perfil;
  foto: string | '';
  estado: estado;
  estadoIngreso?: estadoIngreso;
  mesa?: Mesa;
}

export interface Anonimo {
  uid?: string;
  nombre: string;
  correo: string;
  perfil: perfil;
  foto: string | '';
  estado: 'confirmado';
  estadoIngreso: estadoIngreso;
  mesa?: Mesa;
}

export type perfil =
  | 'dueño'
  | 'supervisor'
  | 'metre'
  | 'mozo'
  | 'cocinero'
  | 'bartender'
  | 'cliente'
  | 'anonimo';

export type estado = 'pendiente' | 'confirmado' | 'rechazado';
export type estadoIngreso = 'no ingreso' | 'espera' | 'buscando' | 'mesa';

export type Cliente = Anonimo | User;
