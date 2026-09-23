// Datos de contacto y generales de la web.
// Cuando se conecte Sanity, estos valores vendrán de su documento "Ajustes del sitio".
// PENDIENTE: sustituir el teléfono y el WhatsApp de prueba por los reales de AgroClima.

export const sitio = {
  nombre: 'AgroClima Consultores',
  descripcion:
    'Consultoría meteorológica agrícola en Lleida: estaciones meteorológicas, alertas de heladas y lluvias, informes climáticos y asesoramiento para frutal, viñedo, cereal y olivo.',
  telefono: '+34 973 000 000',
  telefonoEnlace: 'tel:+34973000000',
  whatsapp: 'https://wa.me/34600000000',
  email: 'jordi@agroclimaconsultores.es',
  localidad: 'Lleida',
  zona: ['Segrià', "Pla d'Urgell", 'Noguera'],
  anio: 2026,
} as const;

export const navegacion = [
  { href: '/servicios', texto: 'Servicios' },
  { href: '/datos-climaticos', texto: 'Datos climáticos' },
  { href: '/casos-de-exito', texto: 'Casos de éxito' },
  { href: '/sobre-agroclima', texto: 'Sobre AgroClima' },
  { href: '/contacto', texto: 'Contacto' },
] as const;
