import Link from "next/link";
import { Boton, BotonExterno, Etiqueta } from "@/components/ui";
import { CURSO } from "@/content/curso";
import { CLASES_DEMO } from "@/lib/demo-data";
import { ENCUENTROS, diasHasta, fechaLarga, proximoEncuentro } from "@/lib/encuentros";
import estilos from "./aula.module.css";

// Depende de la hora actual: no se puede generar una sola vez al compilar.
export const dynamic = "force-dynamic";

function textoDias(dias: number): string {
  if (dias <= 0) return "¡Es hoy!";
  if (dias === 1) return "Falta 1 día";
  return `Faltan ${dias} días`;
}

export default function InicioAula() {
  const ahora = new Date();
  const proximo = proximoEncuentro(ahora);
  const clase = proximo ? CLASES_DEMO.find((c) => c.orden === proximo.orden) : undefined;

  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Tu aula</h1>
        <p className={estilos.subtitulo}>{CURSO.nombreCompleto}</p>
      </div>

      {proximo ? (
        <section className={estilos.proximo} aria-labelledby="proximo">
          <h2 id="proximo">Próximo encuentro</h2>
          <p className={estilos.proximoFecha}>{fechaLarga(proximo.fecha)}</p>
          <p className={estilos.proximoHora}>
            {proximo.inicio} a {proximo.fin} · {textoDias(diasHasta(proximo.fecha, ahora))}
          </p>
          {clase?.meetUrl ? (
            <BotonExterno href={clase.meetUrl} variante="claro">
              Entrar a Meet
            </BotonExterno>
          ) : (
            <>
              <Boton variante="claro" disabled aria-disabled="true">
                Entrar a Meet
              </Boton>
              <p>El link se publica acá antes del encuentro.</p>
            </>
          )}
        </section>
      ) : (
        <section className={estilos.proximo}>
          <h2>Formación finalizada</h2>
          <p className={estilos.proximoFecha}>¡Gracias por ser parte!</p>
        </section>
      )}

      <section className={estilos.seccion} aria-labelledby="clases">
        <h2 id="clases">Las clases</h2>
        <ol className={estilos.lista}>
          {ENCUENTROS.map((e) => {
            const c = CLASES_DEMO.find((x) => x.orden === e.orden)!;
            const contenido = (
              <>
                <span className={estilos.numero}>{e.orden}</span>
                <span className={estilos.filaTexto}>
                  <span className={estilos.filaTitulo}>{c.titulo}</span>
                  <span className={estilos.filaFecha}>{fechaLarga(e.fecha)}</span>
                </span>
                {c.publicada ? <Etiqueta tono="exito">Disponible</Etiqueta> : <Etiqueta>Próximamente</Etiqueta>}
              </>
            );
            return (
              <li key={e.orden}>
                {c.publicada ? (
                  <Link href={`/aula/clase/${e.orden}`} className={estilos.fila}>
                    {contenido}
                  </Link>
                ) : (
                  <div className={`${estilos.fila} ${estilos.filaBloqueada}`}>{contenido}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
