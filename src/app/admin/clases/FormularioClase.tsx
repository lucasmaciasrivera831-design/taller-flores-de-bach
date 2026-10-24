"use client";

import { useState, useTransition } from "react";
import { Boton } from "@/components/ui";
import { nombreSeguro } from "@/lib/clases";
import { crearClienteNavegador } from "@/lib/supabase/navegador";
import { guardarClase, type Resultado } from "../actions";
import estilos from "../admin.module.css";

const MAX_PDF = 30 * 1024 * 1024;

type Props = {
  orden: number;
  titulo: string;
  videoUrl: string;
  tienePdf: boolean;
  publicada: boolean;
};

export function FormularioClase({ orden, titulo, videoUrl, tienePdf, publicada }: Props) {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [pendiente, empezar] = useTransition();
  const [subiendo, setSubiendo] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = new FormData(form);
    const archivo = datos.get("pdf") as File | null;
    let pdfPath: string | null | undefined = datos.get("quitarPdf") ? null : undefined;
    setResultado(null);

    if (archivo && archivo.size > 0) {
      if (archivo.type !== "application/pdf") return setResultado({ ok: false, mensaje: "El archivo tiene que ser un PDF." });
      if (archivo.size > MAX_PDF) return setResultado({ ok: false, mensaje: "El PDF pesa más de 30 MB." });
      setSubiendo(true);
      const ruta = `clase-${orden}/${Date.now()}-${nombreSeguro(archivo.name)}`;
      const { error } = await crearClienteNavegador()
        .storage.from("clases-pdf")
        .upload(ruta, archivo, { contentType: "application/pdf" });
      setSubiendo(false);
      if (error) return setResultado({ ok: false, mensaje: "No se pudo subir el PDF. Revisá la conexión y probá de nuevo." });
      pdfPath = ruta;
    }

    empezar(async () => {
      const r = await guardarClase({
        orden,
        titulo: String(datos.get("titulo") ?? ""),
        videoUrl: String(datos.get("videoUrl") ?? ""),
        pdfPath,
        publicada: datos.get("publicada") === "on",
      });
      setResultado(r);
      if (r.ok) {
        // El texto ya quedó guardado; se limpian solo las opciones de archivo.
        form.querySelectorAll<HTMLInputElement>('input[name="pdf"]').forEach((i) => (i.value = ""));
        form.querySelectorAll<HTMLInputElement>('input[name="quitarPdf"]').forEach((i) => (i.checked = false));
      }
    });
  }

  const ocupado = subiendo || pendiente;
  return (
    <form className={estilos.formulario} onSubmit={enviar}>
      <label>
        Título de la clase
        <input name="titulo" defaultValue={titulo} maxLength={120} required />
      </label>
      <label>
        Link de la grabación (Fathom o YouTube)
        <input name="videoUrl" type="url" inputMode="url" placeholder="https://" defaultValue={videoUrl} />
      </label>
      <label>
        PDF de la clase {tienePdf && "(ya hay uno cargado: si subís otro, lo reemplaza)"}
        <input name="pdf" type="file" accept="application/pdf" />
      </label>
      {tienePdf && (
        <label className={estilos.casilla}>
          <input name="quitarPdf" type="checkbox" /> Quitar el PDF actual
        </label>
      )}
      <label className={estilos.casilla}>
        <input name="publicada" type="checkbox" defaultChecked={publicada} /> Publicada: las alumnas ya la ven en el aula
      </label>
      <Boton type="submit" disabled={ocupado} aria-busy={ocupado}>
        {subiendo ? "Subiendo el PDF…" : pendiente ? "Guardando…" : "Guardar clase"}
      </Boton>
      {resultado && (
        <p role={resultado.ok ? "status" : "alert"} className={resultado.ok ? estilos.ok : estilos.error}>
          {resultado.mensaje}
        </p>
      )}
    </form>
  );
}
