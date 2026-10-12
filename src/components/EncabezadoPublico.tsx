import Link from "next/link";
import { Emblema } from "./Logo";
import { BotonEnlace } from "./ui";
import estilos from "./EncabezadoPublico.module.css";

export function EncabezadoPublico() {
  return (
    <header className={estilos.encabezado}>
      <div className={`contenedor ${estilos.barra}`}>
        <Link href="/" className={estilos.marca} aria-label="Flor de Luz, inicio">
          <Emblema tamano={40} />
          <span className={estilos.nombre}>Flor de Luz</span>
        </Link>
        <nav className={estilos.acciones} aria-label="Principal">
          <Link href="/aula" className={estilos.ingresar}>
            Ingresar
          </Link>
          <BotonEnlace href="/inscripcion" chico>
            Inscribirme
          </BotonEnlace>
        </nav>
      </div>
    </header>
  );
}
