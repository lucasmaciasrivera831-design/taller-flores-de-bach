import type { Metadata } from "next";
import { BotonCopiar } from "@/components/BotonCopiar";
import { BotonEnlace, BotonExterno, Tarjeta } from "@/components/ui";
import { COBRO } from "@/content/curso";
import { ENCUENTROS, fechaCorta } from "@/lib/encuentros";
import { IDS_DE_PLAN, SENA, calcularCuotas, formatoARS, obtenerPlan, saldo, type PlanId } from "@/lib/planes";
import { enlaceWhatsApp } from "@/lib/vista-previa";
import estilos from "./gracias.module.css";

export const metadata: Metadata = {
  title: "¡Gracias por inscribirte!",
  robots: { index: false },
};

export default async function Gracias({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; nombre?: string }>;
}) {
  const { plan: planParam, nombre: nombreParam } = await searchParams;
  const planValido = IDS_DE_PLAN.includes(planParam as PlanId);
  const plan = planValido ? obtenerPlan(planParam as string) : null;
  const nombre = (nombreParam ?? "").trim().slice(0, 40);

  const whatsapp = enlaceWhatsApp(
    `Hola Victoria, soy ${nombre || "[mi nombre]"}. Me inscribí a la formación${
      plan ? ` con el plan "${plan.nombre}"` : ""
    } y te envío el comprobante de la seña de ${formatoARS(SENA)}.`,
  );

  return (
    <div className={`contenedor ${estilos.pagina}`}>
      <header className={estilos.cabecera}>
        <span className={estilos.flor} aria-hidden="true">
          ✿
        </span>
        <h1>{nombre ? `¡Gracias, ${nombre}!` : "¡Gracias por inscribirte!"}</h1>
        <p>
          Tu lugar queda reservado <strong>cuando Victoria confirme la seña</strong>. Hacé la
          transferencia y mandale el comprobante.
        </p>
      </header>

      <Tarjeta className={estilos.pago}>
        <h2>1. Transferí la seña</h2>
        <p className={estilos.monto}>{formatoARS(SENA)}</p>
        <dl>
          <div>
            <dt>Alias</dt>
            <dd className={estilos.alias}>{COBRO.alias}</dd>
          </div>
          <div>
            <dt>Titular</dt>
            <dd>{COBRO.titular}</dd>
          </div>
        </dl>
        <BotonCopiar texto={COBRO.alias} etiqueta="Copiar el alias" />
      </Tarjeta>

      <Tarjeta>
        <h2>2. Enviá el comprobante</h2>
        {whatsapp ? (
          <>
            <p>Mandale el comprobante a Victoria por WhatsApp para que confirme tu lugar.</p>
            <BotonExterno href={whatsapp} completo>
              Enviar comprobante por WhatsApp
            </BotonExterno>
          </>
        ) : (
          <p>
            Mandale el comprobante de la transferencia a Victoria por WhatsApp para que confirme tu
            lugar.
          </p>
        )}
      </Tarjeta>

      {plan && (
        <Tarjeta>
          <h2>3. Tu plan: {plan.nombre}</h2>
          <p>
            Después de la seña, te quedan por pagar <strong>{formatoARS(saldo(plan))}</strong>:
          </p>
          <ul className={estilos.cuotas}>
            {calcularCuotas(plan).map((monto, i) => (
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
          <p className={estilos.chico}>Victoria te va a confirmar por WhatsApp las fechas de cada pago.</p>
        </Tarjeta>
      )}

      <BotonEnlace href="/" variante="borde" completo>
        Volver al inicio
      </BotonEnlace>
    </div>
  );
}
