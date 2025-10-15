import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthLayout } from "./components/layout/AuthLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { initPerformanceMonitoring } from "./lib/performance-monitor";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Contas from "./pages/Contas";
import Goals from "./pages/Goals";
import Notifications from "./pages/Notifications";
import Tasks from "./pages/Tasks";
import Agenda from "./pages/Agenda";

const queryClient = new QueryClient();

// Inicializar monitoramento de performance
initPerformanceMonitoring();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SearchProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth/login" element={<AuthLayout><Login /></AuthLayout>} />
                <Route path="/auth/signup" element={<AuthLayout><Signup /></AuthLayout>} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout><Dashboard /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agenda"
                  element={
                    <ProtectedRoute>
                      <AppLayout><Agenda /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contas"
                  element={
                    <ProtectedRoute>
                      <AppLayout><Contas /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/metas"
                  element={
                    <ProtectedRoute>
                      <AppLayout><Goals /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tarefas"
                  element={
                    <ProtectedRoute>
                      <AppLayout><Tasks /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/relatorios"
                  element={
                    <ProtectedRoute>
                      <AppLayout><Reports /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notificacoes"
                  element={
                    <ProtectedRoute>
                      <AppLayout><Notifications /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <AppLayout><Profile /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SearchProvider>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;