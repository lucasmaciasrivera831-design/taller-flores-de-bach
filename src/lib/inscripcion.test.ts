import { describe, expect, it } from "vitest";
import { validarInscripcion } from "./inscripcion";

const valido = {
  nombre: "Camila",
  apellido: "Ríos",
  email: "  Camila@Ejemplo.com ",
  whatsapp: "+54 9 342 555-1234",
  ciudad: "Santa Fe, Argentina",
  plan: "dos-pagos",
  acepto: "on",
};

describe("validarInscripcion", () => {
  it("acepta datos correctos y normaliza el email", () => {
    const r = validarInscripcion(valido);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.datos.email).toBe("camila@ejemplo.com");
  });

  it("pide cada campo vacío con un mensaje claro", () => {
    const r = validarInscripcion({});
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errores).sort()).toEqual(
        ["acepto", "apellido", "ciudad", "email", "nombre", "plan", "whatsapp"].sort(),
      );
    }
  });

  it("rechaza un email inválido", () => {
    const r = validarInscripcion({ ...valido, email: "camila@" });
    expect(!r.ok && r.errores.email).toBe("Ese email no parece válido.");
  });

  it("rechaza un WhatsApp con letras o incompleto", () => {
    expect(validarInscripcion({ ...valido, whatsapp: "abc123456789" }).ok).toBe(false);
    expect(validarInscripcion({ ...valido, whatsapp: "12345" }).ok).toBe(false);
  });

  it("rechaza un plan inventado", () => {
    expect(validarInscripcion({ ...valido, plan: "gratis" }).ok).toBe(false);
  });

  it("exige la conformidad", () => {
    expect(validarInscripcion({ ...valido, acepto: undefined }).ok).toBe(false);
  });

  it("descarta el envío si el campo trampa tiene algo", () => {
    expect(validarInscripcion({ ...valido, sitioWeb: "http://spam.com" }).ok).toBe(false);
  });
});
