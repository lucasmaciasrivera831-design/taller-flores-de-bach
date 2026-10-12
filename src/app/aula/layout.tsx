import { notFound } from "next/navigation";
import { BannerVistaPrevia } from "@/components/BannerVistaPrevia";
import { Emblema } from "@/components/Logo";
import { ALUMNA_DEMO } from "@/lib/demo-data";
import { VISTA_PREVIA } from "@/lib/vista-previa";
import { NavAula } from "./NavAula";
import estilos from "./aula.module.css";

export default function LayoutAula({ children }: { children: React.ReactNode }) {
  // Hasta que exista el login (tarea T4), el aula solo se muestra en vista previa.
  if (!VISTA_PREVIA) notFound();

  return (
    <div className={estilos.marco}>
      <BannerVistaPrevia texto="aula con datos de ejemplo; todavía no hay inicio de sesión." />
      <header className={estilos.encabezado}>
        <div className={`contenedor ${estilos.barra}`}>
          <span className={estilos.marca}>
            <Emblema tamano={36} />
            <span>Flor de Luz</span>
          </span>
          <span className={estilos.usuaria}>Hola, {ALUMNA_DEMO.nombre}</span>
        </div>
      </header>
      <div className={`contenedor ${estilos.cuerpo}`}>
        <NavAula />
        <main className={estilos.principal}>{children}</main>
      </div>
    </div>
  );
}
