# 🔧 SOLUÇÕES PARA PROBLEMA DE AUTENTICAÇÃO E RLS

## 🚨 PROBLEMA IDENTIFICADO
Os registros não aparecem porque há incompatibilidade entre:
- **Autenticação**: Sistema customizado com Edge Functions
- **Políticas RLS**: Configuradas para Supabase Auth nativo
- **Resultado**: `auth.uid()` = null, bloqueando todas as queries

## 🛠️ OPÇÃO 1: MIGRAR PARA SUPABASE AUTH (RECOMENDADA)

### Vantagens:
- ✅ Segurança nativa do Supabase
- ✅ RLS funciona automaticamente
- ✅ Menos código customizado para manter
- ✅ Melhor integração com ecosystem Supabase

### Implementação:

#### 1. Atualizar AuthContext.tsx
```typescript
// Substituir sistema customizado por Supabase Auth
const login = async (phone: string, password: string) => {
  // Usar signInWithPassword do Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${phone}@temp.com`, // Usar phone como email temporário
    password: password,
  });
  
  if (error) throw error;
  
  // Buscar dados do cliente
  const { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('phone', phone)
    .single();
    
  setCliente(cliente);
};
```

#### 2. Atualizar Políticas RLS
```sql
-- Usar auth.uid() em vez de JWT claims
CREATE POLICY "Users can view their own records"
ON public.financeiro_registros
FOR SELECT
USING (auth.uid()::text = phone);
```

#### 3. Migração de Dados
```sql
-- Criar usuários Supabase para clientes existentes
-- Script de migração necessário
```

## 🛠️ OPÇÃO 2: AJUSTAR RLS PARA AUTH CUSTOMIZADA (RÁPIDA)

### Vantagens:
- ✅ Mudança mínima no código existente
- ✅ Implementação mais rápida
- ❌ Menos segura que Supabase Auth nativo

### Implementação:

#### 1. Criar Políticas Baseadas em Phone
```sql
-- Remover políticas atuais
DROP POLICY IF EXISTS "optimized_financeiro_select" ON public.financeiro_registros;

-- Criar política que permite acesso direto por phone
CREATE POLICY "allow_phone_access_financeiro"
ON public.financeiro_registros
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- TEMPORÁRIO: Desabilitar RLS para teste
ALTER TABLE public.financeiro_registros DISABLE ROW LEVEL SECURITY;
```

#### 2. Implementar Validação no Cliente
```typescript
// Adicionar validação de sessão nos hooks
const { data: records = [], isLoading } = useQuery({
  queryKey: ['financial-records', cliente?.phone],
  queryFn: async () => {
    if (!cliente?.phone) throw new Error('Usuário não autenticado');
    
    // Validar sessão ativa
    const authPhone = sessionStorage.getItem('auth_phone');
    if (authPhone !== cliente.phone) {
      throw new Error('Sessão inválida');
    }
    
    const { data, error } = await supabase
      .from('financeiro_registros')
      .select('*')
      .eq('phone', cliente.phone);
      
    if (error) throw error;
    return data;
  },
  enabled: !!cliente?.phone,
});
```

## 🛠️ OPÇÃO 3: SOLUÇÃO HÍBRIDA (BALANCEADA)

### Implementação:

#### 1. Manter Auth Customizada + RLS Inteligente
```sql
-- Política que funciona com ambos os sistemas
CREATE OR REPLACE FUNCTION get_current_user_phone()
RETURNS TEXT AS $$
BEGIN
  -- Tentar obter phone do JWT (Supabase Auth)
  BEGIN
    RETURN (current_setting('request.jwt.claims', true)::json ->> 'phone');
  EXCEPTION WHEN OTHERS THEN
    -- Se falhar, permitir acesso público (será validado no cliente)
    RETURN NULL;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política flexível
CREATE POLICY "flexible_access_financeiro"
ON public.financeiro_registros
FOR ALL
TO public
USING (
  CASE 
    WHEN get_current_user_phone() IS NOT NULL 
    THEN phone = get_current_user_phone()
    ELSE true  -- Permitir se não houver JWT (validação no cliente)
  END
);
```

## 🚀 RECOMENDAÇÃO FINAL

**Para correção imediata**: Use OPÇÃO 2 (desabilitar RLS temporariamente)
**Para solução definitiva**: Use OPÇÃO 1 (migrar para Supabase Auth)

### Próximos Passos:
1. Escolher uma das opções
2. Implementar a solução
3. Testar em ambiente de desenvolvimento
4. Migrar dados se necessário
5. Atualizar documentação

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Opção 2 (Correção Rápida):
- [ ] Desabilitar RLS nas tabelas principais
- [ ] Adicionar validação de sessão nos hooks
- [ ] Testar carregamento de dados
- [ ] Verificar segurança da aplicação

### Opção 1 (Solução Definitiva):
- [ ] Configurar Supabase Auth
- [ ] Migrar sistema de login/signup
- [ ] Atualizar políticas RLS
- [ ] Migrar dados de usuários existentes
- [ ] Testar todo o fluxo de autenticação