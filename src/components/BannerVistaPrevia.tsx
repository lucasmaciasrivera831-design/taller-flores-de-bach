import estilos from "./BannerVistaPrevia.module.css";

export function BannerVistaPrevia({ texto }: { texto: string }) {
  return (
    <div className={estilos.banner} role="status">
      <strong>Vista previa</strong> · {texto}
    </div>
  );
}
