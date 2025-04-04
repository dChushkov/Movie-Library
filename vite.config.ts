import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Movie-Library/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});