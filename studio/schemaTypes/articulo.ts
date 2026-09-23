import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {campoTexto} from './texto'

export const articulo = defineType({
  name: 'articulo',
  title: 'Artículo del blog',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (r) => r.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección de la página',
      type: 'slug',
      options: {source: 'titulo', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen',
      description: 'Se usa en el listado y en Google. Máximo 160 caracteres.',
      type: 'text',
      rows: 2,
      validation: (r) => r.required().max(160),
    }),
    campoTexto('cuerpo', 'Texto', {imagenes: true}),
  ],
  orderings: [{title: 'Más recientes', name: 'fecha', by: [{field: 'fecha', direction: 'desc'}]}],
  preview: {select: {title: 'titulo', subtitle: 'fecha'}},
})
