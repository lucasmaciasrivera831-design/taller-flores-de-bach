import type { Metadata } from "next";
import { CATEGORIAS_MATERIAL } from "@/lib/demo-data";
import estilos from "../aula.module.css";

export const metadata: Metadata = { title: "Biblioteca" };

export default function Biblioteca() {
  return (
    <>
      <div>
        <h1 className={estilos.titulo}>Biblioteca</h1>
        <p className={estilos.subtitulo}>Todo el material de estudio, en un solo lugar.</p>
      </div>

      {CATEGORIAS_MATERIAL.map((categoria) => (
        <section key={categoria.id} className={estilos.seccion} aria-labelledby={categoria.id}>
          <h2 id={categoria.id}>{categoria.titulo}</h2>
          <div className={estilos.vacio}>
            <p>{categoria.vacio}</p>
          </div>
        </section>
      ))}
    </>
  );
}
