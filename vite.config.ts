import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: [
      '.replit.dev',
      '.repl.co'
    ],
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
          // Separate card assets into their own chunks
          'cards-aufgabe': [
            './src/assets/cards/Aufgabe-01.svg',
            './src/assets/cards/Aufgabe-02.svg',
            './src/assets/cards/Aufgabe-03.svg',
          ],
          'cards-duell': [
            './src/assets/cards/Duell-01.svg',
            './src/assets/cards/Duell-02.svg',
          ],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
}));
