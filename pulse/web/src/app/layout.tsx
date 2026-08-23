import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BECOME Pulse", template: "%s · BECOME Pulse" },
  description:
    "Reconocimiento entre pares con una capa de IA que convierte cada gracias en una señal de cultura.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
