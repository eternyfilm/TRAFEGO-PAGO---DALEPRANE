import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run previa` gera previa/index.html: o site inteiro num arquivo só, com
// roteamento por # (abre sem servidor, dá pra mandar pra aprovação).
export default defineConfig(({ mode }) => ({
  plugins: mode === 'previa' ? [react(), viteSingleFile()] : [react()],
  server: {
    host: true,
    port: 5174,
  },
  build: mode === 'previa' ? { outDir: 'previa', assetsInlineLimit: 100_000_000 } : {},
}))
