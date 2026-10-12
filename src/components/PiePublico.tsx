import { CURSO } from "@/content/curso";
import { Logo } from "./Logo";
import estilos from "./PiePublico.module.css";

export function PiePublico() {
  return (
    <footer className={estilos.pie}>
      <div className={`contenedor ${estilos.contenido}`}>
        <Logo alto={96} />
        <p className={estilos.texto}>
          {CURSO.nombreCompleto}. Dicta {CURSO.docente}.
        </p>
        <p className={estilos.chico}>© 2026 {CURSO.marca}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
