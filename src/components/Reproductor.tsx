import { interpretarGrabacion } from "@/lib/grabacion";
import { BotonExterno } from "./ui";
import estilos from "./Reproductor.module.css";

/** Muestra la grabación de una clase según de dónde venga el link. */
export function Reproductor({ url, titulo }: { url?: string | null; titulo: string }) {
  const g = interpretarGrabacion(url);

  if (g.tipo === "youtube") {
    return (
      <div className={estilos.video}>
        <iframe
          src={g.urlEmbed}
          title={titulo}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (g.tipo === "enlace") {
    return (
      <div className={`${estilos.video} ${estilos.centrado}`}>
        <p className={estilos.texto}>La grabación se abre en una pestaña nueva.</p>
        <BotonExterno href={g.url} variante="claro">
          Ver la clase
        </BotonExterno>
      </div>
    );
  }

  return (
    <div className={`${estilos.video} ${estilos.centrado}`}>
      <p className={estilos.texto}>La grabación de esta clase todavía no está disponible.</p>
    </div>
  );
}
