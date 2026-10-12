import { describe, expect, it } from "vitest";
import {
  PLANES,
  SENA,
  calcularCuotas,
  formatoARS,
  obtenerPlan,
  saldo,
  total,
} from "./planes";

describe("seña", () => {
  it("es el 20% del monto inicial de 300.000, igual para todos los planes", () => {
    expect(SENA).toBe(60_000);
  });
});

describe("totales", () => {
  it("coincide con lo que definió la docente", () => {
    expect(total(obtenerPlan("unico"))).toBe(300_000);
    expect(total(obtenerPlan("dos-pagos"))).toBe(340_000);
    expect(total(obtenerPlan("por-encuentro"))).toBe(400_000);
  });

  it("el saldo es el total menos la seña", () => {
    expect(saldo(obtenerPlan("unico"))).toBe(240_000);
    expect(saldo(obtenerPlan("dos-pagos"))).toBe(280_000);
    expect(saldo(obtenerPlan("por-encuentro"))).toBe(340_000);
  });
});

describe("calcularCuotas (la seña se descuenta de las primeras cuotas)", () => {
  it("pago único", () => {
    expect(calcularCuotas(obtenerPlan("unico"))).toEqual([240_000]);
  });
  it("dos pagos", () => {
    expect(calcularCuotas(obtenerPlan("dos-pagos"))).toEqual([110_000, 170_000]);
  });
  it("por encuentro", () => {
    expect(calcularCuotas(obtenerPlan("por-encuentro"))).toEqual([
      20_000, 80_000, 80_000, 80_000, 80_000,
    ]);
  });
  it("la suma de las cuotas siempre es el saldo", () => {
    for (const plan of PLANES) {
      const suma = calcularCuotas(plan).reduce((a, b) => a + b, 0);
      expect(suma).toBe(saldo(plan));
    }
  });
  it("si la seña supera a la primera cuota, sigue descontando de la siguiente", () => {
    const plan = { ...obtenerPlan("por-encuentro"), montoCuota: 25_000 };
    expect(calcularCuotas(plan)).toEqual([0, 0, 15_000, 25_000, 25_000]);
  });
});

describe("obtenerPlan", () => {
  it("rechaza un plan que no existe", () => {
    expect(() => obtenerPlan("inventado")).toThrow();
  });
});

describe("formatoARS", () => {
  it("usa punto como separador de miles", () => {
    expect(formatoARS(300_000)).toBe("$300.000");
    expect(formatoARS(20_000)).toBe("$20.000");
    expect(formatoARS(0)).toBe("$0");
    expect(formatoARS(1_234_567)).toBe("$1.234.567");
  });
});
