-- Pruebas de RLS de Flor de Luz. Se ejecuta en el SQL Editor (o con execute_sql).
-- Crea datos de prueba, ejercita anónimo / alumno A / alumno B / docente y SIEMPRE
-- termina con RAISE EXCEPTION, que revierte todo. El "error" final ES el reporte.
-- Cada línea trae "(esperado ...)": cualquier "PERMITIDO (MAL)" o "FALLA" es un bug.
-- Resultado de referencia (2026-10-13): todo coincide con lo esperado.
do $$
declare
  r text := ''; s text; n int;
  ua uuid := gen_random_uuid(); ub uuid := gen_random_uuid(); ud uuid := gen_random_uuid();
  ia uuid; ib uuid; c_pub uuid; c_bor uuid;
begin
  insert into auth.users (id, instance_id, aud, role, email) values
    (ua,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','a@test.x'),
    (ub,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','b@test.x'),
    (ud,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','d@test.x');
  insert into public.inscripciones (nombre,apellido,email,whatsapp,ciudad,plan_id,estado) values ('Ana','Alfa','a@test.x','1111111111','Santa Fe','dos-pagos','activo') returning id into ia;
  insert into public.inscripciones (nombre,apellido,email,whatsapp,ciudad,plan_id,estado) values ('Beto','Beta','b@test.x','2222222222','Rosario','por-encuentro','activo') returning id into ib;
  insert into public.perfiles (user_id,rol,inscripcion_id) values (ua,'alumno',ia),(ub,'alumno',ib),(ud,'admin',null);
  insert into public.clases (orden,titulo,estado) values (1,'Publicada','publicada') returning id into c_pub;
  insert into public.clases (orden,titulo,estado) values (2,'Borrador','borrador') returning id into c_bor;
  insert into public.examenes (user_id,archivo_path) values (ua, ua::text||'/ex.pdf');

  select string_agg(monto::text, ',' order by numero) into s from public.cuotas where inscripcion_id=ia;
  r := r || 'cuotas 2 pagos: ' || s || ' (esperado 110000,170000)' || E'\n';
  select string_agg(monto::text, ',' order by numero) into s from public.cuotas where inscripcion_id=ib;
  r := r || 'cuotas por encuentro: ' || s || ' (esperado 20000,80000,80000,80000,80000)' || E'\n';

  -- ANÓNIMO
  set local role anon; perform set_config('request.jwt.claims','{"role":"anon"}',true);
  begin insert into public.inscripciones (nombre,apellido,email,whatsapp,ciudad,plan_id) values ('Vis','Itante','v@test.x','3333333333','X Y','unico'); r:=r||'anon INSERT inscripcion: OK (esperado)'||E'\n';
  exception when others then r:=r||'anon INSERT inscripcion: FALLA '||sqlerrm||E'\n'; end;
  begin select count(*) into n from public.inscripciones; r:=r||format('anon SELECT inscripciones: %s (esperado 0 o bloqueado)%s',n,E'\n');
  exception when others then r:=r||'anon SELECT inscripciones: bloqueado '||sqlstate||E'\n'; end;
  begin select count(*) into n from public.clases; r:=r||format('anon SELECT clases: %s (esperado 0 o bloqueado)%s',n,E'\n');
  exception when others then r:=r||'anon SELECT clases: bloqueado '||sqlstate||E'\n'; end;
  select count(*) into n from public.planes; r:=r||format('anon SELECT planes: %s (esperado 3)%s',n,E'\n');
  begin insert into public.inscripciones (nombre,apellido,email,whatsapp,ciudad,plan_id,estado) values ('Hack','Er','h@test.x','4444444444','X Y','unico','activo'); r:=r||'anon INSERT estado=activo: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'anon INSERT estado=activo: bloqueado '||sqlstate||E'\n'; end;
  begin insert into public.inscripciones (nombre,apellido,email,whatsapp,ciudad,plan_id) values ('Dup','Licado','a@test.x','5555555555','X Y','unico'); r:=r||'anon email duplicado: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'anon email duplicado: bloqueado '||sqlstate||E'\n'; end;
  begin insert into public.cuotas values (ia,9,1,true); r:=r||'anon INSERT cuotas: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'anon INSERT cuotas: bloqueado '||sqlstate||E'\n'; end;
  begin select count(*) into n from public.diplomas; r:=r||'anon SELECT diplomas: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'anon SELECT diplomas: bloqueado '||sqlstate||E'\n'; end;
  begin select count(*) into n from storage.objects where bucket_id='examenes'; r:=r||format('anon storage examenes: %s (esperado 0)%s',n,E'\n');
  exception when others then r:=r||'anon storage: bloqueado '||sqlstate||E'\n'; end;
  reset role;

  -- ALUMNO A
  set local role authenticated; perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',ua)::text, true);
  select count(*) into n from public.inscripciones; r:=r||format('A SELECT inscripciones: %s (esperado 1)%s',n,E'\n');
  select count(*) into n from public.cuotas; r:=r||format('A SELECT cuotas: %s (esperado 2)%s',n,E'\n');
  select count(*) into n from public.clases; r:=r||format('A SELECT clases: %s (esperado 1)%s',n,E'\n');
  select count(*) into n from public.clases where id=c_bor; r:=r||format('A ve clase borrador: %s (esperado 0)%s',n,E'\n');
  select count(*) into n from public.examenes; r:=r||format('A SELECT examenes: %s (esperado 1)%s',n,E'\n');
  select count(*) into n from public.perfiles; r:=r||format('A SELECT perfiles: %s (esperado 1)%s',n,E'\n');
  begin insert into public.clases (orden,titulo,estado) values (9,'Hack','publicada'); r:=r||'A INSERT clase: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'A INSERT clase: bloqueado '||sqlstate||E'\n'; end;
  update public.clases set titulo='hack' where id=c_pub; get diagnostics n = row_count; r:=r||format('A UPDATE clase: %s (esperado 0)%s',n,E'\n');
  update public.cuotas set pagada=true where inscripcion_id=ia; get diagnostics n = row_count; r:=r||format('A UPDATE sus cuotas: %s (esperado 0)%s',n,E'\n');
  update public.inscripciones set estado='baja' where id=ia; get diagnostics n = row_count; r:=r||format('A UPDATE su inscripcion: %s (esperado 0)%s',n,E'\n');
  update public.perfiles set rol='admin' where user_id=ua; get diagnostics n = row_count; r:=r||format('A auto-ascenso a admin: %s (esperado 0)%s',n,E'\n');
  begin insert into public.perfiles (user_id,rol) values (gen_random_uuid(),'admin'); r:=r||'A INSERT perfil admin: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'A INSERT perfil admin: bloqueado '||sqlstate||E'\n'; end;
  begin insert into public.examenes (user_id,archivo_path) values (ub, ub::text||'/x.pdf'); r:=r||'A entrega examen como B: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'A entrega examen como B: bloqueado '||sqlstate||E'\n'; end;
  begin insert into public.examenes (user_id,archivo_path) values (ua, ua::text||'/y.pdf'); r:=r||'A entrega su examen: OK (esperado)'||E'\n';
  exception when others then r:=r||'A entrega su examen: FALLA '||sqlerrm||E'\n'; end;
  begin insert into public.examenes (user_id,archivo_path,estado) values (ua, ua::text||'/z.pdf','aprobado'); r:=r||'A se autoaprueba: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'A se autoaprueba: bloqueado '||sqlstate||E'\n'; end;
  begin insert into public.diplomas (user_id,codigo) values (ua,'FAKE'); r:=r||'A emite su diploma: PERMITIDO (MAL)'||E'\n';
  exception when others then r:=r||'A emite su diploma: bloqueado '||sqlstate||E'\n'; end;
  reset role;

  -- ALUMNO B
  set local role authenticated; perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',ub)::text, true);
  select count(*) into n from public.inscripciones; r:=r||format('B SELECT inscripciones: %s (esperado 1)%s',n,E'\n');
  select count(*) into n from public.inscripciones where id=ia; r:=r||format('B ve inscripcion de A: %s (esperado 0)%s',n,E'\n');
  select count(*) into n from public.cuotas where inscripcion_id=ia; r:=r||format('B ve cuotas de A: %s (esperado 0)%s',n,E'\n');
  select count(*) into n from public.examenes; r:=r||format('B SELECT examenes: %s (esperado 0)%s',n,E'\n');
  select count(*) into n from public.perfiles where user_id=ua; r:=r||format('B ve perfil de A: %s (esperado 0)%s',n,E'\n');
  reset role;

  -- DOCENTE
  set local role authenticated; perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',ud)::text, true);
  select count(*) into n from public.inscripciones; r:=r||format('ADMIN SELECT inscripciones: %s (esperado 3)%s',n,E'\n');
  select count(*) into n from public.clases; r:=r||format('ADMIN SELECT clases: %s (esperado 2)%s',n,E'\n');
  select count(*) into n from public.examenes; r:=r||format('ADMIN SELECT examenes: %s (esperado 2)%s',n,E'\n');
  update public.cuotas set pagada=true where inscripcion_id=ia and numero=1; get diagnostics n = row_count; r:=r||format('ADMIN UPDATE cuota: %s (esperado 1)%s',n,E'\n');
  update public.examenes set estado='aprobado' where user_id=ua; get diagnostics n = row_count; r:=r||format('ADMIN corrige examenes: %s (esperado 2)%s',n,E'\n');
  begin insert into public.clases (orden,titulo) values (3,'Nueva'); r:=r||'ADMIN INSERT clase: OK (esperado)'||E'\n';
  exception when others then r:=r||'ADMIN INSERT clase: FALLA '||sqlerrm||E'\n'; end;
  reset role;

  raise exception E'REPORTE RLS (revertido):\n%', r;
end $$;
