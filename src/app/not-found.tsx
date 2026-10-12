import { BotonEnlace } from "@/components/ui";
import { Logo } from "@/components/Logo";

export default function NoEncontrada() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        gap: "1rem",
        padding: "2rem 1rem",
        textAlign: "center",
        alignContent: "center",
        justifyItems: "center",
      }}
    >
      <Logo alto={120} />
      <h1 style={{ fontSize: "2rem", color: "var(--ciruela-profundo)" }}>No encontramos esa página</h1>
      <p style={{ color: "var(--tinta-suave)" }}>Puede que el link esté mal escrito o que ya no exista.</p>
      <BotonEnlace href="/">Volver al inicio</BotonEnlace>
    </main>
  );
}
