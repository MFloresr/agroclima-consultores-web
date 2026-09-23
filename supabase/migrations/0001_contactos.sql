-- Tabla de solicitudes del formulario de contacto de agroclimaconsultores.es
-- Crear el proyecto de Supabase en una región de la UE (p. ej., Frankfurt o París).

create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  creado timestamptz not null default now(),
  cultivo text not null check (cultivo in ('Frutal', 'Viñedo', 'Cereal', 'Olivo', 'Otros')),
  hectareas numeric check (hectareas is null or hectareas >= 0),
  tiene_estacion text not null default 'No' check (tiene_estacion in ('No', 'Sí', 'No lo sé')),
  nombre text not null,
  telefono text not null,
  email text not null,
  mensaje text not null default '',
  servicio text not null default '',
  acepta_privacidad boolean not null,
  origen text not null default '',
  email_enviado boolean not null default false
);

create index if not exists contactos_pendientes_idx
  on public.contactos (creado)
  where email_enviado = false;

-- Solo el servidor de la web (clave secreta) accede a la tabla.
-- Con RLS activo y sin políticas, las claves públicas no pueden leer ni escribir.
alter table public.contactos enable row level security;
revoke all on public.contactos from anon, authenticated;

comment on table public.contactos is 'Solicitudes recibidas desde el formulario de contacto de la web';
