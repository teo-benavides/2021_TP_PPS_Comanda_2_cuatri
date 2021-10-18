export interface User {
  uid?: string;
  nombre: string;
  apellido: string;
  correo: string;
  clave: string;
  dni: string;
  cuil?: string;
  perfil: perfil;
  foto: string | '';
  isConfirm: boolean;
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
