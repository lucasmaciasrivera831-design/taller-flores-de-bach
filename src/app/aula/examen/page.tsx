import type { Metadata } from "next";
import { Boton, Etiqueta, Tarjeta } from "@/components/ui";
import { ENCUENTROS, fechaLarga } from "@/lib/encuentros";
import estilos from "../aula.module.css";

export const metadata: Metadata = { title: "Examen final" };

export default function Examen() {
  const ultimo = ENCUENTROS[ENCUENTROS.length - 1];
  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Examen final</h1>
        <p className={estilos.subtitulo}>
          Se habilita después del último encuentro ({fechaLarga(ultimo.fecha)}).
        </p>
      </div>

      <Tarjeta className={estilos.seccion}>
        <h2>Entrega de tu examen</h2>
        <p>
          <Etiqueta tono="aviso">Todavía no disponible</Etiqueta>
        </p>
        <p>Cuando Victoria publique la consigna, la vas a ver acá y vas a poder subir tu archivo.</p>
        <label htmlFor="archivo">
          <strong>Tu archivo</strong> (PDF, Word o foto, hasta 10 MB)
        </label>
        <input id="archivo" type="file" disabled />
        <Boton disabled aria-disabled="true" completo>
          Entregar el examen
        </Boton>
      </Tarjeta>

      <Tarjeta className={estilos.seccion}>
        <h2>Tu diploma</h2>
        <p>Se habilita cuando tu examen esté aprobado. Podrás descargarlo desde acá.</p>
      </Tarjeta>
    </>
  );
}
