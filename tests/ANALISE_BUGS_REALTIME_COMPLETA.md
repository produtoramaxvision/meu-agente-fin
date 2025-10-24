# 🐛 Análise Completa: Bugs de Realtime e Loop Infinito

**Data:** 24 de outubro de 2025  
**Status:** 🔍 INVESTIGAÇÃO COMPLETA | ⚠️ CORREÇÃO PENDENTE

## 📋 Resumo dos Problemas

### 🐛 Bug #1: Toast de Erro de Realtime de Registros Financeiros
**Sintoma:** Ao criar uma tarefa via QuickActions, além do toast de sucesso, aparece um toast de erro relacionado a "realtime de registros financeiros".

**Causa:** O hook `useRealtimeFinancialAlerts` (linha 108) exibe um toast de erro quando o status da subscription é `CHANNEL_ERROR`.

### 🐛 Bug #2: Loop Infinito no useOptimizedAgendaData
**Sintoma:** Console exibe múltiplas mensagens "🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos".

**Causa:** Invalidações de queries em loop devido a configuração incorreta de `staleTime` e invalidações excessivas.

---

## 🔍 Análise Detalhada

### Bug #1: Erro de Realtime Financeiro

#### Localização do Código
**Arquivo:** `src/hooks/useRealtimeFinancialAlerts.ts`

```typescript:src/hooks/useRealtimeFinancialAlerts.ts
// Linhas 102-114
.subscribe((status) => {
  console.log('🔌 Canal de alertas financeiros:', status);
  if (status === 'SUBSCRIBED') {
    console.log('✅ Conectado ao canal de alertas financeiros em tempo real');
  } else if (status === 'CHANNEL_ERROR') {
    console.error('❌ Erro no canal de alertas financeiros');
    toast.error('Erro ao conectar alertas financeiros em tempo real'); // ← AQUI
  } else if (status === 'TIMED_OUT') {
    console.warn('⏰ Timeout no canal de alertas financeiros');
  } else if (status === 'CLOSED') {
    console.log('🔒 Canal de alertas financeiros fechado');
  }
});
```

#### Uso Global
**Arquivo:** `src/components/layout/AppLayout.tsx` (linha 24)

```typescript:src/components/layout/AppLayout.tsx
export const AppLayout = ({ children, sidebarOpen, onSidebarToggle }: AppLayoutProps) => {
  const { cliente } = useAuth();
  useScrollToTop();
  
  // Hook para alertas financeiros em tempo real
  useRealtimeFinancialAlerts(cliente?.phone); // ← Chamado em TODAS as páginas
```

#### Causas Possíveis do CHANNEL_ERROR

1. **Tabela não existe:** A tabela `financeiro_registros` pode não existir no banco
2. **Tabela não está na publication:** A tabela não foi adicionada ao `supabase_realtime` publication
3. **Permissões RLS:** Row Level Security pode estar bloqueando o acesso
4. **Filtro inválido:** O filtro `phone=eq.${userPhone}` pode estar malformado

---

### Bug #2: Loop Infinito no useOptimizedAgendaData

#### Localização do Código
**Arquivo:** `src/hooks/useOptimizedAgendaData.ts`

**Detecção do Loop (linhas 209-220):**
```typescript:src/hooks/useOptimizedAgendaData.ts
if (timeSinceLastRequest < 100) {
  requestCountRef.current++;
  if (requestCountRef.current > 10) {
    console.error('🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos');
    isBlockedRef.current = true;
    return [];
  }
} else {
  requestCountRef.current = 0;
}
```

**Realtime Subscription (linhas 384-392):**
```typescript:src/hooks/useOptimizedAgendaData.ts
.on(
  'postgres_changes',
  {
    event: '*',
    schema: 'public',
    table: 'events',
    filter: `phone=eq.${cliente.phone}`,
  },
  (payload) => {
    console.log('Realtime event update:', payload);
    
    // ✅ INVALIDAÇÃO SELETIVA: Apenas invalidar queries relacionadas
    queryClient.invalidateQueries({ 
      queryKey: ['agenda-data', cliente.phone, 'events'],
      exact: false 
    });
  }
)
```

