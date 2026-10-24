"use server";

import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export type EstadoLogin = { error?: string; email?: string };

export async function iniciarSesion(_anterior: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const clave = String(formData.get("clave") ?? "");
  const siguiente = String(formData.get("siguiente") ?? "");
  if (!email || !clave) return { error: "Completá tu email y tu contraseña.", email };

  const supabase = await crearClienteServidor();
  const { data: sesion, error } = await supabase.auth.signInWithPassword({ email, password: clave });
  if (error) return { error: "Email o contraseña incorrectos.", email };

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol,debe_cambiar_clave")
    .eq("user_id", sesion.user.id)
    .maybeSingle();
  if (!perfil) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta todavía no tiene acceso al aula. Escribile a Victoria.", email };
  }
  if (perfil.rol === "alumno" && perfil.debe_cambiar_clave) redirect("/cambiar-clave");

  // Solo rutas internas y acordes al rol: el login no sirve para redirigir a otro sitio.
  const base = perfil.rol === "admin" ? "/admin" : "/aula";
  const permitido = perfil.rol === "admin" ? /^\/(admin|aula)(\/|$)/ : /^\/aula(\/|$)/;
  redirect(permitido.test(siguiente) ? siguiente : base);
}

export async function cerrarSesion() {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}
