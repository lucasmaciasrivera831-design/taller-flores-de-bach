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
  const { error } = await supabase.auth.signInWithPassword({ email, password: clave });
  if (error) return { error: "Email o contraseña incorrectos.", email };

  // Solo rutas internas: evita que el login sirva para redirigir a otro sitio.
  const destino = /^\/(admin|aula)(\/|$)/.test(siguiente) ? siguiente : "/admin";
  redirect(destino);
}

export async function cerrarSesion() {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}
