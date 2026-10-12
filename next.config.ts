import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modelo de caché clásico: la mayoría de las pantallas dependen de la sesión
  // del usuario, así que no conviene el modelo de Cache Components.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
