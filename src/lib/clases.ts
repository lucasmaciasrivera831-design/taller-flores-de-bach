import { PROGRAMA } from "@/content/curso";
import { ENCUENTROS, type Encuentro } from "./encuentros";

export type FilaClase = {
  orden: number;
  titulo: string;
  descripcion: string | null;
  video_url: string | null;
  pdf_path: string | null;
  estado: "borrador" | "publicada";
};

export type ClaseDelAula = {
  encuentro: Encuentro;
  titulo: string;
  publicada: boolean;
  videoUrl: string | null;
  pdfPath: string | null;
};

/** Cruza el calendario fijo de encuentros con lo que la docente cargó en la base. */
export function armarClases(filas: readonly FilaClase[]): ClaseDelAula[] {
  return ENCUENTROS.map((encuentro) => {
    const fila = filas.find((f) => f.orden === encuentro.orden);
    return {
      encuentro,
      titulo: fila?.titulo || PROGRAMA[encuentro.orden - 1].titulo,
      publicada: fila?.estado === "publicada",
      videoUrl: fila?.video_url ?? null,
      pdfPath: fila?.pdf_path ?? null,
    };
  });
}

/** Nombre de archivo seguro para guardar en Storage. */
export function nombreSeguro(nombre: string): string {
  const limpio = nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return limpio.slice(-80) || "archivo";
}

/** Rutas de Storage que genera el panel: carpeta/sello-nombre.ext, sin `..` ni barras raras. */
export function rutaValida(ruta: string, carpetas: readonly string[]): boolean {
  return (
    /^[a-z0-9-]+\/[0-9]+-[a-z0-9._-]+$/.test(ruta) &&
    carpetas.includes(ruta.split("/")[0]) &&
    !ruta.includes("..")
  );
}
