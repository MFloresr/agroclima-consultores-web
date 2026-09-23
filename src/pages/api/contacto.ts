// POST /api/contacto: recibe el formulario (JSON o envío nativo).
// 1) descarta robots (campo trampa + Turnstile), 2) valida con Zod, 3) guarda en Supabase,
// 4) avisa por email con Resend. Si el email falla, la solicitud ya está guardada y
// /api/mantenimiento reintenta el aviso. Responde JSON o redirige (303) según la cabecera Accept.

import type { APIRoute } from 'astro';
import { TURNSTILE_SECRET_KEY } from 'astro:env/server';
import {
  almacenConfigurado,
  emailConfigurado,
  enviarAviso,
  esquemaContacto,
  guardarContacto,
  marcarEmailEnviado,
} from '../../lib/contactos';

export const prerender = false;

function responder(request: Request, estado: number, cuerpo: { ok: boolean; mensaje: string; errores?: Record<string, string> }) {
  const quiereJson = request.headers.get('accept')?.includes('application/json');
  if (quiereJson) {
    return new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'Content-Type': 'application/json' } });
  }
  // Sin JavaScript: el formulario se envía de forma nativa y redirigimos a una página de resultado
  const destino = cuerpo.ok ? '/contacto/gracias' : `/contacto?error=${encodeURIComponent(cuerpo.mensaje)}#formulario`;
  return new Response(null, { status: 303, headers: { Location: destino } });
}

async function verificarTurnstile(token: string | null, ip: string | null) {
  if (!TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  const datos = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
  if (ip) datos.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: datos });
  const resultado = (await r.json()) as { success: boolean };
  return resultado.success;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let formulario: FormData;
  try {
    formulario = await request.formData();
  } catch {
    return responder(request, 400, { ok: false, mensaje: 'No hemos podido leer el formulario.' });
  }

  // Campo trampa: los robots lo rellenan, las personas no lo ven
  if (String(formulario.get('web') ?? '') !== '') {
    return responder(request, 200, { ok: true, mensaje: 'Solicitud recibida.' });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? clientAddress ?? null;
  if (!(await verificarTurnstile(formulario.get('cf-turnstile-response') as string | null, ip))) {
    return responder(request, 400, { ok: false, mensaje: 'No hemos podido comprobar que no eres un robot. Vuelve a intentarlo.' });
  }

  const resultado = esquemaContacto.safeParse({
    cultivo: formulario.get('cultivo') ?? undefined,
    hectareas: String(formulario.get('hectareas') ?? ''),
    tieneEstacion: formulario.get('tieneEstacion') ?? undefined,
    nombre: formulario.get('nombre') ?? '',
    telefono: formulario.get('telefono') ?? '',
    email: formulario.get('email') ?? '',
    mensaje: formulario.get('mensaje') ?? undefined,
    servicio: formulario.get('servicio') ?? undefined,
    privacidad: formulario.get('privacidad') ?? undefined,
  });

  if (!resultado.success) {
    const errores: Record<string, string> = {};
    for (const problema of resultado.error.issues) {
      const campo = String(problema.path[0] ?? 'formulario');
      errores[campo] ??= problema.message;
    }
    return responder(request, 422, { ok: false, mensaje: 'Revisa los campos marcados.', errores });
  }

  const contacto = resultado.data;

  if (!almacenConfigurado()) {
    if (import.meta.env.DEV) {
      console.info('[contacto] Supabase sin configurar. Solicitud recibida en desarrollo:', contacto);
      return responder(request, 200, { ok: true, mensaje: 'Solicitud recibida (modo desarrollo, no se ha guardado).' });
    }
    console.error('[contacto] Falta configurar SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
    return responder(request, 503, {
      ok: false,
      mensaje: 'Ahora mismo no podemos recibir el formulario. Llámanos o escríbenos por WhatsApp, por favor.',
    });
  }

  let id: string;
  try {
    id = (await guardarContacto(contacto, request.headers.get('referer') ?? '')).id;
  } catch (error) {
    console.error('[contacto] Error al guardar', error);
    return responder(request, 502, {
      ok: false,
      mensaje: 'No se ha podido enviar. Tus datos siguen en el formulario: vuelve a intentarlo o llámanos.',
    });
  }

  // La solicitud ya está guardada: un fallo del email no se muestra como error al agricultor
  if (emailConfigurado()) {
    try {
      await enviarAviso(contacto);
      await marcarEmailEnviado(id);
    } catch (error) {
      console.error('[contacto] Guardado, pero falló el aviso por email (se reintentará)', error);
    }
  }

  return responder(request, 200, { ok: true, mensaje: 'Solicitud recibida.' });
};
