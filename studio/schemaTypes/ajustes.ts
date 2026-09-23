// Documento único «Datos de contacto»: teléfono, WhatsApp, email, localidad y comarcas.

import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const ajustes = defineType({
  name: 'ajustes',
  title: 'Datos de contacto',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'telefono',
      title: 'Teléfono',
      description: 'Tal como quieres que se vea en la web. Ej.: +34 973 000 000',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'whatsapp',
      title: 'Número de WhatsApp',
      description: 'Solo números, con el prefijo 34 delante y sin espacios. Ej.: 34600000000',
      type: 'string',
      validation: (r) =>
        r.required().regex(/^\d{10,15}$/, {name: 'número con prefijo, sin espacios ni +'}),
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'localidad',
      title: 'Localidad',
      type: 'string',
      initialValue: 'Lleida',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'zona',
      title: 'Comarcas en las que trabajáis',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {prepare: () => ({title: 'Datos de contacto'})},
})
