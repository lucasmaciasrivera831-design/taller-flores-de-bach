-- La alumna puede apagar SU indicador de contraseña temporal y nada más:
-- permiso de UPDATE solo sobre esa columna + política limitada a su fila.
-- (Sin esto, el cambio de clave se guardaba pero el indicador seguía en true
-- y la app la devolvía una y otra vez a /cambiar-clave.)
revoke update on public.perfiles from authenticated;
grant update (debe_cambiar_clave) on public.perfiles to authenticated;

create policy perfiles_actualizar_propio on public.perfiles
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
