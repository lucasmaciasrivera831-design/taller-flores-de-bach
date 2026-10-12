"use server";

import { redirect } from "next/navigation";
import { validarInscripcion, type ErroresInscripcion } from "@/lib/inscripcion";

export type EstadoInscripcion = {
  errores?: ErroresInscripcion;
  /** Lo que la persona ya escribió, para no hacerle volver a tipearlo. */
  valores?: Record<string, string>;
};

function comoTexto(formData: FormData): Record<string, string> {
  const salida: Record<string, string> = {};
  for (const [clave, valor] of formData.entries()) {
    if (typeof valor === "string") salida[clave] = valor;
  }
  return salida;
}

export async function enviarInscripcion(
  _anterior: EstadoInscripcion,
  formData: FormData,
): Promise<EstadoInscripcion> {
  const valores = comoTexto(formData);
  const resultado = validarInscripcion(valores);

  if (!resultado.ok) {
    return { errores: resultado.errores, valores };
  }

  // TODO (tarea T6): guardar la inscripción en Supabase como `pendiente`,
  // evitar duplicados por email y limitar intentos por IP. Hasta que exista la
  // base de datos, la inscripción NO se guarda: por eso el sitio muestra el
  // banner de vista previa.
  const { plan, nombre } = resultado.datos;
  redirect(`/inscripcion/gracias?plan=${plan}&nombre=${encodeURIComponent(nombre)}`);
}
