import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import estilos from "./ui.module.css";

type Variante = "primario" | "claro" | "borde" | "bordeClaro";

function clases(variante: Variante, completo?: boolean, chico?: boolean, extra?: string) {
  return [
    estilos.boton,
    estilos[variante],
    completo ? estilos.completo : "",
    chico ? estilos.chico : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

type OpcionesBoton = { variante?: Variante; completo?: boolean; chico?: boolean };

/** Botón que navega dentro del sitio. */
export function BotonEnlace({
  variante = "primario",
  completo,
  chico,
  className,
  ...props
}: OpcionesBoton & ComponentPropsWithoutRef<typeof Link>) {
  return <Link {...props} className={clases(variante, completo, chico, className)} />;
}

/** Botón que abre un link externo en otra pestaña. */
export function BotonExterno({
  variante = "primario",
  completo,
  chico,
  className,
  ...props
}: OpcionesBoton & ComponentPropsWithoutRef<"a">) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={clases(variante, completo, chico, className)}
    />
  );
}

export function Boton({
  variante = "primario",
  completo,
  chico,
  className,
  type = "button",
  ...props
}: OpcionesBoton & ComponentPropsWithoutRef<"button">) {
  return <button type={type} {...props} className={clases(variante, completo, chico, className)} />;
}

export function Tarjeta({
  children,
  className,
  as: Etiqueta = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return <Etiqueta className={[estilos.tarjeta, className].filter(Boolean).join(" ")}>{children}</Etiqueta>;
}

export function Etiqueta({
  children,
  tono = "neutro",
}: {
  children: ReactNode;
  tono?: "neutro" | "exito" | "aviso" | "vino";
}) {
  const tonos = {
    neutro: "",
    exito: estilos.etiquetaExito,
    aviso: estilos.etiquetaAviso,
    vino: estilos.etiquetaVino,
  };
  return <span className={[estilos.etiqueta, tonos[tono]].filter(Boolean).join(" ")}>{children}</span>;
}

export function Aviso({ children }: { children: ReactNode }) {
  return (
    <p className={estilos.aviso} role="note">
      {children}
    </p>
  );
}
