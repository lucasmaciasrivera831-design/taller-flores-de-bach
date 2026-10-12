import { describe, expect, it } from "vitest";
import { ENCUENTROS, diasHasta, fechaCorta, fechaLarga, proximoEncuentro } from "./encuentros";

// Argentina es UTC-3: "sábado 12:00 en Argentina" = 15:00 UTC.
const utc = (iso: string) => new Date(iso);

describe("calendario", () => {
  it("tiene 5 encuentros y todos caen en sábado", () => {
    expect(ENCUENTROS).toHaveLength(5);
    for (const e of ENCUENTROS) {
      expect(fechaLarga(e.fecha).startsWith("sábado")).toBe(true);
    }
  });
});

describe("proximoEncuentro", () => {
  it("antes de arrancar, es el primero", () => {
    expect(proximoEncuentro(utc("2026-10-12T15:00:00Z"))?.orden).toBe(1);
  });
  it("durante el encuentro, sigue siendo ese encuentro", () => {
    // Sáb 24/10 a las 10:00 en Argentina = 13:00 UTC
    expect(proximoEncuentro(utc("2026-10-24T13:00:00Z"))?.orden).toBe(1);
  });
  it("pasa al siguiente recién cuando terminó (12:00 Argentina = 15:00 UTC)", () => {
    expect(proximoEncuentro(utc("2026-10-24T14:59:00Z"))?.orden).toBe(1);
    expect(proximoEncuentro(utc("2026-10-24T15:01:00Z"))?.orden).toBe(2);
  });
  it("el sábado a la noche y el domingo ya apuntan al siguiente", () => {
    expect(proximoEncuentro(utc("2026-10-25T02:30:00Z"))?.orden).toBe(2);
    expect(proximoEncuentro(utc("2026-10-25T18:00:00Z"))?.orden).toBe(2);
  });
  it("después del último, no hay próximo", () => {
    expect(proximoEncuentro(utc("2026-12-13T00:00:00Z"))).toBeNull();
  });
});

describe("formato de fechas", () => {
  it("largo y corto", () => {
    expect(fechaLarga("2026-10-24")).toBe("sábado 24 de octubre");
    expect(fechaCorta("2026-12-12")).toBe("12/12");
  });
});

describe("diasHasta", () => {
  it("cuenta con el día de Argentina, no el de UTC", () => {
    // 24/10 a las 23:30 en Argentina ya es 25/10 en UTC; sigue siendo "hoy" para Argentina.
    expect(diasHasta("2026-10-24", utc("2026-10-25T02:30:00Z"))).toBe(0);
    expect(diasHasta("2026-10-24", utc("2026-10-12T15:00:00Z"))).toBe(12);
  });
});
