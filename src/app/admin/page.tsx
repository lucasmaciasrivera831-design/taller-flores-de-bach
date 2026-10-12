import { Boton, Etiqueta } from "@/components/ui";
import { ETIQUETA_ESTADO, INSCRIPCIONES_DEMO, type EstadoInscripcion } from "@/lib/demo-data";
import { obtenerPlan } from "@/lib/planes";
import estilos from "./admin.module.css";

const TONO: Record<EstadoInscripcion, "neutro" | "exito" | "aviso" | "vino"> = {
  pendiente: "aviso",
  sena: "neutro",
  activo: "exito",
  baja: "vino",
};

export default function PanelInscripciones() {
  const cuenta = (e: EstadoInscripcion) => INSCRIPCIONES_DEMO.filter((i) => i.estado === e).length;

  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Inscripciones</h1>
        <p className={estilos.subtitulo}>Las personas que se anotaron a la formación.</p>
      </div>

      <div className={estilos.resumen}>
        <div className={estilos.dato}>
          <strong>{INSCRIPCIONES_DEMO.length}</strong>
          <span>Inscriptas</span>
        </div>
        <div className={estilos.dato}>
          <strong>{cuenta("pendiente")}</strong>
          <span>Esperando la seña</span>
        </div>
        <div className={estilos.dato}>
          <strong>{cuenta("sena")}</strong>
          <span>Seña recibida</span>
        </div>
        <div className={estilos.dato}>
          <strong>{cuenta("activo")}</strong>
          <span>Alumnas activas</span>
        </div>
      </div>

      <ul className={estilos.lista}>
        {INSCRIPCIONES_DEMO.map((i) => (
          <li key={i.id} className={estilos.tarjeta}>
            <div className={estilos.cabeza}>
              <div>
                <p className={estilos.nombre}>{i.nombre}</p>
                <p className={estilos.detalle}>{i.email}</p>
              </div>
              <Etiqueta tono={TONO[i.estado]}>{ETIQUETA_ESTADO[i.estado]}</Etiqueta>
            </div>
            <p className={estilos.detalle}>Plan: {obtenerPlan(i.plan).nombre}</p>
            <div className={estilos.acciones}>
              {i.estado === "pendiente" && (
                <Boton chico disabled>
                  Confirmar seña
                </Boton>
              )}
              {i.estado === "sena" && (
                <Boton chico disabled>
                  Habilitar acceso
                </Boton>
              )}
              <Boton chico variante="borde" disabled>
                Abrir WhatsApp
              </Boton>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
