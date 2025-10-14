import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Phone, Lock } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { HelpAndSupport } from '@/components/HelpAndSupport';

export default function Login() {
  const { cliente, login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ CORREÇÃO: Remover redirecionamento duplicado
  // O AuthContext já gerencia o redirecionamento após login bem-sucedido
  // e o ProtectedRoute gerencia o acesso às rotas protegidas
  // if (cliente) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove non-digits from phone
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length !== 13) {
      toast.error('Telefone deve estar no formato: 55 (XX) X XXXX-XXXX');
      return;
    }

    if (password.length < 8) {
      toast.error('Senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await login(cleanPhone, password);
    } catch (err: any) {
      /**
       * BUG FIX - TestSprite TC002
       * Problema: Login com credenciais inválidas não limpava campo de senha
       * Solução: Limpar campo de senha após tentativa falhada para segurança
       * Data: 2025-01-06
       * Validado: sim
       */
      toast.error(err.message);
      setPassword(''); // Limpar senha após erro para segurança
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 13) {
      // Brazilian format with country code: 55 (11) 9 8451-2354
      return digits
        .replace(/^(\d{2})(\d)/, '$1 ($2')
        .replace(/^(\d{2}\s\(\d{2})(\d)/, '$1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return digits;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section - Matching Dashboard Style */}
      <div className="animate-fade-in">
        <div className="flex justify-center mb-6">
          <Logo size="2xl" showText={false} />
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent drop-shadow-sm text-center">
          Entrar
        </h1>
        <p className="text-text-muted mt-2 text-center">
          Entre com suas credenciais para acessar
        </p>
      </div>

      {/* Login Form Card */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-surface p-8 shadow-2 border border-border">
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="55 (11) 9 8451-2354"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="pl-10"
                  required
                  maxLength={19}
                />
              </div>
              <p className="mt-1 text-xs text-text-muted">Formato: 55 (XX) X XXXX-XXXX</p>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full group relative overflow-hidden"
            disabled={loading}
          >
            <span className="relative z-10">{loading ? 'Entrando...' : 'Entrar'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>

          <div className="text-center text-sm">
            <span className="text-text-muted">Não tem uma conta? </span>
            <Link 
              to="/auth/signup" 
              className="font-medium text-brand hover:opacity-80 transition-opacity px-2 py-1 rounded-md inline-block"
            >
              Criar conta
            </Link>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-brand hover:opacity-80 transition-opacity px-2 py-1 rounded-md font-medium"
              onClick={() => toast.info('Entre em contato com o suporte para recuperar sua senha')}
            >
              Esqueci minha senha
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-6">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
      </div>
      <HelpAndSupport mode="floatingAuth" />
    </div>
  );
}