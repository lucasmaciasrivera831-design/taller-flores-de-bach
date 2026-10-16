-- Flor de Luz · esquema inicial (T3)
-- Principios: RLS en TODAS las tablas, permisos mínimos, buckets privados,
-- seed idempotente. Un visitante anónimo solo puede INSERTAR una inscripción.

-- ───────────── Tablas ─────────────

create table public.planes (
  id          text primary key,
  nombre      text    not null,
  cuotas      integer not null check (cuotas > 0),
  monto_cuota integer not null check (monto_cuota > 0),
  sena        integer not null check (sena >= 0),
  total       integer generated always as (cuotas * monto_cuota) stored,
  orden       integer not null default 0
);

create table public.inscripciones (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null check (char_length(nombre)   between 2 and 60),
  apellido   text not null check (char_length(apellido) between 2 and 60),
  email      text not null check (char_length(email) <= 120 and email = lower(email)),
  whatsapp   text not null check (char_length(whatsapp) between 8 and 30),
  ciudad     text not null check (char_length(ciudad) between 2 and 80),
  plan_id    text not null references public.planes(id),
  estado     text not null default 'pendiente'
             check (estado in ('pendiente','sena_recibida','activo','baja')),
  notas      text,
  created_at timestamptz not null default now()
);
create unique index inscripciones_email_unico on public.inscripciones (email);

create table public.perfiles (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  rol            text not null check (rol in ('admin','alumno')),
  inscripcion_id uuid unique references public.inscripciones(id) on delete set null,
  debe_cambiar_clave boolean not null default false,
  created_at     timestamptz not null default now()
);

create table public.cuotas (
  inscripcion_id uuid not null references public.inscripciones(id) on delete cascade,
  numero         integer not null check (numero > 0),
  monto          integer not null check (monto >= 0),
  pagada         boolean not null default false,
  primary key (inscripcion_id, numero)
);

create table public.clases (
  id          uuid primary key default gen_random_uuid(),
  orden       integer not null unique check (orden between 1 and 20),
  titulo      text not null,
  descripcion text,
  fecha       date,
  video_url   text,   -- link de YouTube, Fathom u otro
  pdf_path    text,   -- ruta dentro del bucket clases-pdf
  meet_url    text,
  estado      text not null default 'borrador' check (estado in ('borrador','publicada')),
  created_at  timestamptz not null default now()
);

create table public.material (
  id           uuid primary key default gen_random_uuid(),
  categoria    text not null,
  titulo       text not null,
  archivo_path text not null,   -- ruta dentro del bucket biblioteca
  orden        integer not null default 0,
  created_at   timestamptz not null default now()
);

create table public.examenes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  archivo_path text not null,   -- ruta dentro del bucket examenes: <user_id>/...
  estado       text not null default 'entregado'
               check (estado in ('entregado','aprobado','a_corregir')),
  comentario   text,
  entregado_en timestamptz not null default now()
);

create table public.diplomas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  codigo     text not null unique,
  emitido_en timestamptz not null default now()
);

-- ───────────── Funciones ─────────────

create function public.es_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.perfiles where user_id = auth.uid() and rol = 'admin'
  );
$$;

create function public.mi_inscripcion_id()
returns uuid
language sql stable security definer set search_path = ''
as $$
  select inscripcion_id from public.perfiles where user_id = auth.uid();
$$;

-- Las cuotas las calcula la base (la seña se descuenta de las primeras, en orden),
-- así un visitante no puede inventar montos. Espeja calcularCuotas() de src/lib/planes.ts.
create function public.generar_cuotas()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  p public.planes%rowtype;
  por_descontar integer;
  descuento integer;
  n integer;
begin
  select * into p from public.planes where id = new.plan_id;
  por_descontar := p.sena;
  for n in 1..p.cuotas loop
    descuento := least(por_descontar, p.monto_cuota);
    por_descontar := por_descontar - descuento;
    insert into public.cuotas (inscripcion_id, numero, monto)
    values (new.id, n, p.monto_cuota - descuento);
  end loop;
  return new;
end;
$$;

create trigger inscripciones_generar_cuotas
  after insert on public.inscripciones
  for each row execute function public.generar_cuotas();

-- Verificación pública del diploma: devuelve solo lo mínimo, nunca la tabla.
create function public.verificar_diploma(p_codigo text)
returns table (nombre text, emitido_en timestamptz)
language sql stable security definer set search_path = ''
as $$
  select i.nombre || ' ' || i.apellido, d.emitido_en
  from public.diplomas d
  join public.perfiles pf on pf.user_id = d.user_id
  join public.inscripciones i on i.id = pf.inscripcion_id
  where d.codigo = upper(trim(p_codigo));
$$;

-- ───────────── Permisos mínimos (además de RLS) ─────────────

revoke all on all tables    in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant select on public.planes to anon, authenticated;
grant insert on public.inscripciones to anon, authenticated;
grant select on public.inscripciones, public.perfiles, public.cuotas,
                public.clases, public.material, public.examenes, public.diplomas
  to authenticated;
grant insert on public.examenes to authenticated;
grant insert, update, delete on public.inscripciones, public.perfiles, public.cuotas,
                public.clases, public.material, public.diplomas to authenticated;
