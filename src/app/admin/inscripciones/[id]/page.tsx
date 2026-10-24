import Link from "next/link";
import { notFound } from "next/navigation";
import { Boton, BotonExterno, Etiqueta, Tarjeta } from "@/components/ui";
import {
  ESTADOS,
  ETIQUETA_ESTADO_DB,
  TONO_ESTADO_DB,
  enlaceWhatsAppAlumna,
  type FilaInscripcion,
} from "@/lib/inscripciones";
import { formatoARS, obtenerPlan } from "@/lib/planes";
import { requerirAdmin } from "@/lib/sesion";
import { AccesoAlumna } from "./AccesoAlumna";
import { cambiarEstado, guardarNotas, marcarCuota } from "../../actions";
import estilos from "../../admin.module.css";

export const metadata = { title: "Panel · Inscripción", robots: { index: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function DetalleInscripcion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const { supabase } = await requerirAdmin();

  const { data } = await supabase.from("inscripciones").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const i = data as FilaInscripcion;
  const { data: cuotas } = await supabase
    .from("cuotas")
    .select("numero,monto,pagada")
    .eq("inscripcion_id", id)
    .order("numero");
  const plan = obtenerPlan(i.plan_id);
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("user_id,debe_cambiar_clave")
    .eq("inscripcion_id", id)
    .maybeSingle();

  return (
    <>
      <Link href="/admin" className={estilos.enlace}>
        ← Volver a las inscripciones
      </Link>
      <div className={estilos.cabeza}>
        <div>
          <h1 className={estilos.titulo}>
            {i.nombre} {i.apellido}
          </h1>
          <p className={estilos.subtitulo}>
            {i.email} · {i.whatsapp} · {i.ciudad}
          </p>
          <p className={estilos.detalle}>Plan: {plan.nombre}</p>
        </div>
        <Etiqueta tono={TONO_ESTADO_DB[i.estado]}>{ETIQUETA_ESTADO_DB[i.estado]}</Etiqueta>
      </div>

      <div>
        <BotonExterno variante="borde" href={enlaceWhatsAppAlumna(i.whatsapp)}>
          Abrir WhatsApp
        </BotonExterno>
      </div>

      <Tarjeta>
        <h2>Estado</h2>
        <div className={estilos.acciones}>
          {ESTADOS.filter((e) => e !== i.estado).map((e) => (
            <form key={e} action={cambiarEstado}>
              <input type="hidden" name="id" value={i.id} />
              <input type="hidden" name="estado" value={e} />
              <Boton chico variante="borde" type="submit">
                Pasar a “{ETIQUETA_ESTADO_DB[e]}”
              </Boton>
            </form>
          ))}
        </div>
      </Tarjeta>

      <Tarjeta>
        <h2>Acceso al aula</h2>
        <p className={estilos.detalle}>
          {perfil
            ? perfil.debe_cambiar_clave
              ? "Tiene cuenta, pero todavía no entró a cambiar la contraseña temporal."
              : "Tiene cuenta y ya eligió su contraseña."
            : "Todavía no tiene cuenta. Creala cuando haya pagado la seña."}
        </p>
        <AccesoAlumna id={i.id} tieneCuenta={Boolean(perfil)} />
      </Tarjeta>

      <Tarjeta>
        <h2>Cuotas</h2>
        <ul className={estilos.cuotas}>
          {(cuotas ?? []).map((c) => (
            <li key={c.numero}>
              <span>
                Pago {c.numero}: <strong>{formatoARS(c.monto)}</strong> {c.pagada ? "· pagada" : ""}
              </span>
              <form action={marcarCuota}>
                <input type="hidden" name="id" value={i.id} />
                <input type="hidden" name="numero" value={c.numero} />
                <input type="hidden" name="pagada" value={String(!c.pagada)} />
                <Boton chico variante="borde" type="submit">
                  {c.pagada ? "Desmarcar" : "Marcar como pagada"}
                </Boton>
              </form>
            </li>
          ))}
        </ul>
        <p className={estilos.detalle}>La seña de $60.000 ya está descontada de las primeras cuotas.</p>
      </Tarjeta>

      <Tarjeta>
        <h2>Notas</h2>
        <form action={guardarNotas} className={estilos.busqueda}>
          <input type="hidden" name="id" value={i.id} />
          <textarea name="notas" className={estilos.notas} defaultValue={i.notas ?? ""} maxLength={1000} aria-label="Notas" />
          <Boton chico type="submit">
            Guardar notas
          </Boton>
        </form>
      </Tarjeta>
    </>
  );
}
