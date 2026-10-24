import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con la clave `service_role`: se salta las reglas RLS. Usarlo SOLO en
 * acciones de servidor que ya pasaron por `requerirAdmin()` (crear alumnas,
 * resetear contraseñas). Jamás importarlo desde un componente de cliente.
 */
export function crearClienteAdmin() {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!clave) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, clave, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
