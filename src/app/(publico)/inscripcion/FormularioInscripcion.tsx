"use client";

import { useActionState, useState } from "react";
import { Boton, Tarjeta } from "@/components/ui";
import {
  PLANES,
  SENA,
  calcularCuotas,
  formatoARS,
  obtenerPlan,
  saldo,
  type PlanId,
} from "@/lib/planes";
import { ENCUENTROS, fechaCorta } from "@/lib/encuentros";
import { enviarInscripcion, type EstadoInscripcion } from "./actions";
import estilos from "./inscripcion.module.css";

const ESTADO_INICIAL: EstadoInscripcion = {};

function Campo({
  nombre,
  etiqueta,
  tipo = "text",
  autoComplete,
  inputMode,
  ayuda,
  estado,
}: {
  nombre: string;
  etiqueta: string;
  tipo?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  ayuda?: string;
  estado: EstadoInscripcion;
}) {
  const error = estado.errores?.[nombre as keyof typeof estado.errores];
  const idError = `${nombre}-error`;
  const idAyuda = `${nombre}-ayuda`;
  return (
    <div className={estilos.campo}>
      <label htmlFor={nombre}>{etiqueta}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        autoComplete={autoComplete}
        inputMode={inputMode}
        defaultValue={estado.valores?.[nombre] ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={[ayuda ? idAyuda : "", error ? idError : ""].filter(Boolean).join(" ") || undefined}
        required
      />
      {ayuda && (
        <p id={idAyuda} className={estilos.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className={estilos.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormularioInscripcion({ planInicial }: { planInicial: PlanId }) {
  const [estado, accion, enviando] = useActionState(enviarInscripcion, ESTADO_INICIAL);
  const [planId, setPlanId] = useState<PlanId>(
    (estado.valores?.plan as PlanId | undefined) ?? planInicial,
  );
  const plan = obtenerPlan(planId);
  const cuotas = calcularCuotas(plan);

  return (
    <form action={accion} className={estilos.formulario} noValidate>
      <fieldset className={estilos.grupo}>
        <legend>Tus datos</legend>
        <div className={estilos.doble}>
          <Campo nombre="nombre" etiqueta="Nombre" autoComplete="given-name" estado={estado} />
          <Campo nombre="apellido" etiqueta="Apellido" autoComplete="family-name" estado={estado} />
        </div>
        <Campo
          nombre="email"
          etiqueta="Email"
          tipo="email"
          inputMode="email"
          autoComplete="email"
          ayuda="Lo usamos para identificar tu cuenta en el aula."
          estado={estado}
        />
        <Campo
          nombre="whatsapp"
          etiqueta="WhatsApp"
          tipo="tel"
          inputMode="tel"
          autoComplete="tel"
          ayuda="Con código de área. Ej: +54 9 342 555 1234"
          estado={estado}
        />
        <Campo
          nombre="ciudad"
          etiqueta="Ciudad y país"
          autoComplete="address-level2"
          estado={estado}
        />
      </fieldset>

      <fieldset className={estilos.grupo}>
        <legend>Forma de pago</legend>
        <div className={estilos.planes}>
          {PLANES.map((p) => (
            <label key={p.id} className={estilos.plan} data-activo={p.id === planId}>
              <input
                type="radio"
                name="plan"
                value={p.id}
                checked={p.id === planId}
                onChange={() => setPlanId(p.id)}
                required
              />
              <span className={estilos.planNombre}>{p.nombre}</span>
              <span className={estilos.planPrecio}>{p.descripcion}</span>
            </label>
          ))}
        </div>
        {estado.errores?.plan && (
          <p className={estilos.error} role="alert">
            {estado.errores.plan}
          </p>
        )}

        <Tarjeta className={estilos.resumen}>
          <h3>Así queda tu plan</h3>
          <dl>
            <div>
              <dt>Seña de inscripción (hoy)</dt>
              <dd>{formatoARS(SENA)}</dd>
            </div>
            <div>
              <dt>Se descuenta del total, queda por pagar</dt>
              <dd>{formatoARS(saldo(plan))}</dd>
            </div>
          </dl>
          <ul className={estilos.cuotas} aria-label="Calendario de pagos después de la seña">
            {cuotas.map((monto, i) => (
              <li key={i}>
                <span>
                  {plan.cuotas === 1
                    ? "Pago único"
                    : plan.id === "por-encuentro"
                      ? `Encuentro ${i + 1} (${fechaCorta(ENCUENTROS[i].fecha)})`
                      : `Pago ${i + 1}`}
                </span>
                <strong>{formatoARS(monto)}</strong>
              </li>
            ))}
          </ul>
          <p className={estilos.ayuda}>
            La seña se descuenta de las primeras cuotas. Victoria te confirma por WhatsApp las fechas
            de cada pago.
          </p>
        </Tarjeta>
      </fieldset>

      {/* Campo trampa para bots: se oculta a la vista y a los lectores de pantalla. */}
      <div className={estilos.trampa} aria-hidden="true">
        <label htmlFor="sitioWeb">No completar este campo</label>
        <input id="sitioWeb" name="sitioWeb" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={estilos.conformidad}>
        <label className={estilos.check}>
          <input type="checkbox" name="acepto" required defaultChecked={estado.valores?.acepto === "on"} />
          <span>
            Entiendo que mi lugar queda reservado cuando se confirme la seña, y acepto que se usen mis
            datos para gestionar mi inscripción.
          </span>
        </label>
        {estado.errores?.acepto && (
          <p className={estilos.error} role="alert">
            {estado.errores.acepto}
          </p>
        )}
      </div>

      <Boton type="submit" completo disabled={enviando} aria-busy={enviando}>
        {enviando ? "Enviando…" : "Enviar mi inscripción"}
      </Boton>
    </form>
  );
}
