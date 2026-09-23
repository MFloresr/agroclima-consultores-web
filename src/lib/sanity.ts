// Conexión con Sanity (gestor de contenidos). El contenido publicado es de lectura pública,
// así que no hace falta ninguna clave: la web lo descarga al compilarse.

import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { toHTML, uriLooksSafe } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';

/** Cliente de Sanity de solo lectura del contenido publicado (sin CDN, para compilar con lo último). */
export const sanity = createClient({
  projectId: '3cabmdy3',
  dataset: 'production',
  apiVersion: '2025-08-15',
  useCdn: false,
  perspective: 'published',
});

const constructor = createImageUrlBuilder(sanity);

/** Imagen tal como la guarda Sanity: referencia al archivo, descripción y punto de interés. */
export interface ImagenSanity {
  asset?: { _ref: string };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: Record<string, number>;
}

/** true si el campo de foto tiene una imagen subida (y no solo la descripción). */
export const tieneImagen = (imagen?: ImagenSanity | null): imagen is ImagenSanity & { asset: { _ref: string } } =>
  Boolean(imagen?.asset?._ref);

/** URL de una foto optimizada por el servidor de imágenes de Sanity (WebP/AVIF según el navegador). */
export function urlImagen(imagen: ImagenSanity, ancho: number, alto?: number) {
  let url = constructor.image(imagen).width(ancho).auto('format').quality(78).fit('crop');
  if (alto) url = url.height(alto);
  return url.url();
}

/** srcset con varios anchos para que cada pantalla descargue solo lo que necesita. */
export function srcsetImagen(imagen: ImagenSanity, anchos: number[], proporcion?: number) {
  return anchos
    .map((a) => `${urlImagen(imagen, a, proporcion ? Math.round(a / proporcion) : undefined)} ${a}w`)
    .join(', ');
}

/** Texto con formato de Sanity → HTML */
export function textoAHtml(bloques: PortableTextBlock[] | undefined | null) {
  if (!bloques?.length) return '';
  return toHTML(bloques, {
    components: {
      marks: {
        link: ({ children, value }) => {
          const href: string = value?.href ?? '';
          if (!uriLooksSafe(href)) return children;
          const externo = /^https?:\/\//.test(href);
          return `<a href="${href}"${externo ? ' rel="noopener"' : ''}>${children}</a>`;
        },
      },
      types: {
        image: ({ value }) => {
          if (!tieneImagen(value)) return '';
          const alt = String(value.alt ?? '').replace(/"/g, '&quot;');
          return `<img src="${urlImagen(value, 1200)}" srcset="${srcsetImagen(value, [480, 800, 1200])}" sizes="(max-width: 800px) 100vw, 760px" alt="${alt}" loading="lazy" decoding="async" />`;
        },
      },
    },
  });
}
