import Image from "next/image";

/** Logo completo (emblema + nombre). El archivo ya tiene fondo transparente. */
export function Logo({ alto = 56, prioridad = false }: { alto?: number; prioridad?: boolean }) {
  const ancho = Math.round((alto * 300) / 320);
  return (
    <Image
      src="/marca/logo.png"
      alt="Flor de Luz"
      width={ancho}
      height={alto}
      priority={prioridad}
      style={{ width: "auto", height: alto }}
    />
  );
}

export function Emblema({ tamano = 40 }: { tamano?: number }) {
  return <Image src="/marca/emblema.png" alt="" width={tamano} height={tamano} aria-hidden="true" />;
}
