"use client";

import { useActionState } from "react";
import { Boton } from "@/components/ui";
import estilos from "../(publico)/login/login.module.css";
import { cambiarClave, type EstadoClave } from "./actions";

const INICIAL: EstadoClave = {};

export function FormularioClave() {
  const [estado, accion, enviando] = useActionState(cambiarClave, INICIAL);
  return (
    <form action={accion} className={estilos.formulario}>
      <label htmlFor="nueva">Contraseña nueva</label>
      <input id="nueva" name="nueva" type="password" autoComplete="new-password" minLength={8} required />
      <label htmlFor="repetida">Repetila</label>
      <input id="repetida" name="repetida" type="password" autoComplete="new-password" minLength={8} required />
      {estado.error && (
        <p className={estilos.error} role="alert">
          {estado.error}
        </p>
      )}
      <Boton type="submit" completo disabled={enviando} aria-busy={enviando}>
        {enviando ? "Guardando…" : "Guardar y entrar"}
      </Boton>
    </form>
  );
}
