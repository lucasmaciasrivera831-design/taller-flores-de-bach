import { z } from "zod";
import { IDS_DE_PLAN } from "./planes";

const texto = (min: number, max: number, etiqueta: string) =>
  z
    .string({ error: `Completá ${etiqueta}.` })
    .trim()
    .min(min, `Completá ${etiqueta}.`)
    .max(max, `${etiqueta[0].toUpperCase()}${etiqueta.slice(1)} es demasiado largo.`);

export const inscripcionSchema = z.object({
  nombre: texto(2, 60, "tu nombre"),
  apellido: texto(2, 60, "tu apellido"),
  email: z
    .string({ error: "Completá tu email." })
    .trim()
    .toLowerCase()
    .max(120, "El email es demasiado largo.")
    .pipe(z.email("Ese email no parece válido.")),
  whatsapp: z
    .string({ error: "Completá tu WhatsApp." })
    .trim()
    .refine((v) => /^[\d\s+()-]+$/.test(v), "Escribí solo números, con el código de área.")
    .refine((v) => {
      const digitos = v.replace(/\D/g, "").length;
      return digitos >= 8 && digitos <= 15;
    }, "Ese número no parece completo."),
  ciudad: texto(2, 80, "tu ciudad y país"),
  plan: z.enum(IDS_DE_PLAN, { error: "Elegí una forma de pago." }),
  acepto: z.literal("on", { error: "Necesitamos tu conformidad para continuar." }),
  /** Campo trampa para bots: una persona nunca lo ve ni lo completa. */
  sitioWeb: z.string().max(0).optional(),
});

export type DatosInscripcion = z.infer<typeof inscripcionSchema>;
export type ErroresInscripcion = Partial<Record<keyof DatosInscripcion, string>>;

/** Devuelve el primer mensaje de error de cada campo. */
export function validarInscripcion(
  datos: Record<string, unknown>,
): { ok: true; datos: DatosInscripcion } | { ok: false; errores: ErroresInscripcion } {
  const r = inscripcionSchema.safeParse(datos);
  if (r.success) return { ok: true, datos: r.data };
  const errores: ErroresInscripcion = {};
  for (const issue of r.error.issues) {
    const campo = issue.path[0] as keyof DatosInscripcion;
    if (campo && !errores[campo]) errores[campo] = issue.message;
  }
  return { ok: false, errores };
}
