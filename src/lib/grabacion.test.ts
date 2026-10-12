import { describe, expect, it } from "vitest";
import { interpretarGrabacion } from "./grabacion";

describe("interpretarGrabacion", () => {
  it("reconoce los formatos de link de YouTube", () => {
    const id = "dQw4w9WgXcQ";
    for (const url of [
      `https://www.youtube.com/watch?v=${id}`,
      `https://youtu.be/${id}`,
      `https://m.youtube.com/watch?v=${id}&t=10s`,
      `https://www.youtube.com/embed/${id}`,
      `https://www.youtube.com/live/${id}`,
    ]) {
      const r = interpretarGrabacion(url);
      expect(r.tipo).toBe("youtube");
      if (r.tipo === "youtube") {
        expect(r.idVideo).toBe(id);
        expect(r.urlEmbed.startsWith("https://www.youtube-nocookie.com/embed/")).toBe(true);
      }
    }
  });

  it("trata cualquier otro servicio como enlace externo (Fathom, Drive)", () => {
    expect(interpretarGrabacion("https://fathom.video/share/abc123")).toEqual({
      tipo: "enlace",
      url: "https://fathom.video/share/abc123",
    });
  });

  it("rechaza lo que no es un link https válido", () => {
    for (const x of ["", "   ", null, undefined, "no es un link", "http://fathom.video/x", "javascript:alert(1)"]) {
      expect(interpretarGrabacion(x).tipo).toBe("vacia");
    }
  });

  it("no confunde un link parecido a YouTube", () => {
    expect(interpretarGrabacion("https://youtube.com.malicioso.com/watch?v=dQw4w9WgXcQ").tipo).toBe("enlace");
    expect(interpretarGrabacion("https://www.youtube.com/watch?v=corto").tipo).toBe("enlace");
  });
});
