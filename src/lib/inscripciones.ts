export type EstadoDb = "pendiente" | "sena_recibida" | "activo" | "baja";

export const ESTADOS: readonly EstadoDb[] = ["pendiente", "sena_recibida", "activo", "baja"];

export const ETIQUETA_ESTADO_DB: Record<EstadoDb, string> = {
  pendiente: "Pendiente de seña",
  sena_recibida: "Seña recibida",
  activo: "Alumna activa",
  baja: "Baja",
};

export const TONO_ESTADO_DB: Record<EstadoDb, "neutro" | "exito" | "aviso" | "vino"> = {
  pendiente: "aviso",
  sena_recibida: "neutro",
  activo: "exito",
  baja: "vino",
};

export type FilaInscripcion = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
  ciudad: string;
  plan_id: string;
  estado: EstadoDb;
  notas: string | null;
  created_at: string;
};

/** Enlace de WhatsApp a partir de un número escrito de cualquier forma. */
export function enlaceWhatsAppAlumna(numero: string, mensaje?: string): string {
  const digitos = numero.replace(/\D/g, "");
  return `https://wa.me/${digitos}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ""}`;
}

/** Escapa un valor para CSV y neutraliza fórmulas de planilla (=, +, -, @). */
export function celdaCsv(valor: string): string {
  const seguro = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
  return `"${seguro.replace(/"/g, '""')}"`;
}
