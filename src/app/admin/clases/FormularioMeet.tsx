"use client";

import { useActionState } from "react";
import { Boton } from "@/components/ui";
import { guardarMeet, type Resultado } from "../actions";
import estilos from "../admin.module.css";

export function FormularioMeet({ actual }: { actual: string }) {
  const [r, accion, enviando] = useActionState<Resultado | null, FormData>(guardarMeet, null);
  return (
    <form action={accion} className={estilos.formulario}>
      <label>
        Link de Meet de los encuentros
        <input name="meet" type="url" inputMode="url" placeholder="https://meet.google.com/…" defaultValue={actual} />
      </label>
      <Boton type="submit" disabled={enviando}>
        {enviando ? "Guardando…" : "Guardar link"}
      </Boton>
      {r && (
        <p role={r.ok ? "status" : "alert"} className={r.ok ? estilos.ok : estilos.error}>
          {r.mensaje}
        </p>
      )}
    </form>
  );
}
