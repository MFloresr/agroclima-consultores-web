// Fincas de ejemplo del panel (una por comarca). En la fase 2 serán las estaciones reales de Pessl.

import type { Finca } from './tipos';

// Fincas de ejemplo, una por comarca de la zona que cubre AgroClima.
export const fincasEjemplo: Finca[] = [
  {
    id: 'alcarras',
    nombre: 'Finca de ejemplo en Alcarràs',
    etiqueta: 'Alcarràs · Frutal',
    lugar: 'Alcarràs',
    comarca: 'Segrià',
    cultivo: 'Frutal',
    latitud: 41.56,
  },
  {
    id: 'mollerussa',
    nombre: 'Finca de ejemplo en Mollerussa',
    etiqueta: 'Mollerussa · Cereal',
    lugar: 'Mollerussa',
    comarca: "Pla d'Urgell",
    cultivo: 'Cereal',
    latitud: 41.63,
  },
  {
    id: 'balaguer',
    nombre: 'Olivar de ejemplo en Balaguer',
    etiqueta: 'Balaguer · Olivo',
    lugar: 'Balaguer',
    comarca: 'Noguera',
    cultivo: 'Olivo',
    latitud: 41.79,
  },
];

export const fincaPorDefecto = fincasEjemplo[0].id;
