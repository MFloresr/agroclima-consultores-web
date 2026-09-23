// Documentos únicos de Sanity (datos de contacto, portada, sobre AgroClima).
// Se descargan una sola vez por compilación y se reutilizan en todas las páginas.

import type { PortableTextBlock } from '@portabletext/types';
import { sanity, type ImagenSanity } from './sanity';
import { sitioFijo } from '../data/sitio';

interface Ajustes {
  telefono: string;
  whatsapp: string;
  email: string;
  localidad: string;
  zona: string[];
}

/** Contenido del documento «Portada» en Sanity. */
export interface Portada {
  antetitulo?: string;
  titulo: string;
  entrada: string;
  foto?: ImagenSanity;
  datosTitulo?: string;
  datosTexto?: string;
}

/** Contenido del documento «Sobre AgroClima» en Sanity. */
export interface Sobre {
  titulo: string;
  entradilla: string;
  texto?: PortableTextBlock[];
  cifras?: { valor: string; etiqueta: string }[];
  foto?: ImagenSanity;
}

const cache = new Map<string, Promise<unknown>>();

function unico<T>(tipo: string): Promise<T> {
  if (!cache.has(tipo)) {
    const peticion = sanity.fetch<T | null>(`*[_id == $id][0]`, { id: tipo }).then((doc) => {
      if (!doc) throw new Error(`Falta el documento "${tipo}" en Sanity. Créalo y publícalo en el panel.`);
      return doc;
    });
    cache.set(tipo, peticion);
  }
  return cache.get(tipo) as Promise<T>;
}

/**
 * Datos de contacto de la web: los editables de Sanity («Datos de contacto») más los fijos
 * (nombre, descripción), con los enlaces tel: y wa.me ya construidos.
 */
export async function obtenerSitio() {
  const a = await unico<Ajustes>('ajustes');
  return {
    ...sitioFijo,
    telefono: a.telefono,
    telefonoEnlace: `tel:${a.telefono.replace(/[^\d+]/g, '')}`,
    whatsapp: `https://wa.me/${a.whatsapp}`,
    email: a.email,
    localidad: a.localidad,
    zona: a.zona,
  };
}

/** Datos de contacto listos para usar en los componentes. */
export type Sitio = Awaited<ReturnType<typeof obtenerSitio>>;

/** Textos y foto de la portada (documento único «portada»). */
export const obtenerPortada = () => unico<Portada>('portada');
/** Contenido de «Sobre AgroClima» (documento único «sobre»). */
export const obtenerSobre = () => unico<Sobre>('sobre');
