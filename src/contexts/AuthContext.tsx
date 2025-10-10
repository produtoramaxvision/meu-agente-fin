import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Cliente {
  phone: string;
  name: string;
  email?: string;
  cpf?: string;
  avatar_url?: string;
  subscription_active: boolean;
  is_active: boolean;
  plan_id?: string;
  created_at?: string;
}

interface AuthContextValue {
  cliente: Cliente | null;
  loading: boolean;
  login: (phone: string, password:string) => Promise<void>;
  signup: (data: { phone: string; name: string; email: string; cpf: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (avatarUrl: string | null) => void;
  updateCliente: (updatedData: Partial<Cliente>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const FAILED_ATTEMPTS_KEY = 'login_failed_attempts';
const BLOCKED_UNTIL_KEY = 'login_blocked_until';
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const phone = sessionStorage.getItem('auth_phone');
        if (phone) {
          const { data, error } = await supabase
            .from('clientes')
            .select('phone, name, email, cpf, avatar_url, subscription_active, is_active, plan_id, created_at')
            .eq('phone', phone)
            .eq('is_active', true)
            .single();

          if (!error && data) {
            // Forçar timestamp na URL do avatar para evitar cache
            let avatarUrl = data.avatar_url;
            if (avatarUrl) {
              const timestamp = new Date().getTime();
              const baseUrl = avatarUrl.split('?t=')[0];
              avatarUrl = `${baseUrl}?t=${timestamp}`;
            }
            
            const clienteData = {
              ...data,
              avatar_url: avatarUrl || undefined
            };
            setCliente(clienteData);
          } else {
            sessionStorage.removeItem('auth_phone');
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const checkRateLimit = (): boolean => {
    const blockedUntil = localStorage.getItem(BLOCKED_UNTIL_KEY);
    if (blockedUntil) {
      const until = parseInt(blockedUntil);
      if (Date.now() < until) {
        const remainingMinutes = Math.ceil((until - Date.now()) / 60000);
        toast.error(`Muitas tentativas. Tente novamente em ${remainingMinutes} minuto(s).`);
        return false;
      } else {
        localStorage.removeItem(BLOCKED_UNTIL_KEY);
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      }
    }
    return true;
  };

  const incrementFailedAttempts = () => {
    const attempts = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0') + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());
    
    if (attempts >= MAX_ATTEMPTS) {
      const blockedUntil = Date.now() + BLOCK_DURATION_MS;
      localStorage.setItem(BLOCKED_UNTIL_KEY, blockedUntil.toString());
      toast.error('Muitas tentativas. Conta bloqueada por 5 minutos.');
    } else {
      toast.error(`Credenciais inválidas. ${MAX_ATTEMPTS - attempts} tentativa(s) restante(s).`);
    }
  };

  const clearFailedAttempts = () => {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(BLOCKED_UNTIL_KEY);
  };

  const login = async (phone: string, password: string) => {
    /**
     * BUG FIX - TestSprite TC002 - CORREÇÃO CRÍTICA DE SEGURANÇA
     * Problema: Login com credenciais inválidas estava sendo aceito - falha crítica de segurança
     * Solução: Validação rigorosa de credenciais e tratamento de erro aprimorado
     * Data: 2025-01-06
     * Status: CORRIGIDO E VALIDADO
     */
    
    if (!checkRateLimit()) {
      throw new Error('Muitas tentativas de login. Tente novamente mais tarde.');
    }

    // Validação rigorosa de entrada
    if (!phone || !password) {
      incrementFailedAttempts();
      throw new Error('Telefone e senha são obrigatórios');
    }

    // Validar formato do telefone (apenas números, 10-15 dígitos)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      incrementFailedAttempts();
      throw new Error('Formato de telefone inválido');
    }

    // Validar senha (mínimo 8 caracteres)
    if (password.length < 8) {
      incrementFailedAttempts();
      throw new Error('Senha deve ter no mínimo 8 caracteres');
    }

    try {
      // Call our auth edge function
      const SUPABASE_URL = "https://teexqwlnfdlcruqbmwuz.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZXhxd2xuZmRsY3J1cWJtd3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjU0NTksImV4cCI6MjA3MzEwMTQ1OX0.q9TO3T7SjEw81XSk5vmyAt4Ls77-BwrXxCHsA82B4i0";
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ phone, password }),
      });

      // VALIDAÇÃO CRÍTICA: Verificar se a resposta é válida
      if (!response.ok) {
        incrementFailedAttempts();
        
        // Tentar obter mensagem de erro específica
        let errorMessage = 'Credenciais inválidas';
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorMessage;
        } catch {
          // Se não conseguir parsear JSON, usar mensagem padrão
        }
        
        // Log de tentativa de login inválida (apenas em desenvolvimento)
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Tentativa de login inválida - Phone: ${phone}, Status: ${response.status}`);
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // VALIDAÇÃO CRÍTICA: Verificar estrutura da resposta
      if (!result || !result.cliente) {
        incrementFailedAttempts();
        throw new Error('Resposta inválida do servidor');
      }

      const clienteData = result.cliente;

      // VALIDAÇÃO CRÍTICA: Verificar dados obrigatórios do cliente
      if (!clienteData.phone || !clienteData.name) {
        incrementFailedAttempts();
        throw new Error('Dados do usuário inválidos');
      }

      // VALIDAÇÃO CRÍTICA: Verificar se o cliente está ativo
      if (!clienteData.is_active) {
        incrementFailedAttempts();
        throw new Error('Conta desativada');
      }

      // Limpar tentativas falhadas apenas após login bem-sucedido
      clearFailedAttempts();
      
      // Processar avatar com timestamp para evitar cache
      if (clienteData.avatar_url) {
        const timestamp = new Date().getTime();
        const baseUrl = clienteData.avatar_url.split('?t=')[0];
        clienteData.avatar_url = `${baseUrl}?t=${timestamp}`;
      }

      // Definir cliente e salvar sessão
      setCliente(clienteData);
      sessionStorage.setItem('auth_phone', phone);
      if (clienteData.avatar_url) {
        sessionStorage.setItem('auth_avatar', clienteData.avatar_url);
      }
      
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err: any) {
      // Log do erro para debugging (apenas em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', err);
      }
      
      // Garantir que sempre lance um erro para credenciais inválidas
      throw new Error(err.message || 'Credenciais inválidas');
    }
  };

  const signup = async ({ phone, name, email, cpf, password }: { phone: string; name: string; email: string; cpf: string; password: string }) => {
    try {
      // Call our auth edge function
      const SUPABASE_URL = "https://teexqwlnfdlcruqbmwuz.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZXhxd2xuZmRsY3J1cWJtd3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjU0NTksImV4cCI6MjA3MzEwMTQ1OX0.q9TO3T7SjEw81XSk5vmyAt4Ls77-BwrXxCHsA82B4i0";
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ phone, name, email, cpf, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar conta');
      }

      setCliente(result.cliente);
      sessionStorage.setItem('auth_phone', phone);
      if (result.cliente.avatar_url) {
        sessionStorage.setItem('auth_avatar', result.cliente.avatar_url);
      }
      
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar conta');
    }
  };

  const logout = async () => {
    setCliente(null);
    sessionStorage.removeItem('auth_phone');
    sessionStorage.removeItem('auth_avatar');
    sessionStorage.removeItem('agendaView');
    toast.info('Sessão encerrada');
    navigate('/auth/login');
  };

  const updateAvatar = (avatarUrl: string | null) => {
    if (cliente) {
      setCliente({ ...cliente, avatar_url: avatarUrl });
      if (avatarUrl) {
        sessionStorage.setItem('auth_avatar', avatarUrl);
      } else {
        sessionStorage.removeItem('auth_avatar');
      }
    }
  };

  const updateCliente = (updatedData: Partial<Cliente>) => {
    if (cliente) {
      const newClienteData = { ...cliente, ...updatedData };
      // Ensure avatar_url has a timestamp for cache busting
      if (newClienteData.avatar_url) {
        const timestamp = new Date().getTime();
        const baseUrl = newClienteData.avatar_url.split('?t=')[0];
        newClienteData.avatar_url = `${baseUrl}?t=${timestamp}`;
      }
      setCliente(newClienteData);
    }
  };

  return (
    <AuthContext.Provider value={{ cliente, loading, login, signup, logout, updateAvatar, updateCliente }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}