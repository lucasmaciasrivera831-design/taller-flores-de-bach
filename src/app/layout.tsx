import type { Metadata, Viewport } from "next";
import { Caveat_Brush, Nunito_Sans, Outfit } from "next/font/google";
import "./globals.css";

const titulo = Outfit({ subsets: ["latin"], variable: "--fuente-titulo", display: "swap" });
const cuerpo = Nunito_Sans({ subsets: ["latin"], variable: "--fuente-cuerpo", display: "swap" });
const pincel = Caveat_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--fuente-pincel",
  display: "swap",
});

const sitio = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(sitio),
  title: {
    default: "Terapia floral Sistema Bach · Flor de Luz",
    template: "%s · Flor de Luz",
  },
  description:
    "Formación online en Terapia Floral Sistema Bach con Victoria Salami. 5 encuentros en vivo por Meet, de octubre a diciembre de 2026.",
  openGraph: {
    title: "Terapia floral Sistema Bach · Formación online",
    description: "5 encuentros en vivo por Meet. Sábados de 9:30 a 12:00. Inscripciones abiertas.",
    images: [{ url: "/marca/flyer.jpg", width: 1024, height: 1280 }],
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#5a3a69",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${titulo.variable} ${cuerpo.variable} ${pincel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
