import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import estilos from "../(publico)/login/login.module.css";
import { FormularioClave } from "./FormularioClave";

export const metadata: Metadata = { title: "Elegí tu contraseña", robots: { index: false } };

export default async function CambiarClave() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className={`contenedor ${estilos.pagina}`}>
      <h1>Elegí tu contraseña</h1>
      <p>Para cuidar tu cuenta, reemplazá la contraseña temporal que te mandó Victoria por una tuya.</p>
      <FormularioClave />
    </main>
  );
}
