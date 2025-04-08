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
    copyPublicDir: true,
    // 이미지 최적화 설정
    assetsInlineLimit: 10000, // 10KB 이하 파일은 인라인 처리 (base64)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
        // 에셋 네이밍 패턴 설정
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '/src/image': '/image'
    }
  },
  base: './' // GitHub Pages 배포를 위한 상대 경로 설정
});
