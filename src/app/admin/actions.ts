"use server";

import { revalidatePath } from "next/cache";
import { ESTADOS, type EstadoDb } from "@/lib/inscripciones";
import { requerirAdmin } from "@/lib/sesion";
import { randomInt } from "node:crypto";
import { headers } from "next/headers";
import { ENCUENTROS } from "@/lib/encuentros";
import { rutaValida } from "@/lib/clases";
import { interpretarGrabacion } from "@/lib/grabacion";
import { crearClienteAdmin } from "@/lib/supabase/admin";

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

// ───────────── Clases, Meet y biblioteca ─────────────


export type Resultado = { ok: boolean; mensaje: string };

export type DatosClase = {
  orden: number;
  titulo: string;
  videoUrl: string;
  /** Ruta ya subida a Storage; `undefined` = no tocar el PDF actual; `null` = quitarlo. */
  pdfPath: string | null | undefined;
  publicada: boolean;
};

const CATEGORIAS_ESCRIBIBLES = ["cuestionario", "grafico", "archivos"] as const;

export async function guardarClase(d: DatosClase): Promise<Resultado> {
  const { supabase } = await requerirAdmin();
  if (!ENCUENTROS.some((e) => e.orden === d.orden)) return { ok: false, mensaje: "Encuentro inexistente." };

  const titulo = d.titulo.trim().slice(0, 120);
  if (!titulo) return { ok: false, mensaje: "Poné un título." };

  const video = d.videoUrl.trim();
  if (video && interpretarGrabacion(video).tipo === "vacia") {
    return { ok: false, mensaje: "El link de la grabación tiene que empezar con https://" };
  }
  if (d.publicada && !video) {
    return { ok: false, mensaje: "Para publicar la clase falta el link de la grabación." };
  }
  if (typeof d.pdfPath === "string" && !rutaValida(d.pdfPath, [`clase-${d.orden}`])) {
    return { ok: false, mensaje: "El PDF no se subió bien. Probá de nuevo." };
  }

  const { data: actual } = await supabase.from("clases").select("pdf_path").eq("orden", d.orden).maybeSingle();

  const fila: Record<string, unknown> = {
    orden: d.orden,
    titulo,
    video_url: video || null,
    estado: d.publicada ? "publicada" : "borrador",
  };
  if (d.pdfPath !== undefined) fila.pdf_path = d.pdfPath;

  const { error } = await supabase.from("clases").upsert(fila, { onConflict: "orden" });
  if (error) return { ok: false, mensaje: "No se pudo guardar. Probá de nuevo." };

  // Si se reemplazó el PDF, el anterior se borra para no dejar archivos huérfanos.
  if (d.pdfPath !== undefined && actual?.pdf_path && actual.pdf_path !== d.pdfPath) {
    await supabase.storage.from("clases-pdf").remove([actual.pdf_path]);
  }
  revalidatePath("/admin/clases");
  revalidatePath("/aula", "layout");
  return { ok: true, mensaje: d.publicada ? "Guardada y publicada." : "Guardada como borrador." };
}

export async function guardarMeet(_anterior: Resultado | null, formData: FormData): Promise<Resultado> {
  const { supabase } = await requerirAdmin();
  const url = String(formData.get("meet") ?? "").trim();
  if (url && !/^https:\/\/meet\.google\.com\/[\w-]+/.test(url)) {
    return { ok: false, mensaje: "Tiene que ser un link de Meet: https://meet.google.com/…" };
  }
  const { error } = await supabase.from("ajustes").upsert({ clave: "meet_url", valor: url });
  if (error) return { ok: false, mensaje: "No se pudo guardar." };
  revalidatePath("/aula", "layout");
  return { ok: true, mensaje: url ? "Link guardado: las alumnas ya lo ven en el aula." : "Link quitado." };
}

