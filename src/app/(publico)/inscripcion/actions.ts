"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { validarInscripcion, type ErroresInscripcion } from "@/lib/inscripcion";

export type EstadoInscripcion = {
  errores?: ErroresInscripcion;
  /** Problema que no es de un campo en particular (duplicado, caída de la base). */
  mensaje?: string;
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

  const { plan, nombre, apellido, email, whatsapp, ciudad, sitioWeb } = resultado.datos;

  // Campo trampa: un bot lo completa, una persona no. Se simula éxito sin guardar.
  if (sitioWeb) redirect(`/inscripcion/gracias?plan=${plan}&nombre=${encodeURIComponent(nombre)}`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !clave) {
    console.error("[inscripcion] Falta configurar Supabase");
    return { valores, mensaje: MENSAJE_FALLA };
  }

  // La clave pública solo puede INSERTAR (RLS): nunca lee inscripciones.
  const supabase = createClient(url, clave, { auth: { persistSession: false } });
  const { error } = await supabase.from("inscripciones").insert({
    nombre,
    apellido,
    email,
    whatsapp,
    ciudad,
    plan_id: plan,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        valores,
        errores: {
          email: "Ya hay una inscripción con ese email. Si querés cambiar algo, escribile a Victoria por WhatsApp.",
        },
      };
    }
    console.error("[inscripcion] No se pudo guardar", error.code, error.message);
    return { valores, mensaje: MENSAJE_FALLA };
  }

  redirect(`/inscripcion/gracias?plan=${plan}&nombre=${encodeURIComponent(nombre)}`);
}

const MENSAJE_FALLA =
  "No pudimos guardar tu inscripción. Tus datos siguen acá: probá de nuevo en un momento o escribile a Victoria por WhatsApp.";
