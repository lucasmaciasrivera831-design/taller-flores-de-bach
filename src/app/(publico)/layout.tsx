import { BannerVistaPrevia } from "@/components/BannerVistaPrevia";
import { EncabezadoPublico } from "@/components/EncabezadoPublico";
import { PiePublico } from "@/components/PiePublico";
import { VISTA_PREVIA } from "@/lib/vista-previa";

export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  return (
    <>
      {VISTA_PREVIA && (
        <BannerVistaPrevia texto="el diseño es definitivo, los textos son de ejemplo pero las inscripciones sí se guardan." />
      )}
      <EncabezadoPublico />
      <main>{children}</main>
      <PiePublico />
    </>
  );
}
