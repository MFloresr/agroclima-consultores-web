// Campo de foto reutilizable con recorte (hotspot) y descripción obligatoria cuando hay imagen.

import {defineField} from 'sanity'

/** Campo de foto con texto alternativo obligatorio (accesibilidad y Google). */
export function campoFoto(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    description,
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Descripción de la foto',
        description: 'Qué se ve en la foto, en una frase. La leen los lectores de pantalla y Google.',
        type: 'string',
        validation: (r) =>
          r.custom((alt, ctx) => {
            const padre = ctx.parent as {asset?: unknown} | undefined
            return padre?.asset && !alt ? 'Describe la foto' : true
          }),
      }),
    ],
  })
}
