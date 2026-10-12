import Link from "next/link";
import { notFound } from "next/navigation";
import { Reproductor } from "@/components/Reproductor";
import { Boton, BotonEnlace, BotonExterno } from "@/components/ui";
import { PROGRAMA } from "@/content/curso";
import { CLASES_DEMO } from "@/lib/demo-data";
import { fechaLarga } from "@/lib/encuentros";
import estilos from "../../aula.module.css";

export default async function PaginaClase({ params }: { params: Promise<{ orden: string }> }) {
  const { orden: ordenTexto } = await params;
  const orden = Number(ordenTexto);
  const clase = CLASES_DEMO.find((c) => c.orden === orden);

  // Una clase que no existe o no está publicada se ve igual: no se revela si hay algo detrás.
  if (!clase || !clase.publicada) notFound();

  const puntos = PROGRAMA[orden - 1].puntos;
  const anterior = CLASES_DEMO.find((c) => c.orden === orden - 1 && c.publicada);
  const siguiente = CLASES_DEMO.find((c) => c.orden === orden + 1 && c.publicada);

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
        {clase.pdfUrl ? (
          <BotonExterno href={clase.pdfUrl}>Descargar el PDF de la clase</BotonExterno>
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
