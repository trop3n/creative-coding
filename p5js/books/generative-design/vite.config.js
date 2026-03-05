import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5177,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
