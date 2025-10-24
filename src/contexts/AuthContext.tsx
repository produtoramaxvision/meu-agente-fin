import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Session } from '@supabase/supabase-js';

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
  auth_user_id?: string; // Novo campo para integração
}

interface AuthContextValue {
  cliente: Cliente | null;
  loading: boolean;
  isLoggingOut: boolean; // Novo estado para loading do logout
  user: User | null; // Usuário Supabase Auth
  session: Session | null; // Sessão Supabase Auth
  login: (phone: string, password: string) => Promise<void>;
  signup: (data: { phone: string; name: string; email: string; cpf: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (avatarUrl: string | null) => void;
  updateCliente: (updatedData: Partial<Cliente>) => void;
  checkPhoneExists: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const FAILED_ATTEMPTS_KEY = 'login_failed_attempts';
const BLOCKED_UNTIL_KEY = 'login_blocked_until';
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Função helper para converter telefone para email sintético
const phoneToEmail = (phone: string): string => `${phone}@meuagente.api.br`;

// Função helper para extrair telefone do email sintético
const emailToPhone = (email: string): string => email.replace('@meuagente.api.br', '');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Estado para loading do logout
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // Initialize Supabase Auth session and listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Aguardar um pouco para garantir que o localStorage foi carregado
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            // Carregar dados do cliente de forma assíncrona
            loadClienteFromAuth(initialSession.user).catch(err => {
              console.error('Error loading cliente:', err);
            });
          } else {
            // Se não há sessão, garantir que o estado está limpo
            setCliente(null);
            setUser(null);
            setSession(null);
          }
          
          // ✅ CORREÇÃO: Definir loading como false apenas após processar a sessão
          // Isso evita que o ProtectedRoute redirecione antes da sessão estar pronta
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.id);
      
