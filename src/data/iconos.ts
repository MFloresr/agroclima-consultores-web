// Trazados SVG (viewBox 0 0 24 24, trazo) de los iconos de la web.

/** Trazados SVG de los iconos, por nombre. Se dibujan con el componente Icono.astro. */
export const iconos = {
  estacion: 'M12 21V9M8 21h8M12 9a3 3 0 1 0 0-6a3 3 0 0 0 0 6M5 6a8 8 0 0 1 2-3M19 6a8 8 0 0 0-2-3',
  alerta: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  informe: 'M6 3h9l4 4v14H6zM9 17v-3M12 17v-6M15 17v-4',
  asesoria: 'M4 5h16v11H9l-5 4zM8 9h8M8 12h5',
  temperatura: 'M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z',
  humedad: 'M12 3c3.5 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.5 6-11z',
  lluvia: 'M7 14a4 4 0 0 1 .5-8A5.5 5.5 0 0 1 18 7a3.5 3.5 0 0 1-.5 7zM8 18l-1 2M12 18l-1 2M16 18l-1 2',
  viento: 'M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  telefono: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  whatsapp: 'M4 20l1.3-3.9A8 8 0 1 1 8 19zM9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-1.9-1.3-2.3-2.3l.8-1-1-2z',
  email: 'M3 5h18v14H3zM3 7l9 6 9-6',
  presupuesto: 'M6 3h9l4 4v14H6zM9 12h6M9 16h4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  cerrar: 'M6 6l12 12M18 6L6 18',
  ubicacion: 'M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zM12 8a2 2 0 1 0 0 4a2 2 0 0 0 0-4',
  info: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18M12 8v5M12 16v.5',
  flecha: 'M5 12h14M13 6l6 6-6 6',
  frutal: 'M12 7c-3-2-7 0-7 5 0 4 3 8 5 8 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 5-4 5-8 0-5-4-7-7-5zM12 7c0-2 1-4 3-4',
  vinedo: 'M9 6.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M15 6.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M12 11a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M9 15.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M15 15.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5',
  cereal: 'M12 21V6M12 11c-2-1-3-3-3-5 2 0 3 2 3 4M12 11c2-1 3-3 3-5-2 0-3 2-3 4M12 16c-2-1-3-3-3-5 2 0 3 2 3 4M12 16c2-1 3-3 3-5-2 0-3 2-3 4M12 6V3',
  olivo: 'M4 20C9 15 14 10 20 4M8 16c-1-2 0-4 2-5 1 2 0 4-2 5zM13 11c-1-2 0-4 2-5 1 2 0 4-2 5zM12 15c2-1 4 0 5 2-2 1-4 0-5-2z',
} as const;

/** Nombre válido de icono (se comprueba al compilar). */
export type NombreIcono = keyof typeof iconos;
