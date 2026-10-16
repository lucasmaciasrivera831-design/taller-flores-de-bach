import { celdaCsv, type FilaInscripcion } from "@/lib/inscripciones";
import { obtenerPlan } from "@/lib/planes";
import { requerirAdmin } from "@/lib/sesion";

export async function GET() {
  const { supabase } = await requerirAdmin();
  const { data } = await supabase
    .from("inscripciones")
    .select("*")
    .order("created_at", { ascending: true });
  const filas = (data ?? []) as FilaInscripcion[];

  const encabezado = ["Fecha", "Nombre", "Apellido", "Email", "WhatsApp", "Ciudad", "Plan", "Estado", "Notas"];
  const lineas = filas.map((i) =>
    [i.created_at, i.nombre, i.apellido, i.email, i.whatsapp, i.ciudad, obtenerPlan(i.plan_id).nombre, i.estado, i.notas ?? ""]
      .map(celdaCsv)
      .join(","),
  );
  const csv = "﻿" + [encabezado.map(celdaCsv).join(","), ...lineas].join("\r\n");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="inscripciones.csv"',
      "cache-control": "no-store",
    },
  });
}
