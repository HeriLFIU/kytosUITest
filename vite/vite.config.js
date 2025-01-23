import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';


export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
        input: {
          main: 'src/main.js'
        }
      },
    commonjsOptions: { transformMixedEsModules: true },
    sourcemap: true
  },
  plugins: [vue()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
});