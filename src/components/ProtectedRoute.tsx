import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { cliente, loading, user, session } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  // ✅ CORREÇÃO: Verificar session/user em vez de cliente para evitar ciclo de redirecionamento
  // O cliente é carregado de forma assíncrona após a sessão ser estabelecida
  if (!session || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
