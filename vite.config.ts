
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';
  import { nodePolyfills } from 'vite-plugin-node-polyfills';

  export default defineConfig({
    appType: 'spa',
    plugins: [
      react(),
      nodePolyfills(),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/functions/v1': {
          target: 'http://localhost:54321',
          changeOrigin: true,
        },
      },
    },
  });