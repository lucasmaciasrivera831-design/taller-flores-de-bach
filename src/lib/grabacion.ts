/**
 * Las clases se graban con Fathom. Si el link es de YouTube se reproduce dentro
 * de la página; con cualquier otro servicio (Fathom, Drive, Vimeo) se muestra
 * un botón que lo abre en otra pestaña.
 */
export type Grabacion =
  | { tipo: "youtube"; idVideo: string; urlEmbed: string }
  | { tipo: "enlace"; url: string }
  | { tipo: "vacia" };

const ID_YOUTUBE = /^[\w-]{11}$/;

function idDeYoutube(url: URL): string | null {
  const host = url.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const [, tipo, resto] = url.pathname.split("/");
      if (tipo === "embed" || tipo === "live" || tipo === "shorts") id = resto ?? null;
    }
  }
  return id && ID_YOUTUBE.test(id) ? id : null;
}

export function interpretarGrabacion(entrada: string | null | undefined): Grabacion {
  const texto = entrada?.trim();
  if (!texto) return { tipo: "vacia" };
  let url: URL;
  try {
    url = new URL(texto);
  } catch {
    return { tipo: "vacia" };
  }
  if (url.protocol !== "https:") return { tipo: "vacia" };
  const idVideo = idDeYoutube(url);
  if (idVideo) {
    return {
      tipo: "youtube",
      idVideo,
      urlEmbed: `https://www.youtube-nocookie.com/embed/${idVideo}?rel=0&modestbranding=1`,
    };
  }
  return { tipo: "enlace", url: url.toString() };
}
