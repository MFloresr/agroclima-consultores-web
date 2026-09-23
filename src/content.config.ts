import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Contenido editable. Hoy vive en Markdown dentro del repositorio; al conectar Sanity,
// estas colecciones cambiarán de loader sin tocar las páginas que las usan.

const servicios = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/servicios' }),
  schema: z.object({
    titulo: z.string(),
    tituloCorto: z.string(),
    orden: z.number(),
    icono: z.enum(['estacion', 'alerta', 'informe', 'asesoria']),
    resumen: z.string(),
    beneficios: z.array(z.string()).min(1),
    seoDescripcion: z.string(),
  }),
});

const casos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/casos' }),
  schema: z.object({
    titulo: z.string(),
    cliente: z.string(),
    cultivo: z.string(),
    comarca: z.string(),
    resumen: z.string(),
    resultado: z.string(),
    resultadoEtiqueta: z.string(),
    foto: z.string(),
    orden: z.number(),
  }),
});

// Blog preparado para una segunda fase: solo se publican los artículos con borrador: false.
const articulos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/articulos' }),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    resumen: z.string(),
    borrador: z.boolean().default(true),
  }),
});

export const collections = { servicios, casos, articulos };
