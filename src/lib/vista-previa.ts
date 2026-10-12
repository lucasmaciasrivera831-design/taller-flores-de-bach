/**
 * Mientras no esté conectada la base de datos ni el login, el aula y el panel
 * se pueden recorrer con datos de ejemplo. Se activa con
 * NEXT_PUBLIC_VISTA_PREVIA=1. Sin esa variable, esas rutas no existen.
 */
export const VISTA_PREVIA = process.env.NEXT_PUBLIC_VISTA_PREVIA === "1";

/** Número de WhatsApp de la docente, solo dígitos con código de país. */
export const WHATSAPP_DOCENTE = (process.env.NEXT_PUBLIC_WHATSAPP_DOCENTE ?? "").replace(/\D/g, "");

export function enlaceWhatsApp(mensaje: string): string | null {
  if (!WHATSAPP_DOCENTE) return null;
  return `https://wa.me/${WHATSAPP_DOCENTE}?text=${encodeURIComponent(mensaje)}`;
}