grant update, delete on public.examenes to authenticated;
-- (las políticas de abajo limitan esas escrituras a la docente)

grant execute on function public.es_admin()            to authenticated;
grant execute on function public.mi_inscripcion_id()   to authenticated;
grant execute on function public.verificar_diploma(text) to anon, authenticated;

-- ───────────── RLS ─────────────

alter table public.planes        enable row level security;
alter table public.inscripciones enable row level security;
alter table public.perfiles      enable row level security;
alter table public.cuotas        enable row level security;
alter table public.clases        enable row level security;
alter table public.material      enable row level security;
alter table public.examenes      enable row level security;
alter table public.diplomas      enable row level security;

-- planes: información pública
create policy planes_leer on public.planes for select to anon, authenticated using (true);

-- inscripciones: el visitante solo inserta (nunca lee); el alumno ve la suya; la docente todo
create policy inscripciones_insertar on public.inscripciones
  for insert to anon, authenticated
  with check (estado = 'pendiente' and notas is null);
create policy inscripciones_leer_propia on public.inscripciones
  for select to authenticated using (id = public.mi_inscripcion_id());
create policy inscripciones_admin_leer on public.inscripciones
  for select to authenticated using (public.es_admin());
create policy inscripciones_admin_editar on public.inscripciones
  for update to authenticated using (public.es_admin()) with check (public.es_admin());
create policy inscripciones_admin_borrar on public.inscripciones
  for delete to authenticated using (public.es_admin());

-- perfiles
create policy perfiles_leer_propio on public.perfiles
  for select to authenticated using (user_id = auth.uid());
create policy perfiles_admin_todo on public.perfiles
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- cuotas: el alumno ve las suyas; las gestiona la docente
create policy cuotas_leer_propias on public.cuotas
  for select to authenticated using (inscripcion_id = public.mi_inscripcion_id());
create policy cuotas_admin_todo on public.cuotas
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- clases: el alumno solo las publicadas; la docente todo
create policy clases_leer_publicadas on public.clases
  for select to authenticated using (estado = 'publicada');
create policy clases_admin_todo on public.clases
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- material: lo ve cualquier cuenta con sesión; lo gestiona la docente
create policy material_leer on public.material for select to authenticated using (true);
create policy material_admin_todo on public.material
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- examenes: cada alumno entrega y ve los suyos; la docente corrige
create policy examenes_leer_propios on public.examenes
  for select to authenticated using (user_id = auth.uid() or public.es_admin());
create policy examenes_entregar on public.examenes
  for insert to authenticated
  with check (user_id = auth.uid() and estado = 'entregado' and comentario is null);
create policy examenes_admin_editar on public.examenes
  for update to authenticated using (public.es_admin()) with check (public.es_admin());
create policy examenes_admin_borrar on public.examenes
  for delete to authenticated using (public.es_admin());

-- diplomas: el alumno ve el suyo; la docente todo
create policy diplomas_leer_propio on public.diplomas
  for select to authenticated using (user_id = auth.uid());
create policy diplomas_admin_todo on public.diplomas
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- ───────────── Storage: buckets privados ─────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('clases-pdf', 'clases-pdf', false, 31457280, array['application/pdf']),
  ('biblioteca', 'biblioteca', false, 31457280, array['application/pdf','image/png','image/jpeg','image/webp']),
  ('examenes',   'examenes',   false, 10485760, array['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('diplomas',   'diplomas',   false,  5242880, array['application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- clases-pdf y biblioteca: leen las cuentas con sesión, escribe la docente
create policy storage_contenido_leer on storage.objects
  for select to authenticated
  using (bucket_id in ('clases-pdf','biblioteca'));
create policy storage_contenido_admin on storage.objects
  for all to authenticated
  using (bucket_id in ('clases-pdf','biblioteca') and public.es_admin())
  with check (bucket_id in ('clases-pdf','biblioteca') and public.es_admin());

-- examenes: cada alumno en su carpeta <user_id>/..., la docente ve todo
create policy storage_examenes_alumno on storage.objects
  for all to authenticated
  using (bucket_id = 'examenes' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'examenes' and (storage.foldername(name))[1] = auth.uid()::text);
create policy storage_examenes_admin on storage.objects
  for select to authenticated
  using (bucket_id = 'examenes' and public.es_admin());

-- diplomas: el alumno lee el suyo, la docente todo
create policy storage_diplomas_alumno on storage.objects
  for select to authenticated
  using (bucket_id = 'diplomas' and (storage.foldername(name))[1] = auth.uid()::text);
create policy storage_diplomas_admin on storage.objects
  for all to authenticated
  using (bucket_id = 'diplomas' and public.es_admin())
  with check (bucket_id = 'diplomas' and public.es_admin());

-- ───────────── Seed idempotente ─────────────

insert into public.planes (id, nombre, cuotas, monto_cuota, sena, orden) values
  ('unico',         'Pago único',         1, 300000, 60000, 1),
  ('dos-pagos',     '2 pagos',            2, 170000, 60000, 2),
  ('por-encuentro', 'Pago por encuentro', 5,  80000, 60000, 3)
on conflict (id) do update
  set nombre = excluded.nombre, cuotas = excluded.cuotas,
      monto_cuota = excluded.monto_cuota, sena = excluded.sena, orden = excluded.orden;
