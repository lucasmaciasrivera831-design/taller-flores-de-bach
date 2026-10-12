"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import estilos from "./aula.module.css";

const SECCIONES = [
  { href: "/aula", etiqueta: "Inicio", icono: "⌂" },
  { href: "/aula/biblioteca", etiqueta: "Biblioteca", icono: "❀" },
  { href: "/aula/examen", etiqueta: "Examen", icono: "✎" },
] as const;

export function NavAula() {
  const ruta = usePathname();
  const activa = (href: string) =>
    href === "/aula" ? ruta === "/aula" || ruta.startsWith("/aula/clase") : ruta.startsWith(href);

  return (
    <nav className={estilos.nav} aria-label="Aula">
      {SECCIONES.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className={estilos.enlace}
          aria-current={activa(s.href) ? "page" : undefined}
        >
          <span className={estilos.icono} aria-hidden="true">
            {s.icono}
          </span>
          {s.etiqueta}
        </Link>
      ))}
    </nav>
  );
}
