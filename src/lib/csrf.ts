/**
 * CSRF Protection Library
 * Implementa proteção contra Cross-Site Request Forgery
 * 
 * Estratégia: Double Submit Cookie Pattern
 * - Token CSRF armazenado em cookie seguro
 * - Token CSRF enviado em header customizado
 * - Validação no servidor (Supabase Edge Functions)
 */

// Gerar token CSRF seguro
export const generateCSRFToken = (): string => {
  // Usar crypto.randomUUID() se disponível, senão fallback para Math.random()
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback para navegadores mais antigos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Armazenar token CSRF de forma segura
export const storeCSRFToken = (token: string): void => {
  try {
    // Armazenar em sessionStorage (mais seguro que localStorage)
    sessionStorage.setItem('csrf-token', token);
    
    // Também armazenar em cookie para validação no servidor
    document.cookie = `csrf-token=${token}; path=/; secure; samesite=strict`;
  } catch (error) {
    console.warn('Erro ao armazenar token CSRF:', error);
  }
};

// Recuperar token CSRF
export const getCSRFToken = (): string | null => {
  try {
    return sessionStorage.getItem('csrf-token');
  } catch (error) {
    console.warn('Erro ao recuperar token CSRF:', error);
    return null;
  }
};

// Validar token CSRF
export const validateCSRFToken = (token: string): boolean => {
  if (!token) return false;
  
  // Validação básica de formato UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(token);
};

// Limpar token CSRF
export const clearCSRFToken = (): void => {
  try {
    sessionStorage.removeItem('csrf-token');
    document.cookie = 'csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (error) {
    console.warn('Erro ao limpar token CSRF:', error);
  }
};

// Hook para gerenciar CSRF token
export const useCSRFProtection = () => {
  const [csrfToken, setCSRFToken] = React.useState<string>('');
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // Tentar recuperar token existente
    let existingToken = getCSRFToken();
    
    if (!existingToken || !validateCSRFToken(existingToken)) {
      // Gerar novo token se não existir ou for inválido
      existingToken = generateCSRFToken();
      storeCSRFToken(existingToken);
    }
    
    setCSRFToken(existingToken);
    setIsInitialized(true);
  }, []);

  return { 
    csrfToken, 
    isInitialized,
    refreshToken: () => {
      const newToken = generateCSRFToken();
      storeCSRFToken(newToken);
      setCSRFToken(newToken);
    }
  };
};

// Importar React para o hook
import React from 'react';
