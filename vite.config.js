import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, './src/context'),
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      '@layout' : path.resolve(__dirname, './src/layout'),
      '@pages' : path.resolve(__dirname, './src/pages'),
      '@routes' : path.resolve(__dirname, './src/routes'),
      '@assets' : path.resolve(__dirname, './src/assets'),
      '@data' : path.resolve(__dirname, './src/data'),
    }
  }
});
