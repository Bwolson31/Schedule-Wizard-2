import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx$/, 
    exclude: /node_modules/
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/graphql/, ''),
      },
    },
  },
  optimizeDeps: {
    include: ['@stripe/react-stripe-js']
  },
  build: {
    rollupOptions: {
      external: ['@stripe/react-stripe-js']
    }
  }
});
