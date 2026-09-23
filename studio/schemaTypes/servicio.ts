// Servicio: nombre, dirección de su página (slug), icono, resumen, beneficios, texto y SEO.

import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {campoTexto} from './texto'

export const servicio = defineType({
  name: 'servicio',
  title: 'Servicio',
  type: 'document',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nombre del servicio',
      type: 'string',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'tituloCorto',
      title: 'Nombre corto',
      description: 'Para menús y botones. Ej.: "Alertas meteorológicas".',
      type: 'string',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección de la página',
      description: 'Se genera a partir del nombre. Evita cambiarla después de publicar: los enlaces antiguos dejarían de funcionar.',
      type: 'slug',
      options: {source: 'titulo', maxLength: 60},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'orden',
      title: 'Orden en la web',
      description: '1 = el primero.',
      type: 'number',
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({
      name: 'icono',
      title: 'Icono',
      type: 'string',
      options: {
        list: [
          {title: 'Estación meteorológica', value: 'estacion'},
          {title: 'Campana (alertas)', value: 'alerta'},
          {title: 'Documento (informes)', value: 'informe'},
          {title: 'Conversación (asesoramiento)', value: 'asesoria'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'resumen',
      title: 'Descripción corta',
      description: 'Aparece en la tarjeta del servicio. 1 o 2 frases.',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: 'beneficios',
      title: 'Beneficios para el agricultor',
      description: 'Entre 1 y 4 frases cortas.',
      type: 'array',
      of: [{type: 'string'}],
      validation: (r) => r.required().min(1).max(4),
    }),
    campoTexto('cuerpo', 'Texto de la página del servicio'),
    defineField({
      name: 'seoDescripcion',
      title: 'Descripción para Google',
      description: 'Texto que aparece bajo el enlace en Google. Máximo 160 caracteres.',
      type: 'text',
      rows: 2,
      validation: (r) => r.required().max(160),
    }),
  ],
  orderings: [{title: 'Orden en la web', name: 'orden', by: [{field: 'orden', direction: 'asc'}]}],
  preview: {select: {title: 'titulo', subtitle: 'resumen'}},
})
