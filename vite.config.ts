import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import dts from 'vite-plugin-dts'
import * as path from 'path'
export default defineConfig({
  plugins: [
    vue(),
    cesium(),
    dts({
      outputDir: 'dist',
      staticImport: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/packages/src/index.ts'),
      name: 'cesium-tools',
      fileName: (format) => `cesium-tools.${format}.js`,
    },
    rollupOptions: {
      external: ['cesium'],
      output: {
        globals: {
          cesium: 'Cesium',
        },
      },
    },
  },
})
