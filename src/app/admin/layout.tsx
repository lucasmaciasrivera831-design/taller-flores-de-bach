import Link from "next/link";
import { cerrarSesion } from "@/app/(publico)/login/actions";
import { Emblema } from "@/components/Logo";
import { requerirAdmin } from "@/lib/sesion";
import estilos from "./admin.module.css";

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  await requerirAdmin();

  return (
    <div className={estilos.marco}>
      <header className={estilos.encabezado}>
        <div className={`contenedor ${estilos.barra}`}>
          <span className={estilos.marca}>
            <Emblema tamano={36} />
            <span>Panel</span>
          </span>
          <nav className={estilos.nav} aria-label="Panel">
            <Link href="/admin">Inscripciones</Link>
            <Link href="/admin/clases">Clases</Link>
            <Link href="/admin/biblioteca">Biblioteca</Link>
            <Link href="/aula">Aula</Link>
            <form action={cerrarSesion}>
              <button type="submit" className={estilos.salir}>
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className={`contenedor ${estilos.principal}`}>{children}</main>
    </div>
  );
}
