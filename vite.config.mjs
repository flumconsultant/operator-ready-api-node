import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // assets/ se sirve tal cual, sin duplicarlo: /images/..., /icons/..., /logo/...
  publicDir: 'assets',
  server: { host: true, port: 5173 },
});
