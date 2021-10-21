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
