import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";
  const isProduction = mode === "production";
  
  // Configuração dinâmica baseada no ambiente
  const serverConfig = {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  };

  // Configuração específica para desenvolvimento
  if (isDevelopment) {
    serverConfig.hmr = {
      host: "localhost",
      port: 8080,
      // Permitir acesso externo para TestSprite
      clientPort: process.env.VITE_HMR_CLIENT_PORT ? parseInt(process.env.VITE_HMR_CLIENT_PORT) : undefined
    };
    serverConfig.allowedHosts = ["localhost", "127.0.0.1", "app.meuagente.api.br"];
  }

  // Configuração específica para produção
  if (isProduction) {
    serverConfig.hmr = {
      host: "app.meuagente.api.br",
      port: 8080
    };
    serverConfig.allowedHosts = ["app.meuagente.api.br"];
  }

  return {
    server: serverConfig,
    plugins: [react(), isDevelopment && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Configurações de build otimizadas
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: isDevelopment,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
          }
        }
      }
    },
    // Configuração de preview para produção
    preview: {
      host: "0.0.0.0",
      port: 8080,
      cors: true
    }
  };
});