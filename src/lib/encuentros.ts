/**
 * Calendario de la formación. Las horas son de Argentina (UTC-3, sin horario
 * de verano). Vercel corre en UTC, así que nunca se usa la zona del servidor.
 */
const DESFASE_ARGENTINA_MS = 3 * 60 * 60 * 1000;

export type Encuentro = {
  orden: number;
  /** Fecha del encuentro, AAAA-MM-DD. */
  fecha: string;
  inicio: string;
  fin: string;
};

const INICIO = "09:30";
const FIN = "12:00";

export const ENCUENTROS: readonly Encuentro[] = [
  { orden: 1, fecha: "2026-10-24" },
  { orden: 2, fecha: "2026-10-31" },
  { orden: 3, fecha: "2026-11-14" },
  { orden: 4, fecha: "2026-11-28" },
  { orden: 5, fecha: "2026-12-12" },
].map((e) => ({ ...e, inicio: INICIO, fin: FIN }));

/** Momento exacto (UTC) en que termina un encuentro. */
export function finDelEncuentro(e: Encuentro): Date {
  const [h, m] = e.fin.split(":").map(Number);
  const [anio, mes, dia] = e.fecha.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia, h, m) + DESFASE_ARGENTINA_MS);
}

/** Primer encuentro que todavía no terminó, o `null` si ya pasaron todos. */
export function proximoEncuentro(ahora: Date = new Date()): Encuentro | null {
  return ENCUENTROS.find((e) => finDelEncuentro(e) > ahora) ?? null;
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function partes(fecha: string) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const diaSemana = new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay();
  return { anio, mes, dia, diaSemana };
}

/** "sábado 24 de octubre" */
export function fechaLarga(fecha: string): string {
  const { mes, dia, diaSemana } = partes(fecha);
  return `${DIAS[diaSemana]} ${dia} de ${MESES[mes - 1]}`;
}

/** "24/10" */
export function fechaCorta(fecha: string): string {
  const { mes, dia } = partes(fecha);
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}`;
}

/** Días que faltan para el inicio del encuentro (0 = es hoy, sin importar la hora). */
export function diasHasta(fecha: string, ahora: Date = new Date()): number {
  const hoyArg = new Date(ahora.getTime() - DESFASE_ARGENTINA_MS);
  const hoy = Date.UTC(hoyArg.getUTCFullYear(), hoyArg.getUTCMonth(), hoyArg.getUTCDate());
  const { anio, mes, dia } = partes(fecha);
  return Math.round((Date.UTC(anio, mes - 1, dia) - hoy) / 86_400_000);
}
