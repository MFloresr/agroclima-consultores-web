// Punto único de acceso a los datos climáticos.
// Fase 2: sustituir `fuenteEjemplo` por una fuente que lea un endpoint propio
// (/api/clima) conectado a la API de Pessl FieldClimate. El panel no cambia.

import { fuenteEjemplo } from './fuente-ejemplo';
export { alertaDeEjemplo } from './fuente-ejemplo';
import type { FuenteDatos } from './tipos';

/** Fuente de datos que usa el panel. Hoy, la de ejemplo; en la fase 2, la API de las estaciones Pessl. */
export const obtenerDatos: FuenteDatos = fuenteEjemplo;

export { fincasEjemplo, fincaPorDefecto } from './fincas';
export type * from './tipos';

const formatoNumero = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const formatoHora = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });

/** Número con un decimal y coma decimal española (p. ej. 12,5). */
export function num(valor: number) {
  return formatoNumero.format(valor);
}

/** Hora en formato 24 h (p. ej. 07:00) a partir de una marca de tiempo en milisegundos. */
export function hora(marca: number) {
  return formatoHora.format(new Date(marca));
}
