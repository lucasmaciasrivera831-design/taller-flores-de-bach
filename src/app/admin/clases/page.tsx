import { Etiqueta, Tarjeta } from "@/components/ui";
import { armarClases, type FilaClase } from "@/lib/clases";
import { fechaLarga } from "@/lib/encuentros";
import { requerirAdmin } from "@/lib/sesion";
import estilos from "../admin.module.css";
import { FormularioClase } from "./FormularioClase";
import { FormularioMeet } from "./FormularioMeet";

export const metadata = { title: "Panel · Clases", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PanelClases() {
  const { supabase } = await requerirAdmin();
  const [{ data: filas }, { data: ajuste }] = await Promise.all([
    supabase.from("clases").select("orden,titulo,descripcion,video_url,pdf_path,estado"),
    supabase.from("ajustes").select("valor").eq("clave", "meet_url").maybeSingle(),
  ]);
  const clases = armarClases((filas ?? []) as FilaClase[]);

  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Clases</h1>
        <p className={estilos.subtitulo}>
          Pegá el link de la grabación, subí el PDF y marcá “Publicada” cuando esté lista.
        </p>
      </div>

      <Tarjeta>
        <h2>Link de Meet</h2>
        <FormularioMeet actual={ajuste?.valor ?? ""} />
      </Tarjeta>

      {clases.map((c) => (
        <Tarjeta key={c.encuentro.orden}>
          <div className={estilos.cabeza}>
            <div>
              <h2>Encuentro {c.encuentro.orden}</h2>
              <p className={estilos.detalle}>{fechaLarga(c.encuentro.fecha)}</p>
            </div>
            <Etiqueta tono={c.publicada ? "exito" : "neutro"}>{c.publicada ? "Publicada" : "Borrador"}</Etiqueta>
          </div>
          <FormularioClase
            orden={c.encuentro.orden}
            titulo={c.titulo}
            videoUrl={c.videoUrl ?? ""}
            tienePdf={Boolean(c.pdfPath)}
            publicada={c.publicada}
          />
        </Tarjeta>
      ))}
    </>
  );
}
