import type { Metadata } from "next";
import { Aviso } from "@/components/ui";
import { CURSO } from "@/content/curso";
import { IDS_DE_PLAN, type PlanId } from "@/lib/planes";
import { VISTA_PREVIA } from "@/lib/vista-previa";
import { FormularioInscripcion } from "./FormularioInscripcion";
import estilos from "./inscripcion.module.css";

export const metadata: Metadata = {
  title: "Inscripción",
  description: `Inscribite a la ${CURSO.nombreCompleto}.`,
};

export default async function PaginaInscripcion({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const planInicial = IDS_DE_PLAN.includes(plan as PlanId) ? (plan as PlanId) : "unico";

  return (
    <div className={`contenedor ${estilos.pagina}`}>
      <header className={estilos.cabecera}>
        <h1>Inscripción</h1>
        <p>
          {CURSO.nombreCompleto}. Completá tus datos y elegí cómo querés pagar. Te lleva menos de dos
          minutos.
        </p>
      </header>
      {VISTA_PREVIA && (
        <Aviso>
          Vista previa: las inscripciones de prueba se guardan de verdad en la base.
        </Aviso>
      )}
      <FormularioInscripcion planInicial={planInicial} />
    </div>
  );
}
