import { describe, expect, it } from "vitest";
import { celdaCsv, enlaceWhatsAppAlumna } from "./inscripciones";

describe("enlaceWhatsAppAlumna", () => {
  it("deja solo los dígitos", () => {
    expect(enlaceWhatsAppAlumna("+54 9 342 525-0399")).toBe("https://wa.me/5493425250399");
  });
});

describe("celdaCsv", () => {
  it("escapa comillas", () => expect(celdaCsv('a"b')).toBe('"a""b"'));
  it("neutraliza fórmulas", () => expect(celdaCsv("=1+1")).toBe(`"'=1+1"`));
});
