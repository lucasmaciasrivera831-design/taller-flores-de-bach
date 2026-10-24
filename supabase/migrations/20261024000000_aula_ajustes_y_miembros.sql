-- Flor de Luz · aula conectada (T9–T13)
-- 1) Ajustes globales (link de Meet) legibles por los alumnos.
-- 2) Defensa en profundidad: el contenido solo lo lee quien tiene un perfil
--    (alumno habilitado o docente), no cualquier cuenta con sesión. Así, aunque
--    el registro público de Auth estuviera abierto, un extraño no ve nada.

create table public.ajustes (
  clave text primary key,
  valor text not null default ''
);

create function public.es_miembro()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.perfiles where user_id = auth.uid());
$$;

revoke all on function public.es_miembro() from public, anon, authenticated;
grant execute on function public.es_miembro() to authenticated;

revoke all on public.ajustes from anon, authenticated;
grant select on public.ajustes to authenticated;
grant insert, update, delete on public.ajustes to authenticated;
alter table public.ajustes enable row level security;
create policy ajustes_leer on public.ajustes for select to authenticated using (public.es_miembro());
create policy ajustes_admin_todo on public.ajustes
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

insert into public.ajustes (clave, valor) values ('meet_url', '')
on conflict (clave) do nothing;

-- Políticas de lectura más estrictas
drop policy clases_leer_publicadas on public.clases;
create policy clases_leer_publicadas on public.clases
  for select to authenticated using (estado = 'publicada' and public.es_miembro());

drop policy material_leer on public.material;
create policy material_leer on public.material
  for select to authenticated using (public.es_miembro());

drop policy storage_contenido_leer on storage.objects;
create policy storage_contenido_leer on storage.objects
  for select to authenticated
  using (bucket_id in ('clases-pdf','biblioteca') and public.es_miembro());

drop policy examenes_entregar on public.examenes;
create policy examenes_entregar on public.examenes
  for insert to authenticated
  with check (user_id = auth.uid() and estado = 'entregado' and comentario is null and public.es_miembro());
