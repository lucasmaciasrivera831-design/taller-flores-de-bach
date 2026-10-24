import { Boton, Tarjeta } from "@/components/ui";
import { CATEGORIAS_MATERIAL } from "@/lib/demo-data";
import { requerirAdmin } from "@/lib/sesion";
import { borrarMaterial } from "../actions";
import estilos from "../admin.module.css";
import { FormularioMaterial } from "./FormularioMaterial";

export const metadata = { title: "Panel · Biblioteca", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PanelBiblioteca() {
  const { supabase } = await requerirAdmin();
  const { data } = await supabase.from("material").select("id,categoria,titulo").order("created_at");
  const titulos = new Map<string, string>(CATEGORIAS_MATERIAL.map((c) => [c.id, c.titulo]));

  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Biblioteca</h1>
        <p className={estilos.subtitulo}>
          Cuestionario, gráfico de los 7 grupos y otros archivos. Los PDF de cada clase se suben desde “Clases”.
        </p>
      </div>

      <Tarjeta>
        <h2>Agregar un archivo</h2>
        <FormularioMaterial />
      </Tarjeta>

      <Tarjeta>
        <h2>Lo que ya está cargado</h2>
        {(data ?? []).length === 0 ? (
          <p className={estilos.detalle}>Todavía no hay archivos.</p>
        ) : (
          <ul className={estilos.cuotas}>
            {(data ?? []).map((m) => (
              <li key={m.id}>
                <span>
                  <strong>{m.titulo}</strong> · {titulos.get(m.categoria) ?? m.categoria}
                </span>
                <form action={borrarMaterial}>
                  <input type="hidden" name="id" value={m.id} />
                  <Boton chico variante="borde" type="submit">
                    Quitar
                  </Boton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </>
  );
}