**Configuração da Query (linhas 146-179):**
```typescript:src/hooks/useOptimizedAgendaData.ts
const { data: events = [], isLoading: eventsLoading } = useQuery({
  queryKey: stableQueryKeys.events,
  queryFn: async () => {
    // ... proteção contra loop ...
    
    // Validar datas
    if (!isValidDateRange(startDate, endDate)) {
      console.warn('useOptimizedAgendaData: Intervalo de datas inválido');
      return [];
    }
    
    // ... fetch dos eventos ...
  },
  enabled: Boolean(cliente?.phone) && !isBlockedRef.current && isValidDateRange(startDate, endDate),
  staleTime: 0, // ← PROBLEMA: Dados sempre considerados stale
  refetchOnMount: true, // ← Sempre refetch no mount
  refetchOnWindowFocus: false,
  refetchInterval: false,
  placeholderData: (previousData) => previousData,
});
```

#### Ciclo do Loop Infinito

```
1. Mutation cria/atualiza/deleta evento
   ↓
2. Supabase dispara postgres_changes event
   ↓
3. Realtime callback invalida queries (linha 388)
   ↓
4. React Query detecta invalidação
   ↓
5. Como staleTime: 0, todas as queries são consideradas stale
   ↓
6. React Query faz refetch de TODAS as queries com o prefixo
   ↓
7. Múltiplas instâncias do hook (EventPopover, QuickActions, Agenda, etc.)
      tentam fazer fetch simultaneamente
   ↓
8. Mais de 10 requisições em < 100ms
   ↓
9. Sistema detecta loop e bloqueia por 5 segundos
```

---

## 🎯 Soluções Propostas

### Solução Bug #1: Erro de Realtime Financeiro

