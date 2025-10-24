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
      // Headers CORS existentes (mantidos)
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      
      // Headers de Segurança HTTP (adicionados)
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '0',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
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
            // React core (react + react-dom + react-router)
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            
            // Supabase
            'supabase': ['@supabase/supabase-js'],
            
            // TanStack Query (separado para melhor cache)
            'tanstack': ['@tanstack/react-query', '@tanstack/react-query-persist-client'],
            
            // UI Components (Radix UI + Shadcn)
            'ui': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
              '@radix-ui/react-popover',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-tooltip',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-label',
              '@radix-ui/react-switch',
              '@radix-ui/react-slot'
            ],
            
            // Charts (apenas quando Reports for carregado)
            'charts': ['recharts'],
            
            // Date utilities (usado em várias páginas)
            'date-utils': ['date-fns', 'date-fns-tz'],
            
            // Icons (usado em toda aplicação)
            'icons': ['lucide-react']
          }
        }
      }
    },
    // Configuração de preview para produção
    preview: {
      host: "0.0.0.0",
      port: 8080,
      cors: true,
      headers: {
        // Headers de Segurança HTTP para produção
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '0',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      }
    }
  };
});