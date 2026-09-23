# Web de AgroClima Consultores

Web de agroclimaconsultores.es: presentación de servicios, panel de datos climáticos de ejemplo y formulario de contacto que guarda cada solicitud y avisa por email.

## Tecnologías

| Pieza | Tecnología |
| --- | --- |
| Páginas | Astro 7 (HTML estático, casi sin JavaScript) |
| Partes interactivas | Svelte 5 (panel de datos, resumen de la home, mapa) |
| Gráficos | uPlot |
| Mapa | Leaflet + OpenStreetMap |
| Contenido | Sanity (panel en https://agroclima-consultores.sanity.studio), leído al compilar |
| Formulario | Endpoint `/api/contacto` → Supabase (UE) + aviso por email con Resend |
| Antispam | Campo trampa + Cloudflare Turnstile (opcional) |
| Hosting | Vercel (adaptador `@astrojs/vercel`) |

## Puesta en marcha

```bash
npm install
cp .env.example .env   # opcional en desarrollo
npm run dev            # o: npx astro dev --background
```

Sin variables de Supabase, en desarrollo el formulario solo muestra la solicitud en la consola.

Otros comandos: `npx astro check` (tipos), `npm run build` (compilación).

## Estructura

```
studio/               Panel de edición de Sanity (modelo de contenido en studio/schemaTypes)
src/
  content.config.ts   Colecciones que se descargan de Sanity (servicios, casos, blog)
  lib/sanity.ts       Cliente de Sanity, fotos optimizadas y texto con formato → HTML
  lib/contenido.ts    Documentos únicos: datos de contacto, portada, sobre AgroClima
  data/               Datos de contacto, navegación, iconos, cultivos
  lib/clima/          Datos climáticos: formato común + fuente de ejemplo
  lib/contactos.ts    Validación, guardado en Supabase y aviso por email
  components/         Componentes Astro y Svelte
  pages/              Páginas y endpoints (api/contacto, api/mantenimiento)
supabase/migrations/  SQL de la tabla de contactos
vercel.json           Cron diario de mantenimiento
```

## Contenido (Sanity)

- Proyecto `3cabmdy3`, conjunto de datos `production` (lectura pública: solo contenido de la web, nunca los contactos).
- Panel: https://agroclima-consultores.sanity.studio. Desarrollo local del panel: `cd studio && npm install && npm run dev`.
- Al publicar en el panel, un webhook de Sanity llama a un deploy hook de Vercel y la web se vuelve a compilar (1 minuto aprox.).
- Tras cambiar el modelo de contenido: `cd studio && npx sanity deploy`.

## Cómo funciona el formulario

1. Valida los datos en el servidor y descarta a los robots (campo trampa y Turnstile).
2. **Guarda primero** la solicitud en Supabase.
3. Después envía el aviso a `CONTACT_EMAIL_TO`. Si el email falla, la solicitud queda guardada con `email_enviado = false`.
4. El cron diario (`/api/mantenimiento`, protegido con `CRON_SECRET`) reintenta esos avisos y mantiene activa la base de datos del plan gratuito.
5. En el navegador, lo escrito se guarda localmente para no perderlo si se corta la cobertura, y se borra al enviarlo. Sin JavaScript, el formulario también funciona.

## Datos climáticos (fase 2)

El panel lee los datos mediante `obtenerDatos()` de `src/lib/clima/index.ts`. Hoy apunta a `fuente-ejemplo.ts`, que genera valores verosímiles para Lleida según la época del año. Para conectar las estaciones Pessl (FieldClimate API):

1. Crear un endpoint `/api/clima` que llame a FieldClimate con las claves HMAC y devuelva el formato `DatosEstacion` de `tipos.ts`, con caché de 10–15 minutos.
2. Sustituir `fuenteEjemplo` en `index.ts` por una fuente que haga `fetch('/api/clima?finca=…')`.

## Despliegue

El proyecto de Vercel está conectado a este repositorio:

- Cada `git push` a `main` publica la web automáticamente.
- Cada rama o pull request genera una versión de previsualización con su propio enlace.
- Versión de prueba actual: https://agroclima-consultores-prueba.vercel.app (no indexable por buscadores).

## Puesta en producción

1. Crear en Supabase (región UE) el proyecto a nombre de AgroClima y ejecutar `supabase/migrations/0001_contactos.sql`.
2. Verificar el dominio en Resend y crear la clave.
3. Crear las claves de Turnstile.
4. En Vercel, crear el proyecto a nombre de AgroClima, añadir las variables de `.env.example` y conectar el dominio sin tocar los registros MX del correo.

## Pendiente de AgroClima

- [x] Logo: hoja con línea de datos y sol (`src/components/Logo.astro`, `public/logo/`, `public/favicon.svg`)
- [ ] Teléfono y número de WhatsApp reales (en el panel: «Datos de contacto»)
- [x] Fotos provisionales de Unsplash (se cambian en el panel)
- [x] Casos de éxito con datos de ejemplo (se editan en el panel)
- [x] Cifras y trayectoria en «Sobre AgroClima» (se editan en el panel)
- [x] NIF y domicilio en los textos legales
- [ ] Revisión de los textos legales por un asesor
