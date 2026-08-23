import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // El contenedor de producción copia solo lo que el build declara necesario.
  output: "standalone",
  // Pulse vive dentro del repositorio del sitio de BECOME, que tiene su propio
  // package-lock.json. Sin esto Next elige la raíz del repositorio como raíz del
  // proyecto y el paquete `standalone` sale con medio sitio web dentro.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  reactStrictMode: true,
};

export default nextConfig;
