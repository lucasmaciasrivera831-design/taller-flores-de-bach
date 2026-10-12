import Image from "next/image";
import { Logo } from "@/components/Logo";
import { BotonEnlace, Etiqueta, Tarjeta } from "@/components/ui";
import { CURSO, INCLUYE, PREGUNTAS_FRECUENTES, PROGRAMA } from "@/content/curso";
import { ENCUENTROS, fechaLarga } from "@/lib/encuentros";
import { PLANES, SENA, formatoARS } from "@/lib/planes";
import { VISTA_PREVIA } from "@/lib/vista-previa";
import estilos from "./landing.module.css";

export default function Landing() {
  return (
    <>
      <section className={estilos.hero}>
        <div className={`contenedor ${estilos.heroGrid}`}>
          <div className={estilos.heroTexto}>
            <p className={estilos.eyebrow}>Formación online · Inscripciones abiertas</p>
            <h1 className={estilos.titulo}>
              {CURSO.titulo}
              <span className={estilos.pincel}>{CURSO.subtitulo}</span>
            </h1>
            <p className={estilos.bajada}>{CURSO.bajada}</p>
            <ul className={estilos.datos}>
              <li>{CURSO.modalidad}</li>
              <li>{CURSO.horario}</li>
              <li>{CURSO.periodo}</li>
            </ul>
            <div className={estilos.ctas}>
              <BotonEnlace href="/inscripcion" variante="claro">
                Quiero inscribirme
              </BotonEnlace>
              <BotonEnlace href="#programa" variante="bordeClaro">
                Ver el programa
              </BotonEnlace>
            </div>
          </div>
          <div className={estilos.flyer}>
            <Image
              src="/marca/flyer.jpg"
              alt="Flyer de la formación: Terapia floral Sistema Bach, de octubre a diciembre de 2026, con Victoria Salami"
              width={1024}
              height={1280}
              sizes="(min-width: 900px) 380px, 70vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className={estilos.seccion} aria-labelledby="incluye">
        <div className="contenedor">
          <h2 id="incluye" className={estilos.h2}>
            Qué incluye
          </h2>
          <ul className={estilos.incluye}>
            {INCLUYE.map((item) => (
              <li key={item}>
                <span className={estilos.tilde} aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="fechas" className={estilos.seccion} aria-labelledby="fechas-titulo">
        <div className="contenedor">
          <h2 id="fechas-titulo" className={estilos.h2}>
            Los 5 encuentros
          </h2>
          <p className={estilos.intro}>Todos los sábados indicados, de 9:30 a 12:00, por Meet.</p>
          <ol className={estilos.fechas}>
            {ENCUENTROS.map((e) => (
              <li key={e.orden} className={estilos.fecha}>
                <span className={estilos.numero}>{e.orden}</span>
                <span className={estilos.fechaTexto}>{fechaLarga(e.fecha)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="programa" className={estilos.seccion} aria-labelledby="programa-titulo">
        <div className="contenedor">
          <h2 id="programa-titulo" className={estilos.h2}>
            Programa
          </h2>
          <div className={estilos.acordeon}>
            {PROGRAMA.map((p) => (
              <details key={p.orden} className={estilos.detalle} open={p.orden === 1}>
                <summary>
                  <span className={estilos.numeroChico}>{p.orden}</span>
                  {p.titulo}
                </summary>
                <ul>
                  {p.puntos.map((punto) => (
                    <li key={punto}>{punto}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className={estilos.seccion} aria-labelledby="precios-titulo">
        <div className="contenedor">
          <h2 id="precios-titulo" className={estilos.h2}>
            Formas de pago
          </h2>
          <p className={estilos.intro}>
            Elegí la que mejor te quede. Para reservar tu lugar se abona una{" "}
            <strong>seña de inscripción de {formatoARS(SENA)}</strong>, que después se descuenta del
            total.
          </p>
          <div className={estilos.planes}>
            {PLANES.map((plan) => (
              <Tarjeta key={plan.id} as="article" className={estilos.plan}>
                <h3>{plan.nombre}</h3>
                <p className={estilos.precio}>{plan.descripcion}</p>
                <BotonEnlace href={`/inscripcion?plan=${plan.id}`} variante="borde" completo>
                  Elegir este plan
                </BotonEnlace>
              </Tarjeta>
            ))}
          </div>
        </div>
      </section>

      <section className={estilos.seccion} aria-labelledby="docente-titulo">
        <div className={`contenedor ${estilos.docente}`}>
          <Logo alto={140} />
          <div>
            <h2 id="docente-titulo" className={estilos.h2}>
              Quién dicta la formación
            </h2>
            <p>
              La formación está a cargo de <strong>{CURSO.docente}</strong>, de {CURSO.marca}.
            </p>
            {VISTA_PREVIA && <Etiqueta>Texto a completar con tu presentación</Etiqueta>}
          </div>
        </div>
      </section>

      <section className={estilos.seccion} aria-labelledby="faq-titulo">
        <div className="contenedor">
          <h2 id="faq-titulo" className={estilos.h2}>
            Preguntas frecuentes
          </h2>
          <div className={estilos.acordeon}>
            {PREGUNTAS_FRECUENTES.map((f) => (
              <details key={f.pregunta} className={estilos.detalle}>
                <summary>{f.pregunta}</summary>
                <p>{f.respuesta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={estilos.cierre}>
        <div className={`contenedor ${estilos.cierreContenido}`}>
          <h2>Tu lugar te está esperando</h2>
          <p>Los encuentros empiezan el {fechaLarga(ENCUENTROS[0].fecha)}.</p>
          <BotonEnlace href="/inscripcion" variante="claro">
            Quiero inscribirme
          </BotonEnlace>
        </div>
      </section>
    </>
  );
}
