/**
 * Datos de ejemplo para recorrer el aula y el panel en la vista previa.
 * Se eliminan cuando se conecte la base de datos (tareas T3 a T13).
 */
import { PROGRAMA } from "@/content/curso";
import { ENCUENTROS } from "./encuentros";
import type { PlanId } from "./planes";

export const ALUMNA_DEMO = { nombre: "Camila" } as const;

export type ClaseDemo = {
  orden: number;
  titulo: string;
  fecha: string;
  publicada: boolean;
  /** Link de la grabación (YouTube, Fathom, etc.). */
  grabacionUrl: string | null;
  pdfUrl: string | null;
  meetUrl: string | null;
};

export const CLASES_DEMO: readonly ClaseDemo[] = ENCUENTROS.map((e) => ({
  orden: e.orden,
  titulo: PROGRAMA[e.orden - 1].titulo,
  fecha: e.fecha,
  // Para ver el estado "publicada" con el diseño real, la clase 1 figura publicada.
  publicada: e.orden === 1,
  grabacionUrl: null,
  pdfUrl: null,
  meetUrl: null,
}));

export type CategoriaMaterial = "archivos" | "clases" | "cuestionario" | "grafico";

export const CATEGORIAS_MATERIAL: readonly {
  id: CategoriaMaterial;
  titulo: string;
  vacio: string;
}[] = [
  {
    id: "clases",
    titulo: "PDF de las clases",
    vacio: "Cada PDF aparece acá cuando se publica su clase.",
  },
  {
    id: "cuestionario",
    titulo: "Cuestionario",
    vacio: "El PDF del cuestionario se va a cargar acá.",
  },
  {
    id: "grafico",
    titulo: "Gráfico de los 7 grupos emocionales",
    vacio: "Acá va el gráfico de los 7 grupos emocionales, para el diagnóstico con péndulo.",
  },
  {
    id: "archivos",
    titulo: "Archivos",
    vacio: "Otros archivos de apoyo que Victoria comparta durante la formación.",
  },
];

export type EstadoInscripcion = "pendiente" | "sena" | "activo" | "baja";

export const ETIQUETA_ESTADO: Record<EstadoInscripcion, string> = {
  pendiente: "Pendiente de seña",
  sena: "Seña recibida",
  activo: "Alumna activa",
  baja: "Baja",
};

export type InscripcionDemo = {
  id: number;
  nombre: string;
  email: string;
  plan: PlanId;
  estado: EstadoInscripcion;
  fecha: string;
};

/** Personas inventadas: ninguna corresponde a una inscripción real. */
export const INSCRIPCIONES_DEMO: readonly InscripcionDemo[] = [
  { id: 1, nombre: "Camila Ríos (ejemplo)", email: "camila@ejemplo.com", plan: "dos-pagos", estado: "activo", fecha: "2026-10-12" },
  { id: 2, nombre: "Lucía Fernández (ejemplo)", email: "lucia@ejemplo.com", plan: "unico", estado: "sena", fecha: "2026-10-12" },
  { id: 3, nombre: "Marta Giménez (ejemplo)", email: "marta@ejemplo.com", plan: "por-encuentro", estado: "pendiente", fecha: "2026-10-11" },
  { id: 4, nombre: "Rocío Paz (ejemplo)", email: "rocio@ejemplo.com", plan: "unico", estado: "pendiente", fecha: "2026-10-11" },
  { id: 5, nombre: "Ana Beltrán (ejemplo)", email: "ana@ejemplo.com", plan: "dos-pagos", estado: "baja", fecha: "2026-10-10" },
];
