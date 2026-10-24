import { createBrowserClient } from "@supabase/ssr";

/** Cliente para el navegador (subida directa de archivos con la sesión de la docente). */
export function crearClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
