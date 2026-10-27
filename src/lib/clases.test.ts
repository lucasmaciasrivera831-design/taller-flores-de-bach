import { describe, expect, it } from "vitest";
import { armarClases, nombreSeguro, rutaValida } from "./clases";

describe("armarClases", () => {
  it("devuelve los 5 encuentros aunque no haya nada cargado", () => {
    const c = armarClases([]);
    expect(c).toHaveLength(5);
    expect(c.every((x) => !x.publicada && x.videoUrl === null)).toBe(true);
  });
  it("expone la segunda parte de la grabación solo cuando existe", () => {
    const c = armarClases([
      { orden: 1, titulo: "A", descripcion: null, video_url: "https://a.b/1", video_url_2: "https://a.b/2", pdf_path: null, estado: "publicada" },
      { orden: 2, titulo: "B", descripcion: null, video_url: "https://a.b/3", pdf_path: null, estado: "publicada" },
    ]);
    expect(c[0].videoUrl2).toBe("https://a.b/2");
    expect(c[1].videoUrl2).toBeNull();
    expect(c[2].videoUrl2).toBeNull();
  });
  it("usa lo cargado por la docente", () => {
    const c = armarClases([
      { orden: 1, titulo: "Mi título", descripcion: null, video_url: "https://x.y", pdf_path: "clase-1/1-a.pdf", estado: "publicada" },
    ]);
    expect(c[0]).toMatchObject({ titulo: "Mi título", publicada: true, videoUrl: "https://x.y" });
    expect(c[1].publicada).toBe(false);
  });
});

describe("nombreSeguro", () => {
  it("saca tildes, espacios y símbolos", () => {
    expect(nombreSeguro("Clase 1 – Introducción (final).pdf")).toBe("clase-1-introduccion-final-.pdf");
  });
  it("nunca devuelve vacío", () => {
    expect(nombreSeguro("???")).toBe("archivo");
  });
});

describe("rutaValida", () => {
  it("acepta rutas del panel", () => {
    expect(rutaValida("clase-1/1729800000-guia.pdf", ["clase-1", "clase-2"])).toBe(true);
  });
  it("rechaza carpetas ajenas o intentos de salir", () => {
    expect(rutaValida("otra/1-a.pdf", ["clase-1"])).toBe(false);
    expect(rutaValida("clase-1/../x/1-a.pdf", ["clase-1"])).toBe(false);
    expect(rutaValida("clase-1/a.pdf", ["clase-1"])).toBe(false);
  });
});
