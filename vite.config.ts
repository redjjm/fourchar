import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    assetsDir: 'assets',
    copyPublicDir: true
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '/src/image': '/image'
    }
  },
  base: './' // GitHub Pages 배포를 위한 상대 경로 설정
});
