import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // Use absolute paths for SPA routing
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // server: {
  //   port: 3000,
  //   proxy: {
  //     '/api': {
  //       target: 'https://qyvm3uu7ph.us-east-1.awsapprunner.com',
  //       changeOrigin: true,
  //       secure: false,
  //     }
  //   }
  // }
})