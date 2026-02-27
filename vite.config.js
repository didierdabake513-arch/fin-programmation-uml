import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuration de Vite, le bundler et lanceur de développement.
 * 
 * - Définit le plugin React pour gérer le JSX/TSX
 * - Configure le serveur local pour qu'il s'exécute sur le port 3000
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
