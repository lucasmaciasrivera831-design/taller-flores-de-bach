import { cerrarSesion } from "@/app/(publico)/login/actions";
import { Emblema } from "@/components/Logo";
import { requerirMiembro } from "@/lib/sesion";
import { NavAula } from "./NavAula";
import estilos from "./aula.module.css";

export const metadata = { robots: { index: false } };

export default async function LayoutAula({ children }: { children: React.ReactNode }) {
  const { nombre } = await requerirMiembro();

  return (
    <div className={estilos.marco}>
      <header className={estilos.encabezado}>
        <div className={`contenedor ${estilos.barra}`}>
          <span className={estilos.marca}>
            <Emblema tamano={36} />
            <span>Flor de Luz</span>
          </span>
          <span className={estilos.usuaria}>
            Hola, {nombre}
            <form action={cerrarSesion} style={{ display: "inline", marginLeft: "0.75rem" }}>
              <button type="submit" className={estilos.salir}>
                Salir
              </button>
            </form>
          </span>
        </div>
      </header>
      <div className={`contenedor ${estilos.cuerpo}`}>
        <NavAula />
        <main className={estilos.principal}>{children}</main>
      </div>
    </div>
  );
}
