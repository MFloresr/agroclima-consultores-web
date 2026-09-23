// Tarea diaria (cron de Vercel, ver vercel.json):
// 1. Reintenta los avisos por email que fallaron.
// 2. Mantiene activa la base de datos del plan gratuito de Supabase, que se pausa tras una semana sin actividad.

import type { APIRoute } from 'astro';
import { CRON_SECRET } from 'astro:env/server';
import {
  almacenConfigurado,
  contactosSinAviso,
  emailConfigurado,
  enviarAviso,
  filaAContacto,
  marcarEmailEnviado,
} from '../../lib/contactos';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!CRON_SECRET || request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) {
    return new Response('No autorizado', { status: 401 });
  }
  if (!almacenConfigurado()) {
    return Response.json({ ok: false, motivo: 'Supabase sin configurar' }, { status: 503 });
  }

  const pendientes = await contactosSinAviso();
  let reenviados = 0;
  if (emailConfigurado()) {
    for (const fila of pendientes) {
      try {
        await enviarAviso(filaAContacto(fila));
        await marcarEmailEnviado(fila.id);
        reenviados++;
      } catch (error) {
        console.error('[mantenimiento] Aviso no reenviado', fila.id, error);
      }
    }
  }

  return Response.json({ ok: true, pendientes: pendientes.length, reenviados });
};
