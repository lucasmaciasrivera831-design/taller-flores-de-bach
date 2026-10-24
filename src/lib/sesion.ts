import { redirect } from "next/navigation";
import { crearClienteServidor } from "./supabase/servidor";

/** Deja pasar solo a la docente (rol admin). Cualquier otra persona vuelve al login. */
export async function requerirAdmin() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?siguiente=/admin");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("user_id", user.id)
    .maybeSingle();
  if (perfil?.rol !== "admin") redirect("/login?error=permiso");

  return { supabase, user };
}

/**
 * Deja pasar a quien tenga un perfil (alumna habilitada o docente). Una cuenta
 * sin perfil no entra al aula. Si la alumna todavía tiene la contraseña
 * temporal, la manda a cambiarla.
 */
export async function requerirMiembro() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?siguiente=/aula");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol,inscripcion_id,debe_cambiar_clave")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!perfil) redirect("/login?error=permiso");
  if (perfil.rol === "alumno" && perfil.debe_cambiar_clave) redirect("/cambiar-clave");

  let nombre = "Victoria";
  if (perfil.inscripcion_id) {
    const { data } = await supabase
      .from("inscripciones")
      .select("nombre")
      .eq("id", perfil.inscripcion_id)
      .maybeSingle();
    if (data?.nombre) nombre = data.nombre;
  }

  return { supabase, user, rol: perfil.rol as "admin" | "alumno", nombre };
}
