import Link from "next/link";
import { notFound } from "next/navigation";
import { Reproductor } from "@/components/Reproductor";
import { Boton, BotonEnlace, BotonExterno } from "@/components/ui";
import { PROGRAMA } from "@/content/curso";
import { armarClases, type FilaClase } from "@/lib/clases";
import { fechaLarga } from "@/lib/encuentros";
import { requerirMiembro } from "@/lib/sesion";
import estilos from "../../aula.module.css";

export default async function PaginaClase({ params }: { params: Promise<{ orden: string }> }) {
  const { orden: ordenTexto } = await params;
  const orden = Number(ordenTexto);
  if (!Number.isInteger(orden) || orden < 1 || orden > PROGRAMA.length) notFound();

  const { supabase } = await requerirMiembro();
  const { data: filas } = await supabase
    .from("clases")
    .select("orden,titulo,descripcion,video_url,pdf_path,estado")
    .eq("estado", "publicada");
  const clases = armarClases((filas ?? []) as FilaClase[]);
  const actual = clases.find((c) => c.encuentro.orden === orden);

  // Una clase que no existe o no está publicada se ve igual: no se revela si hay algo detrás.
  if (!actual || !actual.publicada) notFound();

  const clase = { orden, titulo: actual.titulo, fecha: actual.encuentro.fecha, grabacionUrl: actual.videoUrl };
  const puntos = PROGRAMA[orden - 1].puntos;
  const anterior = clases.find((c) => c.encuentro.orden === orden - 1 && c.publicada)?.encuentro;
  const siguiente = clases.find((c) => c.encuentro.orden === orden + 1 && c.publicada)?.encuentro;

  let pdfUrl: string | null = null;
  if (actual.pdfPath) {
    const { data } = await supabase.storage.from("clases-pdf").createSignedUrl(actual.pdfPath, 3600);
    pdfUrl = data?.signedUrl ?? null;
  }

  return (
    <>
      <p className={estilos.migas}>
        <Link href="/aula">← Volver al aula</Link>
      </p>
      <div>
        <h1 className={estilos.titulo}>
          Encuentro {clase.orden}: {clase.titulo}
        </h1>
        <p className={estilos.subtitulo}>
          <span className={estilos.filaFecha}>{fechaLarga(clase.fecha)}</span>
        </p>
      </div>

      <Reproductor url={clase.grabacionUrl} titulo={`Encuentro ${clase.orden}: ${clase.titulo}`} />

      <div className={estilos.acciones}>
        {pdfUrl ? (
          <BotonExterno href={pdfUrl}>Descargar el PDF de la clase</BotonExterno>
        ) : (
          <Boton disabled aria-disabled="true">
            El PDF todavía no está disponible
          </Boton>
        )}
      </div>

      <section className={estilos.seccion} aria-labelledby="temas">
        <h2 id="temas">En esta clase</h2>
        <ul>
          {puntos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <div className={estilos.navClases}>
        {anterior ? (
          <BotonEnlace href={`/aula/clase/${anterior.orden}`} variante="borde">
            ← Clase {anterior.orden}
          </BotonEnlace>
        ) : (
          <span />
        )}
        {siguiente && (
          <BotonEnlace href={`/aula/clase/${siguiente.orden}`} variante="borde">
            Clase {siguiente.orden} →
          </BotonEnlace>
        )}
      </div>
    </>
  );
}
