import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'
import {campoFoto} from './imagen'

export const portada = defineType({
  name: 'portada',
  title: 'Portada',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'inicio', title: 'Parte superior', default: true},
    {name: 'datos', title: 'Bloque de datos climáticos'},
  ],
  fields: [
    defineField({
      name: 'antetitulo',
      title: 'Texto pequeño sobre el título',
      type: 'string',
      group: 'inicio',
    }),
    defineField({
      name: 'titulo',
      title: 'Título principal',
      description: 'Lo primero que se lee. Mejor corto: una frase.',
      type: 'string',
      group: 'inicio',
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: 'entrada',
      title: 'Qué hacéis y para quién',
      description: '2 o 3 frases.',
      type: 'text',
      rows: 4,
      group: 'inicio',
      validation: (r) => r.required().max(420),
    }),
    {...campoFoto('foto', 'Foto principal', 'Foto horizontal de una finca o una estación.'), group: 'inicio'},
    defineField({
      name: 'datosTitulo',
      title: 'Título del bloque de datos',
      type: 'string',
      group: 'datos',
    }),
    defineField({
      name: 'datosTexto',
      title: 'Texto del bloque de datos',
      type: 'text',
      rows: 3,
      group: 'datos',
    }),
  ],
  preview: {prepare: () => ({title: 'Portada'})},
})
