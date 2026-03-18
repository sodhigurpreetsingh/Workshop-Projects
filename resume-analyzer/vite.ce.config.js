import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Build config for the custom-element bundle
export default defineConfig({
  plugins: [vue({ customElement: true })],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/element.js'),
      name: 'ChatbotElement',
      fileName: 'chatbot',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: 'chatbot.[ext]'
      }
    }
  }
})
