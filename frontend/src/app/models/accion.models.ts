export type { FuenteGrafana } from './grafana.models';

export type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface BotonAccion {
  id: string;
  label: string;
  descripcion?: string;
  color: string;
  icono?: string;
  metodo: MetodoHttp;
  url: string;
  payload?: string;
  confirmar?: boolean;
}

export interface RegistroEjecucion {
  id: string;
  botonId: string;
  botonLabel: string;
  fecha: string;
  estado: 'ok' | 'error' | 'pendiente';
  mensaje?: string;
}
