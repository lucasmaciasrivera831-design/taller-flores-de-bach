"use server";

import { revalidatePath } from "next/cache";
import { ESTADOS, type EstadoDb } from "@/lib/inscripciones";
import { requerirAdmin } from "@/lib/sesion";

export async function cambiarEstado(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id"));
  const estado = String(formData.get("estado")) as EstadoDb;
  if (!ESTADOS.includes(estado)) return;
  await supabase.from("inscripciones").update({ estado }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function marcarCuota(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id"));
  const numero = Number(formData.get("numero"));
  const pagada = formData.get("pagada") === "true";
  if (!Number.isInteger(numero)) return;
  await supabase.from("cuotas").update({ pagada }).eq("inscripcion_id", id).eq("numero", numero);
  revalidatePath("/admin", "layout");
}

export async function guardarNotas(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id"));
  const notas = String(formData.get("notas") ?? "").trim().slice(0, 1000);
  await supabase.from("inscripciones").update({ notas: notas || null }).eq("id", id);
  revalidatePath("/admin", "layout");
}
