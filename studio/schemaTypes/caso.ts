// Caso de éxito: titular, cliente, cultivo, comarca, resultado y foto.

import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'
import {campoFoto} from './imagen'

/** Tipo de documento «Caso de éxito». */
export const caso = defineType({
  name: 'caso',
  title: 'Caso de éxito',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Titular',
      description: 'Qué se consiguió, en pocas palabras. Ej.: "Alerta de helada con margen para actuar".',
      type: 'string',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'cliente',
      title: 'Cliente',
      description: 'Solo si tienes su permiso para publicarlo.',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cultivo',
      title: 'Cultivo',
      type: 'string',
      options: {list: ['Frutal', 'Viñedo', 'Cereal', 'Olivo', 'Otros'], layout: 'radio', direction: 'horizontal'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'comarca',
      title: 'Comarca o zona',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'resumen',
      title: 'Qué pasó',
      description: '1 o 2 frases.',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'resultado',
      title: 'Resultado (cifra)',
      description: 'La cifra destacada. Ej.: "80 %".',
      type: 'string',
      validation: (r) => r.required().max(16),
    }),
    defineField({
      name: 'resultadoEtiqueta',
      title: 'Resultado (explicación)',
      description: 'Ej.: "de la cosecha salvada".',
      type: 'string',
      validation: (r) => r.required().max(60),
    }),
    campoFoto('foto', 'Foto'),
    defineField({
      name: 'orden',
      title: 'Orden en la web',
      type: 'number',
      initialValue: 1,
      validation: (r) => r.required().integer().min(1),
    }),
  ],
  orderings: [{title: 'Orden en la web', name: 'orden', by: [{field: 'orden', direction: 'asc'}]}],
  preview: {select: {title: 'titulo', subtitle: 'cliente', media: 'foto'}},
})
