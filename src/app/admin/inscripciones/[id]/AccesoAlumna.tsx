"use client";

import { useActionState } from "react";
import { BotonCopiar } from "@/components/BotonCopiar";
import { Boton } from "@/components/ui";
import { crearAcceso, type ResultadoAcceso } from "../../actions";
import estilos from "../../admin.module.css";

export function AccesoAlumna({ id, tieneCuenta }: { id: string; tieneCuenta: boolean }) {
  const [r, accion, enviando] = useActionState<ResultadoAcceso | null, FormData>(crearAcceso, null);
  return (
    <div className={estilos.formulario}>
      <form action={accion}>
        <input type="hidden" name="id" value={id} />
        <Boton type="submit" disabled={enviando} aria-busy={enviando} variante={tieneCuenta ? "borde" : "primario"}>
          {enviando ? "Generando…" : tieneCuenta ? "Generar contraseña nueva" : "Crear acceso al aula"}
        </Boton>
      </form>
      {r && (
        <p role={r.ok ? "status" : "alert"} className={r.ok ? estilos.ok : estilos.error}>
          {r.mensaje}
        </p>
      )}
      {r?.texto && (
        <>
          <pre className={estilos.clave}>{r.texto}</pre>
          <BotonCopiar texto={r.texto} etiqueta="Copiar mensaje" />
        </>
      )}
    </div>
  );
}
