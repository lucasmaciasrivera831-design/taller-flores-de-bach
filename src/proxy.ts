import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renueva la sesión y manda a /login a quien entre al aula o al panel sin sesión.
 * El control de rol (admin / alumno) lo hace cada layout con `requerirAdmin`;
 * la seguridad real de los datos la dan las reglas RLS de la base.
 */
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (lista) => {
          for (const { name, value } of lista) request.cookies.set(name, value);
          respuesta = NextResponse.next({ request });
          for (const { name, value, options } of lista) respuesta.cookies.set(name, value, options);
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/login";
    destino.search = `?siguiente=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(destino);
  }
  return respuesta;
}

export const config = {
  matcher: ["/admin/:path*", "/aula/:path*"],
};
