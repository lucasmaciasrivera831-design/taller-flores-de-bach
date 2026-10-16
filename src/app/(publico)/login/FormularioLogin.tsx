"use client";

import { useActionState } from "react";
import { Boton } from "@/components/ui";
import { iniciarSesion, type EstadoLogin } from "./actions";
import estilos from "./login.module.css";

const INICIAL: EstadoLogin = {};

export function FormularioLogin({ siguiente }: { siguiente: string }) {
  const [estado, accion, enviando] = useActionState(iniciarSesion, INICIAL);
  return (
    <form action={accion} className={estilos.formulario}>
      <input type="hidden" name="siguiente" value={siguiente} />
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="username"
        defaultValue={estado.email}
        required
      />
      <label htmlFor="clave">Contraseña</label>
      <input id="clave" name="clave" type="password" autoComplete="current-password" required />
      {estado.error && (
        <p className={estilos.error} role="alert">
          {estado.error}
        </p>
      )}
      <Boton type="submit" completo disabled={enviando} aria-busy={enviando}>
        {enviando ? "Entrando…" : "Entrar"}
      </Boton>
    </form>
  );
}
