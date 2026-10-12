"use client";

import { useState } from "react";
import { Boton } from "./ui";

/** Copia un texto al portapapeles. Si el navegador no deja, lo avisa en vez de fingir. */
export function BotonCopiar({ texto, etiqueta = "Copiar" }: { texto: string; etiqueta?: string }) {
  const [estado, setEstado] = useState<"inicial" | "copiado" | "error">("inicial");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setEstado("copiado");
    } catch {
      setEstado("error");
    }
    setTimeout(() => setEstado("inicial"), 2500);
  }

  return (
    <Boton variante="borde" chico onClick={copiar} aria-live="polite">
      {estado === "copiado" ? "¡Copiado!" : estado === "error" ? "Copialo a mano" : etiqueta}
    </Boton>
  );
}
