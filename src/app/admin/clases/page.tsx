import { notFound } from "next/navigation";
import { Aviso, Boton, Etiqueta } from "@/components/ui";
import { CLASES_DEMO } from "@/lib/demo-data";
import { fechaLarga } from "@/lib/encuentros";
import { VISTA_PREVIA } from "@/lib/vista-previa";
import estilos from "../admin.module.css";

export default function PanelClases() {
  // Maqueta con datos de ejemplo: no existe en producción hasta la tarea T12.
  if (!VISTA_PREVIA) notFound();
  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Clases</h1>
        <p className={estilos.subtitulo}>
          Pegá el link de la grabación, subí el PDF y publicá la clase cuando esté lista.
        </p>
      </div>

      <Aviso>Vista previa: acá se va a poder cargar cada clase. Por ahora los botones no hacen nada.</Aviso>

      <ul className={estilos.lista}>
        {CLASES_DEMO.map((c) => (
          <li key={c.orden} className={estilos.tarjeta}>
            <div className={estilos.cabeza}>
              <div>
                <p className={estilos.nombre}>
                  Encuentro {c.orden}: {c.titulo}
                </p>
                <p className={estilos.detalle}>{fechaLarga(c.fecha)}</p>
              </div>
              <Etiqueta tono={c.publicada ? "exito" : "neutro"}>{c.publicada ? "Publicada" : "Borrador"}</Etiqueta>
            </div>
            <div className={estilos.acciones}>
              <Boton chico variante="borde" disabled>
                Editar
              </Boton>
              <Boton chico disabled>
                {c.publicada ? "Pasar a borrador" : "Publicar"}
              </Boton>
            </div>
          </li>
        ))}
      </ul>

      <form className={estilos.formulario} aria-label="Ejemplo del formulario de una clase">
        <fieldset disabled>
          <label>
            Link de la grabación (Fathom o YouTube)
            <input type="url" placeholder="https://" />
          </label>
          <label>
            Link de Meet del encuentro
            <input type="url" placeholder="https://meet.google.com/…" />
          </label>
          <label>
            PDF de la clase
            <input type="file" accept="application/pdf" />
          </label>
        </fieldset>
      </form>
    </>
  );
}
