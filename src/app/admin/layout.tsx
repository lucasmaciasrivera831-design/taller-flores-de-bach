import Link from "next/link";
import { notFound } from "next/navigation";
import { BannerVistaPrevia } from "@/components/BannerVistaPrevia";
import { Emblema } from "@/components/Logo";
import { VISTA_PREVIA } from "@/lib/vista-previa";
import estilos from "./admin.module.css";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  // Hasta que exista el login con roles (tarea T4), el panel solo se muestra en vista previa.
  if (!VISTA_PREVIA) notFound();

  return (
    <div className={estilos.marco}>
      <BannerVistaPrevia texto="panel de Victoria con datos de ejemplo; todavía no hay inicio de sesión." />
      <header className={estilos.encabezado}>
        <div className={`contenedor ${estilos.barra}`}>
          <span className={estilos.marca}>
            <Emblema tamano={36} />
            <span>Panel</span>
          </span>
          <nav className={estilos.nav} aria-label="Panel">
            <Link href="/admin">Inscripciones</Link>
            <Link href="/admin/clases">Clases</Link>
          </nav>
        </div>
      </header>
      <main className={`contenedor ${estilos.principal}`}>{children}</main>
    </div>
  );
}
