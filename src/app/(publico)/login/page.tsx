import type { Metadata } from "next";
import { FormularioLogin } from "./FormularioLogin";
import estilos from "./login.module.css";

export const metadata: Metadata = { title: "Ingresar", robots: { index: false } };

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ siguiente?: string; error?: string }>;
}) {
  const { siguiente = "", error } = await searchParams;
  return (
    <div className={`contenedor ${estilos.pagina}`}>
      <h1>Ingresar</h1>
      {error === "permiso" && (
        <p className={estilos.error} role="alert">
          Esa cuenta no tiene acceso a esta sección.
        </p>
      )}
      <FormularioLogin siguiente={siguiente} />
    </div>
  );
}