export async function agregarMaterial(d: {
  categoria: string;
  titulo: string;
  ruta: string;
}): Promise<Resultado> {
  const { supabase } = await requerirAdmin();
  const titulo = d.titulo.trim().slice(0, 120);
  if (!titulo) return { ok: false, mensaje: "Poné un título." };
  if (!(CATEGORIAS_ESCRIBIBLES as readonly string[]).includes(d.categoria)) {
    return { ok: false, mensaje: "Categoría inválida." };
  }
  if (!rutaValida(d.ruta, [d.categoria])) return { ok: false, mensaje: "El archivo no se subió bien." };
  const { error } = await supabase
    .from("material")
    .insert({ categoria: d.categoria, titulo, archivo_path: d.ruta });
  if (error) return { ok: false, mensaje: "No se pudo guardar." };
  revalidatePath("/admin/biblioteca");
  revalidatePath("/aula/biblioteca");
  return { ok: true, mensaje: "Archivo agregado a la biblioteca." };
}

export async function borrarMaterial(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id"));
  const { data } = await supabase.from("material").select("archivo_path").eq("id", id).maybeSingle();
  if (!data) return;
  await supabase.from("material").delete().eq("id", id);
  await supabase.storage.from("biblioteca").remove([data.archivo_path]);
  revalidatePath("/admin/biblioteca");
  revalidatePath("/aula/biblioteca");
}

// ───────────── Acceso de las alumnas (T9) ─────────────

export type ResultadoAcceso = { ok: boolean; mensaje: string; clave?: string; texto?: string };

const ALFABETO = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function claveTemporal(largo = 10): string {
  return Array.from({ length: largo }, () => ALFABETO[randomInt(ALFABETO.length)]).join("");
}

async function mensajeBienvenida(nombre: string, email: string, clave: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const base = host ? `https://${host}` : "";
  return [
    `¡Hola ${nombre}! 🌸 Ya está tu acceso al aula de la formación.`,
    ``,
    `Entrá acá: ${base}/login`,
    `Tu email: ${email}`,
    `Contraseña temporal: ${clave}`,
    ``,
    `La primera vez te va a pedir que elijas una contraseña tuya.`,
  ].join("\n");
}

/** Crea la cuenta de la alumna o, si ya existe, le genera una contraseña temporal nueva. */
export async function crearAcceso(_anterior: ResultadoAcceso | null, formData: FormData): Promise<ResultadoAcceso> {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id"));

  const { data: insc } = await supabase
    .from("inscripciones")
    .select("id,nombre,email,estado")
    .eq("id", id)
    .maybeSingle();
  if (!insc) return { ok: false, mensaje: "No encontré la inscripción." };
  if (insc.estado === "baja") return { ok: false, mensaje: "Está dada de baja: reactivala antes de darle acceso." };

  let admin;
  try {
    admin = crearClienteAdmin();
  } catch {
    return { ok: false, mensaje: "Falta configurar la clave de servidor (SUPABASE_SERVICE_ROLE_KEY)." };
  }

  const clave = claveTemporal();
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("user_id")
    .eq("inscripcion_id", id)
    .maybeSingle();

  if (perfil) {
    const { error } = await admin.auth.admin.updateUserById(perfil.user_id, { password: clave });
    if (error) return { ok: false, mensaje: "No se pudo generar la contraseña nueva." };
    await admin.from("perfiles").update({ debe_cambiar_clave: true }).eq("user_id", perfil.user_id);
  } else {
    const { data: creado, error } = await admin.auth.admin.createUser({
      email: insc.email,
      password: clave,
      email_confirm: true,
    });
    if (error || !creado.user) {
      return { ok: false, mensaje: "No se pudo crear la cuenta (¿ya existe ese email en el sistema?)." };
    }
    const { error: errorPerfil } = await admin
      .from("perfiles")
      .insert({ user_id: creado.user.id, rol: "alumno", inscripcion_id: id, debe_cambiar_clave: true });
    if (errorPerfil) {
      await admin.auth.admin.deleteUser(creado.user.id);
      return { ok: false, mensaje: "No se pudo crear el perfil. No quedó nada a medias, probá de nuevo." };
    }
  }

  revalidatePath(`/admin/inscripciones/${id}`);
  return {
    ok: true,
    mensaje: "Listo. Copiá el mensaje y mandáselo por WhatsApp: la contraseña no se vuelve a mostrar.",
    clave,
    texto: await mensajeBienvenida(insc.nombre, insc.email, clave),
  };
}
