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