#### Opção A: Verificar Existência da Tabela (Recomendado)
```typescript
// src/hooks/useRealtimeFinancialAlerts.ts
export const useRealtimeFinancialAlerts = (userPhone: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userPhone) {
      console.log('⚠️ useRealtimeFinancialAlerts: userPhone não fornecido');
      return;
    }

    console.log('💰 useRealtimeFinancialAlerts: Iniciando para:', userPhone);

    // Verificar se a tabela existe antes de criar subscription
    const checkTableExists = async () => {
      const { error } = await supabase
        .from('financeiro_registros')
        .select('id')
        .limit(1);
      
      if (error) {
        console.warn('⚠️ Tabela financeiro_registros não encontrada ou sem permissão:', error);
        return false;
      }
      return true;
    };

    checkTableExists().then((exists) => {
      if (!exists) {
        console.log('⚠️ Subscription de realtime financeiro desativada (tabela não disponível)');
        return;
      }

      // Configurar canal apenas se a tabela existir
      const channel: RealtimeChannel = supabase
        .channel(`financial-alerts:${userPhone}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'financeiro_registros',
            filter: `phone=eq.${userPhone}`
          },
          (payload) => {
            // ... handlers ...
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            // ❌ REMOVER TOAST DE ERRO - apenas logar
            console.error('❌ Erro no canal de alertas financeiros');
            // NÃO exibir toast para o usuário
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }, [userPhone, queryClient]);
};
```

#### Opção B: Desativar Temporariamente (Rápido)
```typescript
// src/components/layout/AppLayout.tsx
export const AppLayout = ({ children, sidebarOpen, onSidebarToggle }: AppLayoutProps) => {
  const { cliente } = useAuth();
  useScrollToTop();
  
  // TODO: Reativar quando tabela financeiro_registros estiver disponível
  // useRealtimeFinancialAlerts(cliente?.phone);
```

---

### Solução Bug #2: Loop Infinito

#### Mudança 1: Ajustar staleTime (Crítico)
```typescript
// src/hooks/useOptimizedAgendaData.ts (linha ~165)
const { data: events = [], isLoading: eventsLoading } = useQuery({
  queryKey: stableQueryKeys.events,
  queryFn: async () => {
    // ... query logic ...
  },
  enabled: Boolean(cliente?.phone) && !isBlockedRef.current && isValidDateRange(startDate, endDate),
  staleTime: 30000, // ← MUDANÇA: 30 segundos (era 0)
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchInterval: false,
  placeholderData: (previousData) => previousData,
});
```

**Justificativa:** Com `staleTime: 30000`, as queries não serão refetch automaticamente por 30 segundos após o último fetch bem-sucedido, mesmo que sejam invalidadas. Isso quebra o loop porque:
- Invalidação marca query como "needs refetch"
- Mas React Query respeita o `staleTime` e NÃO faz refetch imediato
- Apenas componentes montados **após** o staleTime expirar farão refetch

#### Mudança 2: Debounce nas Invalidações (Adicional)
```typescript
// src/hooks/useOptimizedAgendaData.ts
import { debounce } from 'lodash-es'; // ou implementar manualmente

// Criar função debounced FORA do component
const debouncedInvalidate = debounce((queryClient, phone) => {
  queryClient.invalidateQueries({ 
    queryKey: ['agenda-data', phone, 'events'],
    exact: false 
  });
}, 300); // 300ms debounce

// Usar no realtime callback (linha ~388)
.on(
  'postgres_changes',
  {
    event: '*',
    schema: 'public',
    table: 'events',
    filter: `phone=eq.${cliente.phone}`,
  },
  (payload) => {
    console.log('Realtime event update:', payload);
    
    // ✅ INVALIDAÇÃO COM DEBOUNCE
    debouncedInvalidate(queryClient, cliente.phone);
  }
)
```

**Justificativa:** O debounce agrupa múltiplas invalidações em uma única chamada, evitando invalidações excessivas quando múltiplos eventos são disparados rapidamente.

---

## 🧪 Validação Necessária

### Para Bug #1:
1. ✅ Verificar se tabela `financeiro_registros` existe no Supabase
2. ✅ Verificar se está na publication `supabase_realtime`
3. ✅ Testar subscription manualmente no console do Supabase
4. ✅ Validar com Playwright após correção

### Para Bug #2:
1. ✅ Aplicar `staleTime: 30000`
2. ✅ Monitorar console para erros de loop
3. ✅ Criar tarefa via QuickActions e verificar:
   - Nenhum erro de loop
   - Atualização automática funciona
   - Performance mantida
4. ✅ Testar em múltiplas abas/componentes simultâneos

---

## 📊 Impacto das Mudanças

### Bug #1 (Financeiro):
- **Impacto UX:** ⬇️ Reduz toasts de erro desnecessários
- **Impacto Performance:** ✅ Nenhum (apenas remove tentativa de conexão falha)
- **Risco:** ⬇️ Baixo (feature opcional)

### Bug #2 (Loop Infinito):
- **Impacto UX:** ⬆️ Melhora responsividade (sem bloqueios de 5s)
- **Impacto Performance:** ⬆️ Reduz requisições desnecessárias
- **Impacto Realtime:** ⚠️ Pequeno delay (30s máximo) para atualizações automáticas
  - **Mitigação:** Mutations ainda invalidam, então mudanças do próprio usuário são imediatas
  - **Benefício:** Apenas mudanças de OUTROS usuários têm delay máximo de 30s

---

## 🔧 Checklist de Implementação

- [ ] **Bug #1 - Financeiro**
  - [ ] Verificar se `financeiro_registros` existe
  - [ ] Se NÃO existe: Desativar hook no AppLayout
  - [ ] Se existe: Adicionar verificação de tabela no hook
  - [ ] Remover toast de erro de CHANNEL_ERROR (apenas log)
  - [ ] Testar com Playwright

- [ ] **Bug #2 - Loop Infinito**
  - [ ] Mudar `staleTime: 0` para `staleTime: 30000` em `useOptimizedAgendaData`
  - [ ] (Opcional) Implementar debounce nas invalidações
  - [ ] Remover proteção de loop se não for mais necessária
  - [ ] Monitorar console durante 5 minutos
  - [ ] Testar criação/edição/exclusão de eventos
  - [ ] Validar com Playwright

- [ ] **Documentação**
  - [ ] Atualizar documentação técnica
  - [ ] Adicionar notas sobre `staleTime` e invalidação
  - [ ] Documentar decisão sobre realtime financeiro

---

## 📝 Observações Finais

1. **Prioridade:** Bug #2 (Loop Infinito) é CRÍTICO - impacta performance de todo o sistema
2. **Prioridade:** Bug #1 (Financeiro) é MÉDIO - impacta apenas UX com toasts extras
3. **Teste Sugerido:** Usar Playwright para criar 5 tarefas em sequência e verificar:
   - Nenhum erro de loop
   - Todas as tarefas aparecem
   - Nenhum toast de erro financeiro

---

**Próximos Passos:** Aguardando aprovação para implementar as correções propostas.

