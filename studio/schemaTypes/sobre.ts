// Documento único «Sobre AgroClima»: presentación, texto, cifras destacadas y foto.

import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'
import {campoFoto} from './imagen'
import {campoTexto} from './texto'

/** Tipo de documento «Sobre AgroClima». */
export const sobre = defineType({
  name: 'sobre',
  title: 'Sobre AgroClima',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (r) => r.required().max(100),
    }),
    defineField({
      name: 'entradilla',
      title: 'Resumen para la portada',
      description: 'Una o dos frases. Se muestran en la portada.',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(300),
    }),
    campoTexto('texto', 'Texto completo'),
    defineField({
      name: 'cifras',
      title: 'Cifras destacadas',
      description: 'Hasta 3. Ej.: "15" + "años de experiencia".',
      type: 'array',
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cifra',
          fields: [
            defineField({name: 'valor', title: 'Cifra', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'etiqueta', title: 'Qué significa', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'valor', subtitle: 'etiqueta'}},
        }),
      ],
    }),
    campoFoto('foto', 'Foto de Jordi'),
  ],
  preview: {prepare: () => ({title: 'Sobre AgroClima'})},
})
