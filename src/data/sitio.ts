// Datos que no cambian. Teléfono, WhatsApp, email y zona se editan en Sanity
// ("Datos de contacto") y se leen con obtenerSitio() de src/lib/contenido.ts.

export const sitioFijo = {
  nombre: 'AgroClima Consultores',
  descripcion:
    'Consultoría meteorológica agrícola en Lleida: estaciones meteorológicas, alertas de heladas y lluvias, informes climáticos y asesoramiento para frutal, viñedo, cereal y olivo.',
  anio: 2026,
} as const;

export const navegacion = [
  { href: '/servicios', texto: 'Servicios' },
  { href: '/datos-climaticos', texto: 'Datos climáticos' },
  { href: '/casos-de-exito', texto: 'Casos de éxito' },
  { href: '/sobre-agroclima', texto: 'Sobre AgroClima' },
  { href: '/contacto', texto: 'Contacto' },
] as const;