      // Processar diferentes eventos de autenticação
      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setSession(session);
            setUser(session.user);
            // Carregar dados do cliente de forma assíncrona
            loadClienteFromAuth(session.user).catch(err => {
              console.error('Error loading cliente in listener:', err);
            });
          }
          break;
          
        case 'SIGNED_OUT':
          setSession(null);
          setUser(null);
          setCliente(null);
          // Limpar dados de sessão
          sessionStorage.removeItem('auth_phone');
          sessionStorage.removeItem('auth_avatar');
          break;
          
        case 'USER_UPDATED':
          if (session?.user) {
            setUser(session.user);
            // Carregar dados do cliente de forma assíncrona
            loadClienteFromAuth(session.user).catch(err => {
              console.error('Error loading cliente in listener:', err);
            });
          }
          break;
          
        default:
          // Para outros eventos, apenas atualizar o estado
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            // Carregar dados do cliente de forma assíncrona
            loadClienteFromAuth(session.user).catch(err => {
              console.error('Error loading cliente in listener:', err);
            });
          } else {
            setCliente(null);
          }
      }
      
      setLoading(false);
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load cliente data from authenticated user
  const loadClienteFromAuth = async (authUser: User) => {
    try {
      // Extract phone from user metadata or email
      const phone = authUser.user_metadata?.phone || emailToPhone(authUser.email || '');
      
      if (!phone) {
        console.error('No phone found for user:', authUser.id);
        return;
      }

      const { data, error } = await supabase
        .from('clientes')
        .select('phone, name, email, cpf, avatar_url, subscription_active, is_active, plan_id, created_at, auth_user_id')
        .eq('auth_user_id', authUser.id)
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
        console.error('Error loading cliente:', error);
      }
    } catch (err) {
      console.error('Error loading cliente from auth:', err);
    }
  };

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

  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    try {
      // Validar formato do telefone
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error('Formato de telefone inválido');
      }

      // Chamar função RPC
      const { data, error } = await supabase.rpc('check_phone_exists', {
        phone_number: phone
      });

      if (error) {
        console.error('Error checking phone:', error);
        return false;
      }

      return data === true;
    } catch (err) {
      console.error('Error in checkPhoneExists:', err);
      return false;
    }
  };

  const login = async (phone: string, password: string) => {
    /**
     * MIGRAÇÃO PARA SUPABASE AUTH - FASE 3
     * Substituindo Edge Functions por Supabase Auth nativo
     * Mantendo interface de telefone para compatibilidade
     * Data: 2025-01-16
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
      // Usar função SQL para buscar email por telefone (bypassa RLS)
      const { data: clienteData, error: clienteError } = await supabase
        .rpc('get_user_email_by_phone', { phone_number: phone });

      let loginEmail: string;
      
      if (clienteData && clienteData.length > 0 && clienteData[0].email && clienteData[0].auth_user_id) {
        // Usuário tem email real e auth_user_id - usar email real
        loginEmail = clienteData[0].email;
      } else {
        // Usuário antigo ou sem email real - usar email sintético
        loginEmail = phoneToEmail(phone);
      }
      
      // Usar Supabase Auth nativo
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        incrementFailedAttempts();
        
        // Mapear erros do Supabase para mensagens amigáveis
        let errorMessage = 'Credenciais inválidas';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Telefone ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme seu email antes de fazer login';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
        }
        
        // Log do erro para debugging (apenas em desenvolvimento)
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error:', error);
        }
        
        throw new Error(errorMessage);
      }

      if (!data.user) {
        incrementFailedAttempts();
        throw new Error('Erro na autenticação');
      }

      // Verificar se email foi confirmado
      if (!data.user.email_confirmed_at) {
        throw new Error('Por favor, confirme seu email antes de fazer login');
      }

      // Limpar tentativas falhadas apenas após login bem-sucedido
      clearFailedAttempts();
      
      // O cliente será carregado automaticamente pelo listener onAuthStateChange
      // Não precisamos mais buscar manualmente ou gerenciar sessionStorage
      
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
    /**
     * MIGRAÇÃO PARA SUPABASE AUTH - FASE 3
     * Substituindo Edge Functions por Supabase Auth nativo
     * Criando usuário e vinculando à tabela clientes
     * Data: 2025-01-16
     */
    
    try {
      // Validações básicas
      if (!phone || !name || !password) {
        throw new Error('Telefone, nome e senha são obrigatórios');
      }

      // Validar formato do telefone
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error('Formato de telefone inválido');
      }

      // Validar senha
      if (password.length < 8) {
        throw new Error('Senha deve ter no mínimo 8 caracteres');
      }

      // Usar email real fornecido pelo usuário
      const userEmail = email.trim();
      
      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        throw new Error('Formato de email inválido');
      }
      
      // Criar usuário no Supabase Auth com confirmação de email
      // Determinar URL de redirect baseado no ambiente
      const redirectUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/auth/login'
        : 'https://app.meuagente.api.br/auth/login';
      
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            phone: phone,        // CAMPO PHONE NO USER_METADATA
            name: name,
            cpf: cpf,
            email: userEmail,    // Email real do usuário
          }
        }
      });

      if (error) {
        // Mapear erros do Supabase para mensagens amigáveis
        let errorMessage = 'Erro ao criar conta';
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este telefone já está cadastrado';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Senha deve ter no mínimo 8 caracteres';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido';
        }
        
        throw new Error(errorMessage);
      }

      if (!data.user) {
        throw new Error('Erro ao criar usuário');
      }

      // Criar ou atualizar registro na tabela clientes
      const { error: clienteError } = await supabase
        .from('clientes')
        .upsert({
          phone: phone,
          name: name,
          email: email,
          cpf: cpf,
          auth_user_id: data.user.id,
          is_active: true,
          subscription_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'phone'
        });

      if (clienteError) {
        console.error('Error creating cliente record:', clienteError);
        // Não falhar o signup por erro na tabela clientes
        // O usuário foi criado no auth, então pode fazer login após confirmar email
      }

      // NÃO FAZER LOGIN AUTOMÁTICO - Requerer confirmação de email
      toast.success('Conta criada! Verifique seu email para confirmar.');
      navigate('/auth/login');
    } catch (err: any) {
      console.error('Signup error:', err);
      throw new Error(err.message || 'Erro ao criar conta');
    }
  };

  const logout = async () => {
    /**
     * CORREÇÃO DO LOGOUT - FASE 3
     * Implementando loading state e melhorias de UX
     * Data: 2025-01-16
     */
    
    setIsLoggingOut(true);
    
    try {
      // 1. Limpar estado local primeiro para evitar race conditions
      setCliente(null);
      setUser(null);
      setSession(null);
      
      // 2. Limpar dados de sessão e localStorage
      sessionStorage.removeItem('auth_phone');
      sessionStorage.removeItem('auth_avatar');
      sessionStorage.removeItem('agendaView');
      localStorage.removeItem('login_failed_attempts');
      localStorage.removeItem('login_blocked_until');
      
      // 3. Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Continuar mesmo com erro - estado já foi limpo
      }
      
      // 4. Mostrar feedback e navegar
      toast.info('Sessão encerrada');
      navigate('/auth/login');
      
    } catch (err) {
      console.error('Logout error:', err);
      // Garantir navegação mesmo com erro
      navigate('/auth/login');
    } finally {
      setIsLoggingOut(false);
    }
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

  // ✅ OTIMIZAÇÃO: Memoizar value do context (padrão React.dev)
  // Evita re-renders desnecessários dos consumers quando deps não mudam
  const contextValue = useMemo(() => ({
    cliente, 
    loading, 
    isLoggingOut,
    user, 
    session, 
    login, 
    signup, 
    logout, 
    updateAvatar, 
    updateCliente,
    checkPhoneExists
  }), [cliente, loading, isLoggingOut, user, session, login, signup, logout, updateAvatar, updateCliente, checkPhoneExists]);

  return (
    <AuthContext.Provider value={contextValue}>
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