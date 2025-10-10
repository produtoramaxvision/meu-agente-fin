import { useAuth } from '@/contexts/AuthContext';

export interface Permission {
  canExport: boolean;
  canAccessWhatsApp: boolean;
  canAccessSupport: boolean;
  canAccessAdvancedFeatures: boolean;
}

export function usePermissions() {
  const { cliente } = useAuth();

  // Verificar se o usuário tem assinatura ativa
  const hasActiveSubscription = cliente?.subscription_active === true;
  
  // CORREÇÃO CRÍTICA: Verificar se é um plano pago (basic, business, premium)
  const isPaidPlan = hasActiveSubscription && cliente?.plan_id && ['basic', 'business', 'premium'].includes(cliente.plan_id);

  const permissions: Permission = {
    // CORREÇÃO: Exportação apenas para usuários com planos PAGOS (basic, business, premium)
    canExport: isPaidPlan,
    
    // WhatsApp apenas para business e premium (com subscription ativa)
    canAccessWhatsApp: hasActiveSubscription && (cliente?.plan_id === 'business' || cliente?.plan_id === 'premium'),
    
    // Suporte para usuários com subscription ativa
    canAccessSupport: hasActiveSubscription,
    
    // Recursos avançados para usuários com subscription ativa
    canAccessAdvancedFeatures: hasActiveSubscription,
  };

  const hasPermission = (permission: keyof Permission): boolean => {
    return permissions[permission];
  };

  const requirePermission = (permission: keyof Permission): boolean => {
    if (!hasPermission(permission)) {
      console.warn(`Acesso negado: usuário sem assinatura ativa não tem permissão para ${permission}`);
      return false;
    }
    return true;
  };

  const getUpgradeMessage = (feature: string): string => {
    return `Esta funcionalidade (${feature}) está disponível apenas para usuários com planos pagos (Basic, Business ou Premium). Faça upgrade para acessar este recurso.`;
  };

  return {
    permissions,
    hasPermission,
    requirePermission,
    getUpgradeMessage,
    hasActiveSubscription,
    isPaidPlan,
  };
}
