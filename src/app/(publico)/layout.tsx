import { BannerVistaPrevia } from "@/components/BannerVistaPrevia";
import { EncabezadoPublico } from "@/components/EncabezadoPublico";
import { PiePublico } from "@/components/PiePublico";
import { VISTA_PREVIA } from "@/lib/vista-previa";

export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  return (
    <>
      {VISTA_PREVIA && (
        <BannerVistaPrevia texto="el diseño es definitivo, pero los textos son de ejemplo y todavía no se guardan inscripciones." />
      )}
      <EncabezadoPublico />
      <main>{children}</main>
      <PiePublico />
    </>
  );
}
