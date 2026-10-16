import Link from "next/link";
import { Boton, BotonExterno, Etiqueta } from "@/components/ui";
import {
  ESTADOS,
  ETIQUETA_ESTADO_DB,
  TONO_ESTADO_DB,
  enlaceWhatsAppAlumna,
  type EstadoDb,
  type FilaInscripcion,
} from "@/lib/inscripciones";
import { obtenerPlan } from "@/lib/planes";
import { requerirAdmin } from "@/lib/sesion";
import { cambiarEstado } from "./actions";
import estilos from "./admin.module.css";

export const metadata = { title: "Panel · Inscripciones", robots: { index: false } };

export default async function PanelInscripciones({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string }>;
}) {
  const { q = "", estado = "" } = await searchParams;
  const { supabase } = await requerirAdmin();

  const { data, error } = await supabase
    .from("inscripciones")
    .select("id,nombre,apellido,email,whatsapp,ciudad,plan_id,estado,notas,created_at")
    .order("created_at", { ascending: false });
  const todas = (data ?? []) as FilaInscripcion[];

  const buscado = q.trim().toLowerCase();
  const visibles = todas.filter(
    (i) =>
      (!estado || i.estado === estado) &&
      (!buscado || `${i.nombre} ${i.apellido} ${i.email}`.toLowerCase().includes(buscado)),
  );
  const cuenta = (e: EstadoDb) => todas.filter((i) => i.estado === e).length;

  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Inscripciones</h1>
        <p className={estilos.subtitulo}>Las personas que se anotaron a la formación.</p>
      </div>

      {error && <p role="alert">No se pudieron cargar las inscripciones. Probá recargar la página.</p>}

      <div className={estilos.resumen}>
        <div className={estilos.dato}>
          <strong>{todas.length}</strong>
          <span>Inscriptas</span>
        </div>
        <div className={estilos.dato}>
          <strong>{cuenta("pendiente")}</strong>
          <span>Esperando la seña</span>
        </div>
        <div className={estilos.dato}>
          <strong>{cuenta("sena_recibida")}</strong>
          <span>Seña recibida</span>
        </div>
        <div className={estilos.dato}>
          <strong>{cuenta("activo")}</strong>
          <span>Alumnas activas</span>
        </div>
      </div>

      <form className={estilos.busqueda} method="get">
        <input type="search" name="q" defaultValue={q} placeholder="Buscar por nombre o email" aria-label="Buscar" />
        <select name="estado" defaultValue={estado} aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {ETIQUETA_ESTADO_DB[e]}
            </option>
          ))}
        </select>
        <Boton type="submit" variante="borde">
          Filtrar
        </Boton>
      </form>

      <div>
        <a href="/admin/exportar" className={estilos.enlace}>
          <Boton chico variante="borde" tabIndex={-1}>
            Descargar todo en CSV
          </Boton>
        </a>
      </div>

      {visibles.length === 0 ? (
        <p className={estilos.vacio}>
          {todas.length === 0 ? "Todavía no hay inscripciones." : "Ninguna inscripción coincide con la búsqueda."}
        </p>
      ) : (
        <ul className={estilos.lista}>
          {visibles.map((i) => (
            <li key={i.id} className={estilos.tarjeta}>
              <div className={estilos.cabeza}>
                <div>
                  <p className={estilos.nombre}>
                    <Link href={`/admin/inscripciones/${i.id}`} className={estilos.enlace}>
                      {i.nombre} {i.apellido}
                    </Link>
                  </p>
                  <p className={estilos.detalle}>{i.email}</p>
                </div>
                <Etiqueta tono={TONO_ESTADO_DB[i.estado]}>{ETIQUETA_ESTADO_DB[i.estado]}</Etiqueta>
              </div>
              <p className={estilos.detalle}>
                Plan: {obtenerPlan(i.plan_id).nombre} ·{" "}
                {new Date(i.created_at).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}
              </p>
              <div className={estilos.acciones}>
                {i.estado === "pendiente" && (
                  <form action={cambiarEstado}>
                    <input type="hidden" name="id" value={i.id} />
                    <input type="hidden" name="estado" value="sena_recibida" />
                    <Boton chico type="submit">
                      Confirmar seña
                    </Boton>
                  </form>
                )}
                <BotonExterno chico variante="borde" href={enlaceWhatsAppAlumna(i.whatsapp)}>
                  Abrir WhatsApp
                </BotonExterno>
                <Link href={`/admin/inscripciones/${i.id}`} className={estilos.enlace}>
                  Ver detalle
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
