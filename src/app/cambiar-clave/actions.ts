"use server";

import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export type EstadoClave = { error?: string };

export async function cambiarClave(_anterior: EstadoClave, formData: FormData): Promise<EstadoClave> {
  const nueva = String(formData.get("nueva") ?? "");
  const repetida = String(formData.get("repetida") ?? "");
  if (nueva.length < 8) return { error: "Tiene que tener al menos 8 caracteres." };
  if (nueva !== repetida) return { error: "Las dos contraseñas no coinciden." };

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.auth.updateUser({ password: nueva });
  if (error) return { error: "No se pudo guardar. Probá con otra contraseña más larga." };

  // `.select()` devuelve las filas tocadas: si no se tocó ninguna, no se avisa "listo" en falso.
  const { data: filas, error: errorPerfil } = await supabase
    .from("perfiles")
    .update({ debe_cambiar_clave: false })
    .eq("user_id", user.id)
    .select("user_id");
  if (errorPerfil || !filas?.length) {
    return { error: "Tu contraseña se guardó, pero no pudimos terminar el ingreso. Avisale a Victoria." };
  }
  redirect("/aula");
}
