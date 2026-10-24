"use client";

import { useState, useTransition } from "react";
import { Boton } from "@/components/ui";
import { nombreSeguro } from "@/lib/clases";
import { crearClienteNavegador } from "@/lib/supabase/navegador";
import { agregarMaterial, type Resultado } from "../actions";
import estilos from "../admin.module.css";

const MAX = 30 * 1024 * 1024;
const TIPOS = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

export function FormularioMaterial() {
  const [r, setR] = useState<Resultado | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [pendiente, empezar] = useTransition();

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = new FormData(form);
    const archivo = datos.get("archivo") as File | null;
    const categoria = String(datos.get("categoria"));
    setR(null);
    if (!archivo || archivo.size === 0) return setR({ ok: false, mensaje: "Elegí un archivo." });
    if (!TIPOS.includes(archivo.type)) return setR({ ok: false, mensaje: "Tiene que ser PDF o imagen (PNG, JPG, WEBP)." });
    if (archivo.size > MAX) return setR({ ok: false, mensaje: "El archivo pesa más de 30 MB." });

    setSubiendo(true);
    const ruta = `${categoria}/${Date.now()}-${nombreSeguro(archivo.name)}`;
    const { error } = await crearClienteNavegador()
      .storage.from("biblioteca")
      .upload(ruta, archivo, { contentType: archivo.type });
    setSubiendo(false);
    if (error) return setR({ ok: false, mensaje: "No se pudo subir el archivo. Probá de nuevo." });

    empezar(async () => {
      const res = await agregarMaterial({ categoria, titulo: String(datos.get("titulo") ?? ""), ruta });
      setR(res);
      if (res.ok) form.reset();
    });
  }

  const ocupado = subiendo || pendiente;
  return (
    <form className={estilos.formulario} onSubmit={enviar}>
      <label>
        Sección
        <select name="categoria" defaultValue="cuestionario">
          <option value="cuestionario">Cuestionario</option>
          <option value="grafico">Gráfico de los 7 grupos emocionales</option>
          <option value="archivos">Archivos</option>
        </select>
      </label>
      <label>
        Título
        <input name="titulo" maxLength={120} required />
      </label>
      <label>
        Archivo (PDF o imagen)
        <input name="archivo" type="file" accept="application/pdf,image/png,image/jpeg,image/webp" required />
      </label>
      <Boton type="submit" disabled={ocupado} aria-busy={ocupado}>
        {subiendo ? "Subiendo…" : pendiente ? "Guardando…" : "Agregar a la biblioteca"}
      </Boton>
      {r && (
        <p role={r.ok ? "status" : "alert"} className={r.ok ? estilos.ok : estilos.error}>
          {r.mensaje}
        </p>
      )}
    </form>
  );
}
