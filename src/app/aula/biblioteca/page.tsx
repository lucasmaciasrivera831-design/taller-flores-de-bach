import type { Metadata } from "next";
import { BotonExterno } from "@/components/ui";
import { armarClases, type FilaClase } from "@/lib/clases";
import { CATEGORIAS_MATERIAL } from "@/lib/demo-data";
import { fechaLarga } from "@/lib/encuentros";
import { requerirMiembro } from "@/lib/sesion";
import estilos from "../aula.module.css";

export const metadata: Metadata = { title: "Biblioteca" };
export const dynamic = "force-dynamic";

type Item = { clave: string; titulo: string; detalle?: string; url: string | null };

export default async function Biblioteca() {
  const { supabase } = await requerirMiembro();
  const [{ data: filas }, { data: material }] = await Promise.all([
    supabase.from("clases").select("orden,titulo,descripcion,video_url,video_url_2,pdf_path,estado").eq("estado", "publicada"),
    supabase.from("material").select("id,categoria,titulo,archivo_path").order("orden").order("created_at"),
  ]);

  async function firmar(bucket: "clases-pdf" | "biblioteca", ruta: string) {
    const { data } = await supabase.storage.from(bucket).createSignedUrl(ruta, 3600);
    return data?.signedUrl ?? null;
  }

  const porCategoria = new Map<string, Item[]>();
  const clases = armarClases((filas ?? []) as FilaClase[]).filter((c) => c.publicada && c.pdfPath);
  porCategoria.set(
    "clases",
    await Promise.all(
      clases.map(async (c) => ({
        clave: `clase-${c.encuentro.orden}`,
        titulo: `Encuentro ${c.encuentro.orden}: ${c.titulo}`,
        detalle: fechaLarga(c.encuentro.fecha),
        url: await firmar("clases-pdf", c.pdfPath!),
      })),
    ),
  );
  for (const m of material ?? []) {
    const lista = porCategoria.get(m.categoria) ?? [];
    lista.push({ clave: m.id, titulo: m.titulo, url: await firmar("biblioteca", m.archivo_path) });
    porCategoria.set(m.categoria, lista);
  }

  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Biblioteca</h1>
        <p className={estilos.subtitulo}>Todo el material de estudio, en un solo lugar.</p>
      </div>

      {CATEGORIAS_MATERIAL.map((categoria) => {
        const items = porCategoria.get(categoria.id) ?? [];
        return (
          <section key={categoria.id} className={estilos.seccion} aria-labelledby={categoria.id}>
            <h2 id={categoria.id}>{categoria.titulo}</h2>
            {items.length === 0 ? (
              <div className={estilos.vacio}>
                <p>{categoria.vacio}</p>
              </div>
            ) : (
              <ul className={estilos.lista}>
                {items.map((i) => (
                  <li key={i.clave} className={estilos.fila}>
                    <span className={estilos.filaTexto}>
                      <span className={estilos.filaTitulo}>{i.titulo}</span>
                      {i.detalle && <span className={estilos.filaFecha}>{i.detalle}</span>}
                    </span>
                    {i.url ? (
                      <BotonExterno href={i.url} chico variante="borde">
                        Abrir / descargar
                      </BotonExterno>
                    ) : (
                      <span className={estilos.filaFecha}>No disponible</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
}
