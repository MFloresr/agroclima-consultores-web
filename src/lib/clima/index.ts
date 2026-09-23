// Punto único de acceso a los datos climáticos.
// Fase 2: sustituir `fuenteEjemplo` por una fuente que lea un endpoint propio
// (/api/clima) conectado a la API de Pessl FieldClimate. El panel no cambia.

import { fuenteEjemplo } from './fuente-ejemplo';
import type { FuenteDatos } from './tipos';

export const obtenerDatos: FuenteDatos = fuenteEjemplo;

export { fincasEjemplo, fincaPorDefecto } from './fincas';
export type * from './tipos';

const formatoNumero = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const formatoHora = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });

export function num(valor: number) {
  return formatoNumero.format(valor);
}

export function hora(marca: number) {
  return formatoHora.format(new Date(marca));
}
