// Colecciones de contenido de Astro alimentadas por Sanity (loaders con consultas GROQ).
// Se ejecutan al compilar; el esquema Zod comprueba que el contenido tenga todos los campos.

import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { sanity } from './lib/sanity';

// El contenido se edita en Sanity y se descarga al compilar la web.
// Al publicar en el panel, un webhook de Sanity vuelve a compilar la web en Vercel.

const imagen = z
  .object({
    asset: z.object({ _ref: z.string() }).optional(),
    alt: z.string().optional(),
    hotspot: z.any().optional(),
    crop: z.any().optional(),
  })
  .nullable()
  .optional();

// Cada documento llega con su id y el resto de campos, que valida el esquema
type Entrada = { id: string } & Record<string, unknown>;

const textoConFormato = z.array(z.any()).nullable().default([]);

const servicios = defineCollection({
  loader: async () =>
    sanity.fetch<Entrada[]>(`*[_type == "servicio" && defined(slug.current)] | order(orden asc){
      "id": slug.current, titulo, tituloCorto, orden, icono, resumen, beneficios, cuerpo, seoDescripcion
    }`),
  schema: z.object({
    titulo: z.string(),
    tituloCorto: z.string(),
    orden: z.number(),
    icono: z.enum(['estacion', 'alerta', 'informe', 'asesoria']),
    resumen: z.string(),
    beneficios: z.array(z.string()).min(1),
    cuerpo: textoConFormato,
    seoDescripcion: z.string(),
  }),
});

const casos = defineCollection({
  loader: async () =>
    sanity.fetch<Entrada[]>(`*[_type == "caso"] | order(orden asc){
      "id": _id, titulo, cliente, cultivo, comarca, resumen, resultado, resultadoEtiqueta, foto, orden
    }`),
  schema: z.object({
    titulo: z.string(),
    cliente: z.string(),
    cultivo: z.string(),
    comarca: z.string(),
    resumen: z.string(),
    resultado: z.string(),
    resultadoEtiqueta: z.string(),
    foto: imagen,
    orden: z.number(),
  }),
});

// Blog: solo aparecen los artículos publicados en Sanity (los borradores no son públicos).
const articulos = defineCollection({
  loader: async () =>
    sanity.fetch<Entrada[]>(`*[_type == "articulo" && defined(slug.current)] | order(fecha desc){
      "id": slug.current, titulo, fecha, resumen, cuerpo
    }`),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    resumen: z.string(),
    cuerpo: textoConFormato,
  }),
});

/** Colecciones que Astro registra: servicios, casos de éxito y artículos del blog. */
export const collections = { servicios, casos, articulos };
