import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // assets/ se sirve tal cual, sin duplicarlo: /images/..., /icons/..., /logo/...
  publicDir: 'assets',
  server: { host: true, port: 5173 },

  /* El manifiesto dice qué archivo compilado corresponde a cada archivo fuente
     y de qué otros depende. scripts/seo.mjs lo usa para declarar, en la
     cabecera de cada ruta, los trozos de código que esa ruta va a pedir. Sin
     eso el navegador los descubre de uno en uno: primero index.js, y solo al
     terminar de leerlo se entera de que necesita el de la página, y al leer
     ese, del común. Tres viajes en fila donde caben tres en paralelo. */
  build: { manifest: true },
});
