import {defineArrayMember, defineField} from 'sanity'

/** Texto con formato sencillo: párrafos, subtítulos, listas, negrita y enlaces. */
export function campoTexto(name: string, title: string, opciones: {imagenes?: boolean} = {}) {
  return defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          {title: 'Párrafo', value: 'normal'},
          {title: 'Subtítulo', value: 'h2'},
        ],
        lists: [
          {title: 'Lista', value: 'bullet'},
          {title: 'Lista numerada', value: 'number'},
        ],
        marks: {
          decorators: [
            {title: 'Negrita', value: 'strong'},
            {title: 'Cursiva', value: 'em'},
          ],
          annotations: [
            {
              name: 'link',
              title: 'Enlace',
              type: 'object',
              fields: [
                defineField({
                  name: 'href',
                  title: 'Dirección',
                  type: 'url',
                  validation: (r) =>
                    r.uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
                }),
              ],
            },
          ],
        },
      }),
      ...(opciones.imagenes
        ? [
            defineArrayMember({
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Descripción de la foto',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
              ],
            }),
          ]
        : []),
    ],
  })
}
