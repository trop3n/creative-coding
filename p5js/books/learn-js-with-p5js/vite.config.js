import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5176,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
