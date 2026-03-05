import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@shared': resolve(__dirname, '../../shared')
    }
  },
  server: {
    port: 5174,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
