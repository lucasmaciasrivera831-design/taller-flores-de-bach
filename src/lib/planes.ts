export type PlanId = "unico" | "dos-pagos" | "por-encuentro";

export type Plan = {
  id: PlanId;
  nombre: string;
  cuotas: number;
  montoCuota: number;
  /** Cómo se lee el precio en la web: "2 pagos de $170.000". */
  descripcion: string;
};

/** Precio del plan de pago único. La seña se calcula sobre este monto. */
const PRECIO_INICIAL = 300_000;
export const SENA = PRECIO_INICIAL * 0.2;

export const PLANES: readonly Plan[] = [
  {
    id: "unico",
    nombre: "Pago único",
    cuotas: 1,
    montoCuota: 300_000,
    descripcion: "1 pago de $300.000",
  },
  {
    id: "dos-pagos",
    nombre: "2 pagos",
    cuotas: 2,
    montoCuota: 170_000,
    descripcion: "2 pagos de $170.000",
  },
  {
    id: "por-encuentro",
    nombre: "Pago por encuentro",
    cuotas: 5,
    montoCuota: 80_000,
    descripcion: "5 pagos de $80.000 (uno por encuentro)",
  },
];

export const IDS_DE_PLAN = PLANES.map((p) => p.id) as [PlanId, ...PlanId[]];

export function obtenerPlan(id: string): Plan {
  const plan = PLANES.find((p) => p.id === id);
  if (!plan) throw new Error(`Plan desconocido: ${id}`);
  return plan;
}

export const total = (plan: Plan) => plan.cuotas * plan.montoCuota;
export const saldo = (plan: Plan) => total(plan) - SENA;

/** La seña se descuenta de las primeras cuotas, en orden, hasta agotarse. */
export function calcularCuotas(plan: Plan): number[] {
  let porDescontar = SENA;
  return Array.from({ length: plan.cuotas }, () => {
    const descuento = Math.min(porDescontar, plan.montoCuota);
    porDescontar -= descuento;
    return plan.montoCuota - descuento;
  });
}

export function formatoARS(monto: number): string {
  return `$${String(Math.round(monto)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
