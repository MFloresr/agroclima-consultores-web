// Guardado de solicitudes (Supabase) y aviso por email (Resend).
// Orden: primero se guarda y después se envía el email. Si el email falla, la solicitud
// queda guardada con email_enviado = false y el mantenimiento diario reintenta el aviso.

import { z } from 'astro/zod';
import {
  CONTACT_EMAIL_FROM,
  CONTACT_EMAIL_TO,
  RESEND_API_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from 'astro:env/server';
import { CULTIVOS } from '../data/cultivos';

const texto = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres`);

export const esquemaContacto = z.object({
  cultivo: z.enum(CULTIVOS, { message: 'Elige un tipo de cultivo' }),
  hectareas: z
    .string()
    .trim()
    .transform((v) => v.replace(',', '.'))
    .refine((v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) < 100000), 'Indica un número de hectáreas válido')
    .transform((v) => (v === '' ? null : Number(v))),
  tieneEstacion: z.enum(['No', 'Sí', 'No lo sé']).default('No'),
  nombre: texto(120).min(2, 'Escribe tu nombre'),
  telefono: texto(30).regex(/^[+\d][\d\s().-]{7,}$/, 'Escribe un teléfono válido'),
  email: texto(160).pipe(z.email({ message: 'Escribe un email válido' })),
  mensaje: texto(3000).default(''),
  servicio: texto(120).default(''),
  privacidad: z.literal('si', { message: 'Debes aceptar la política de privacidad' }),
});

export type Contacto = z.infer<typeof esquemaContacto>;

interface FilaContacto {
  id: string;
  creado: string;
  cultivo: string;
  hectareas: number | null;
  tiene_estacion: string;
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
  servicio: string;
}

export const almacenConfigurado = () => Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
export const emailConfigurado = () => Boolean(RESEND_API_KEY);

function cabecerasSupabase(extra: Record<string, string> = {}) {
  const clave = SUPABASE_SERVICE_ROLE_KEY ?? '';
  const cabeceras: Record<string, string> = { apikey: clave, 'Content-Type': 'application/json', ...extra };
  // Las claves antiguas (JWT) también van en Authorization; las nuevas (sb_secret_…) solo en apikey
  if (clave.startsWith('eyJ')) cabeceras.Authorization = `Bearer ${clave}`;
  return cabeceras;
}

export async function guardarContacto(c: Contacto, origen: string): Promise<FilaContacto> {
  const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/contactos`, {
    method: 'POST',
    headers: cabecerasSupabase({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      cultivo: c.cultivo,
      hectareas: c.hectareas,
      tiene_estacion: c.tieneEstacion,
      nombre: c.nombre,
      telefono: c.telefono,
      email: c.email,
      mensaje: c.mensaje,
      servicio: c.servicio,
      acepta_privacidad: true,
      origen,
    }),
  });
  if (!respuesta.ok) {
    throw new Error(`Supabase respondió ${respuesta.status}: ${await respuesta.text()}`);
  }
  const [fila] = (await respuesta.json()) as FilaContacto[];
  return fila;
}

export async function marcarEmailEnviado(id: string) {
  const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/contactos?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: cabecerasSupabase(),
    body: JSON.stringify({ email_enviado: true }),
  });
  if (!respuesta.ok) throw new Error(`Supabase respondió ${respuesta.status}`);
}

export async function contactosSinAviso(limite = 20): Promise<FilaContacto[]> {
  const url = `${SUPABASE_URL}/rest/v1/contactos?email_enviado=eq.false&order=creado.asc&limit=${limite}`;
  const respuesta = await fetch(url, { headers: cabecerasSupabase() });
  if (!respuesta.ok) throw new Error(`Supabase respondió ${respuesta.status}`);
  return (await respuesta.json()) as FilaContacto[];
}

export async function enviarAviso(c: {
  nombre: string;
  telefono: string;
  email: string;
  cultivo: string;
  hectareas: number | null;
  tieneEstacion: string;
  mensaje: string;
  servicio: string;
}) {
  const lineas = [
    `Nueva solicitud desde la web de AgroClima Consultores`,
    '',
    `Nombre: ${c.nombre}`,
    `Teléfono: ${c.telefono}`,
    `Email: ${c.email}`,
    `Cultivo: ${c.cultivo}`,
    `Hectáreas: ${c.hectareas ?? 'sin indicar'}`,
    `¿Tiene estación?: ${c.tieneEstacion}`,
    c.servicio ? `Servicio de interés: ${c.servicio}` : '',
    '',
    'Mensaje:',
    c.mensaje || '(sin mensaje)',
  ].filter((l, i, arr) => l !== '' || arr[i - 1] !== '');

  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_EMAIL_FROM,
      to: [CONTACT_EMAIL_TO],
      reply_to: c.email,
      subject: `Nueva solicitud: ${c.nombre} · ${c.cultivo}${c.hectareas ? ` · ${c.hectareas} ha` : ''}`,
      text: lineas.join('\n'),
    }),
  });
  if (!respuesta.ok) {
    throw new Error(`Resend respondió ${respuesta.status}: ${await respuesta.text()}`);
  }
}

export function filaAContacto(f: FilaContacto) {
  return {
    nombre: f.nombre,
    telefono: f.telefono,
    email: f.email,
    cultivo: f.cultivo,
    hectareas: f.hectareas,
    tieneEstacion: f.tiene_estacion,
    mensaje: f.mensaje,
    servicio: f.servicio,
  };
}
