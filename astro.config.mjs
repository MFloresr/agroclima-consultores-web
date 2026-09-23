// @ts-check
import { defineConfig, envField } from 'astro/config';

import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://agroclimaconsultores.es',
  integrations: [svelte(), sitemap()],
  adapter: vercel(),
  env: {
    schema: {
      // Base de datos de contactos (Supabase, región UE)
      SUPABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Envío de emails (Resend)
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_EMAIL_TO: envField.string({ context: 'server', access: 'secret', default: 'jordi@agroclimaconsultores.es' }),
      CONTACT_EMAIL_FROM: envField.string({ context: 'server', access: 'secret', default: 'AgroClima web <web@agroclimaconsultores.es>' }),
      // Antispam (Cloudflare Turnstile)
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      // Protege el endpoint de mantenimiento que llama el cron diario
      CRON_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
