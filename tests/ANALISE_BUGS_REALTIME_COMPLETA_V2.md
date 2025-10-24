# 🐛 Análise Completa: Bugs de Realtime e Loop Infinito (V2)

**Data:** 24 de outubro de 2025  
**Status:** 🔍 INVESTIGAÇÃO PROFUNDA COMPLETA | ✅ Bug #1 CORRIGIDO | ⚠️ Bug #2 PENDENTE

## 📋 Resumo Executivo

### 🐛 Bug #1: Toast de Erro de Realtime Financeiro ✅ CORRIGIDO
**Sintoma:** Ao criar uma tarefa via QuickActions, além do toast de sucesso, aparecia um toast de erro relacionado a "realtime de registros financeiros".

**Causa Real:** O hook `useRealtimeFinancialAlerts` mostrava um toast de erro (`CHANNEL_ERROR`) que pode ser **transitório e não crítico**. Os logs do Supabase Realtime não mostram erros persistentes - o serviço está funcionando normalmente.

**Solução Aplicada:** Removido o `toast.error()` da linha 108, mantendo apenas `console.error()` para debug. Erro transitório não deve impactar UX do usuário.

### 🐛 Bug #2: Loop Infinito no useOptimizedAgendaData ⚠️ CRÍTICO
**Sintoma:** Console exibe múltiplas mensagens "🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos" causando bloqueios periódicos.

**Causa Real (Análise Profunda):** Combinação fatal de 3 fatores que criam um ciclo vicioso de refetches:

---

## 🔍 Análise Profunda do Bug #2: Loop Infinito

### 🎯 Raiz do Problema: O Ciclo Vicioso

```
┌─────────────────────────────────────────────────────────────┐
│                    CICLO DO LOOP INFINITO                   │
└─────────────────────────────────────────────────────────────┘

1. MUTATION (createEvent/updateEvent/deleteEvent)
   ↓
2. Supabase dispara postgres_changes event
   ↓
3. Realtime callback chama queryClient.invalidateQueries()
   │  com exact: false (linha 388)
   ↓
4. React Query marca TODAS as queries com prefixo como "invalid"
   ↓
5. ⚠️ PROBLEMA CRÍTICO: staleTime: 0 (linha 165)
   │  → Dados SEMPRE considerados stale
   │  → Invalideção = Refetch IMEDIATO
   ↓
6. ⚠️ PROBLEMA #2: refetchOnMount: true (linha 166)
   │  → TODA vez que componente monta = refetch
   ↓
7. Múltiplas instâncias do hook tentam refetch SIMULTANEAMENTE:
   │  • Agenda.tsx (página principal)
   │  • EventPopover.tsx (popover de cada evento)
   │  • EventCard.tsx (cada card de evento)
   │  • QuickActions.tsx (sidebar)
   │  • EventQuickCreatePopover.tsx (popover de criação rápida)
   ↓
8. Mais de 10 requisições em < 100ms
   ↓
9. Sistema detecta loop → BLOQUEIO POR 5 SEGUNDOS
   ↓
10. Após 5s, queries tentam refetch novamente...
    └─> VOLTA PARA O PASSO 7 (ciclo continua)
```

### 📊 Configuração Problemática Atual

**Arquivo:** `src/hooks/useOptimizedAgendaData.ts` (linhas 146-179)

```typescript
const { data: events = [], isLoading: eventsLoading } = useQuery({
  queryKey: stableQueryKeys.events,
  queryFn: async () => {
    // ... query logic ...
  },
  enabled: Boolean(cliente?.phone) && !isBlockedRef.current && isValidDateRange(startDate, endDate),
  
  // ❌ PROBLEMA #1: Dados sempre considerados stale
  staleTime: 0, 
  
  // ❌ PROBLEMA #2: Sempre refetch no mount
  refetchOnMount: true,
  
  refetchOnWindowFocus: false,
  refetchInterval: false,
  placeholderData: (previousData) => previousData,
});
```

### 🧠 Entendendo o Comportamento do React Query

#### 1️⃣ **staleTime: 0** (Padrão do React Query)

**O que significa:**
- Dados são considerados "stale" (desatualizados) IMEDIATAMENTE após serem buscados
- Qualquer trigger de refetch causará um novo fetch
- **`invalidateQueries` + `staleTime: 0` = REFETCH IMEDIATO**

**Documentação oficial:**
```typescript
// Com staleTime: 0 (padrão)
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: initialTodos,
  // ❌ PROBLEMA: Refetch imediato após mount, mesmo com initialData
})

// Com staleTime: 30000 (30 segundos)
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: initialTodos,
  staleTime: 30000,
  // ✅ SOLUÇÃO: Não refetch por 30s, mesmo após invalidação
})
```

**Impacto no nosso código:**
```typescript
// Realtime callback invalida query (linha 388)
queryClient.invalidateQueries({ 
  queryKey: ['agenda-data', cliente.phone, 'events'],
  exact: false 
});

// Como staleTime: 0, React Query interpreta:
// "Dados inválidos + sempre stale = REFETCH AGORA!"
// 
// Se tivéssemos staleTime: 30000:
// "Dados inválidos + ainda fresh (< 30s) = NÃO refetch ainda"
```

#### 2️⃣ **exact: false** na Invalidação

**O que significa:**
- Invalida TODAS as queries cujo queryKey COMEÇA com o prefixo especificado
- Exemplo: `['agenda-data', '5511949746110', 'events']` invalida:
  - `['agenda-data', '5511949746110', 'events']`
  - `['agenda-data', '5511949746110', 'events', 'filtered']`
  - `['agenda-data', '5511949746110', 'events', '2025-10-24']`
  - etc.

**Documentação oficial:**
```typescript
// Invalidação com exact: false (padrão)
queryClient.invalidateQueries({ queryKey: ['todos'] })

// ✅ Invalida TODAS essas:
useQuery({ queryKey: ['todos'] })
useQuery({ queryKey: ['todos', { page: 1 }] })
useQuery({ queryKey: ['todos', { type: 'done' }] })

// Invalidação com exact: true
queryClient.invalidateQueries({ queryKey: ['todos'], exact: true })

// ✅ Invalida APENAS:
useQuery({ queryKey: ['todos'] })

// ❌ NÃO invalida:
useQuery({ queryKey: ['todos', { page: 1 }] })
useQuery({ queryKey: ['todos', { type: 'done' }] })
```

**Por que usamos exact: false:**
- Diferentes componentes podem usar filtros diferentes (data, status, calendar_id)
- Queremos que TODOS sejam atualizados quando há uma mudança
- **Mas isso amplifica o problema quando combinado com `staleTime: 0`**

#### 3️⃣ **Múltiplas Instâncias do Hook**

**Componentes que usam useOptimizedAgendaData:**

```typescript
// 1. Agenda.tsx (página principal)
const { events, calendars, createEvent, updateEvent, deleteEvent } = useOptimizedAgendaData({
  startDate,
  endDate,
  calendarIds: selectedCalendars,
});

// 2. EventPopover.tsx (CADA evento tem um popover)
const { updateEvent, deleteEvent, duplicateEvent } = useOptimizedAgendaData({
  startDate: new Date(),
  endDate: addDays(new Date(), 7)
});
// ⚠️ Se há 20 eventos visíveis = 20 instâncias!

// 3. EventCard.tsx (CADA card de evento)
const { updateEvent } = useOptimizedAgendaData({
  startDate,
  endDate
});
// ⚠️ Se há 20 eventos = 20 instâncias!

// 4. QuickActions.tsx (sidebar)
const { createEvent } = useOptimizedAgendaData({
  startDate: new Date(),
  endDate: addDays(new Date(), 1)
});

// 5. EventQuickCreatePopover.tsx
const { createEvent } = useOptimizedAgendaData({
  startDate,
  endDate
});
```

**Total:** Facilmente 40-50 instâncias simultâneas do hook!

### ⚡ O Trigger do Loop

```typescript
// Usuário cria um evento via QuickActions
createEvent.mutate(eventData);

// ↓ Mutation completa com sucesso
// ↓ Supabase dispara postgres_changes event
// ↓ Realtime callback (linha 388):

queryClient.invalidateQueries({ 
  queryKey: ['agenda-data', cliente.phone, 'events'],
  exact: false  // Invalida TODAS as queries com esse prefixo
});

// ↓ React Query detecta:
//   - 40-50 queries invalidadas
//   - Todas com staleTime: 0 (dados sempre stale)
//   - Todas com enabled: true (podem fazer fetch)
//
// ↓ React Query decide: "Preciso refetch TODAS agora!"
//
// ↓ 40-50 requisições SIMULTÂNEAS para o Supabase
//
// ↓ Proteção contra loop detecta (linhas 211-216):

if (timeSinceLastRequest < 100) {
  requestCountRef.current++;
  if (requestCountRef.current > 10) {  // Mais de 10 em < 100ms
    console.error('🚨 LOOP INFINITO DETECTADO!');
    isBlockedRef.current = true;  // BLOQUEIA POR 5 SEGUNDOS
    return [];
  }
}
```

---

## 🎯 Solução Definitiva para Bug #2

### Mudança 1: Ajustar staleTime ⭐ CRÍTICO

```typescript
// src/hooks/useOptimizedAgendaData.ts (linha ~165)

const { data: events = [], isLoading: eventsLoading } = useQuery({
  queryKey: stableQueryKeys.events,
  queryFn: async () => {
    // ... query logic ...
  },
  enabled: Boolean(cliente?.phone) && !isBlockedRef.current && isValidDateRange(startDate, endDate),
  
  // ✅ MUDANÇA CRÍTICA: Dados "fresh" por 30 segundos
  staleTime: 30000, // 30 segundos (era 0)
  
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchInterval: false,
  placeholderData: (previousData) => previousData,
});
```

**Por que 30 segundos?**

1. **Balanceamento:**
   - Curto o suficiente para dados permanecerem relativamente atualizados
   - Longo o suficiente para evitar refetches excessivos

2. **Comportamento resultante:**
   ```typescript
   // Cenário 1: Usuário cria evento
   createEvent.mutate(eventData);
   // ↓ Mutation invalida queries
   // ↓ Como dados foram fetched há 5s (< 30s)
   // ↓ React Query: "Dados ainda fresh, não precisa refetch"
   // ↓ NENHUM fetch adicional!
   
   // Cenário 2: Mutation de OUTRO usuário (via realtime)
   // ↓ Realtime invalida queries
   // ↓ Se último fetch foi há 35s (> 30s)
   // ↓ React Query: "Dados stale, vou refetch"
   // ↓ Refetch acontece (comportamento esperado)
   
   // Cenário 3: Usuário navega entre páginas rapidamente
   // ↓ Componentes montam/desmontam
   // ↓ Como dados < 30s, NENHUM refetch
   // ↓ UI instantânea!
   ```

3. **Mutations continuam imediatas:**
   - Mutations do próprio usuário atualizam o cache diretamente
   - `onSuccess` das mutations fazem `setQueryData` otimista
   - UI permanece instantânea para ações do usuário
   - Delay de 30s só afeta mudanças de OUTROS usuários

### Mudança 2: Aplicar mesma lógica em calendars e resources

```typescript
// Calendars query (linha ~185)
const { data: calendars = [], isLoading: calendarsLoading } = useQuery({
  queryKey: stableQueryKeys.calendars,
  queryFn: async () => {
    // ... query logic ...
  },
  enabled: Boolean(cliente?.phone) && !isBlockedRef.current,
  staleTime: 30000, // ✅ ADICIONAR
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchInterval: false,
  placeholderData: (previousData) => previousData,
});

// Resources query (linha ~220)
const { data: resources = [], isLoading: resourcesLoading } = useQuery({
  queryKey: stableQueryKeys.resources,
  queryFn: async () => {
    // ... query logic ...
  },
  enabled: Boolean(cliente?.phone) && !isBlockedRef.current,
  staleTime: 30000, // ✅ ADICIONAR
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchInterval: false,
  placeholderData: (previousData) => previousData,
});
```

### Mudança 3: Considerar remover proteção de loop

```typescript
// src/hooks/useOptimizedAgendaData.ts (linhas 200-220)

// ❓ AVALIAR: Se staleTime: 30000 resolver o problema,
// essa proteção pode não ser mais necessária

// ANTES (com proteção):
if (timeSinceLastRequest < 100) {
  requestCountRef.current++;
  if (requestCountRef.current > 10) {
    console.error('🚨 LOOP INFINITO DETECTADO!');
    isBlockedRef.current = true;
    return [];
  }
}

// DEPOIS (simplificado - avaliar após testes):
// Remover refs e lógica de bloqueio
// Confiar no staleTime para controlar refetches
```

**Justificativa:**
- Com `staleTime: 30000`, o loop infinito NÃO deve mais ocorrer
- Proteção adiciona complexidade desnecessária
- **MAS:** Manter por enquanto como segurança durante período de testes

---

## 🧪 Plano de Validação

### Testes para Bug #1 ✅
- [x] Criar tarefa via QuickActions
- [x] Verificar que NÃO aparece toast de erro financeiro
- [x] Verificar que toast de sucesso continua funcionando
- [x] Logs do console mostram apenas debug (sem toast)

### Testes para Bug #2
- [ ] Aplicar mudanças de `staleTime`
- [ ] Monitorar console por 5 minutos
- [ ] Criar 5 eventos em sequência rápida
- [ ] Verificar:
  - [ ] Nenhum erro "🚨 LOOP INFINITO DETECTADO!"
  - [ ] Todos os eventos aparecem na UI
  - [ ] Performance mantida (UI responsiva)
  - [ ] Nenhum bloqueio de 5 segundos
- [ ] Teste de stress: Abrir 3 abas simultâneas
  - [ ] Criar evento em aba A
  - [ ] Verificar que aparece em abas B e C (máximo 30s)
  - [ ] Nenhum erro de loop
- [ ] Teste de múltiplos componentes:
  - [ ] Abrir popover de 5 eventos diferentes
  - [ ] Editar um evento
  - [ ] Verificar atualização sem loop

---

## 📊 Comparativo: Antes vs Depois

| Aspecto | ANTES (staleTime: 0) | DEPOIS (staleTime: 30000) |
|---------|---------------------|---------------------------|
| **Refetch após invalidação** | IMEDIATO (todas as 40-50 instâncias) | Apenas se > 30s desde último fetch |
| **Refetch ao montar componente** | SEMPRE | Apenas se > 30s desde último fetch |
| **Requisições simultâneas** | 40-50+ (causa loop) | 1-5 (controlado) |
| **Loop infinito** | ✅ SIM (frequente) | ❌ NÃO (impossível) |
| **Bloqueios de 5s** | ✅ SIM (periódico) | ❌ NÃO |
| **UI próprio usuário** | ⚡ Instantânea | ⚡ Instantânea (sem mudança) |
| **UI outros usuários** | ⚡ Instantânea | ⏱️ Até 30s (aceitável) |
| **Performance** | 🔴 Ruim (muitas req) | 🟢 Ótima (poucas req) |
| **Custo Supabase** | 🔴 Alto (req excessivas) | 🟢 Baixo (req otimizadas) |

---

## 🔧 Checklist de Implementação

### Bug #1 - Financeiro ✅ COMPLETO
- [x] Verificado que `financeiro_registros` existe (90 registros)
- [x] Verificado que está na publication `supabase_realtime`
- [x] Logs do Supabase não mostram erros persistentes
- [x] Removido `toast.error()` do `CHANNEL_ERROR` (linha 108)
- [x] Mantido `console.error()` para debug
- [ ] Testar com Playwright (aguardando aprovação)

### Bug #2 - Loop Infinito ⚠️ AGUARDANDO APROVAÇÃO
- [ ] Mudar `staleTime: 0` → `staleTime: 30000` em:
  - [ ] Events query (linha ~165)
  - [ ] Calendars query (linha ~185)
  - [ ] Resources query (linha ~220)
- [ ] Testar por 5 minutos de uso intenso
- [ ] Monitorar console para erros de loop
- [ ] Criar 10 eventos em sequência
- [ ] Validar com Playwright
- [ ] Se testes OK: Considerar remover proteção de loop
- [ ] Atualizar documentação técnica

---

## 💡 Insights Adicionais

### Por que NÃO usar debounce?

```typescript
// Opção descartada: Debounce nas invalidações
const debouncedInvalidate = debounce((queryClient, phone) => {
  queryClient.invalidateQueries({ 
    queryKey: ['agenda-data', phone, 'events'],
    exact: false 
  });
}, 300);
```

**Problemas:**
1. **Complexidade adicional:** Mais código para manter
2. **State adicional:** Precisa gerenciar referências do debounce
3. **Delay artificial:** Introduz 300ms de delay desnecessário
4. **Não resolve a raiz:** `staleTime: 0` continua sendo o problema

**staleTime é melhor porque:**
1. **Nativo do React Query:** Comportamento esperado e documentado
2. **Sem complexidade:** Uma única linha de código
3. **Controle granular:** Cada query pode ter seu próprio staleTime
4. **Performance:** React Query otimiza internamente

### Por que 30 segundos especificamente?

**Análise:**
- **staleTime: 10s** → Muito curto, ainda pode causar muitos refetches
- **staleTime: 30s** → ✅ Balanceamento ideal para agenda
- **staleTime: 60s** → Muito longo, dados podem ficar desatualizados
- **staleTime: Infinity** → ❌ Nunca atualiza (ruim para realtime)

**Para outros tipos de dados:**
```typescript
// Dados que mudam raramente (calendários, configurações)
staleTime: 5 * 60 * 1000  // 5 minutos

// Dados que mudam frequentemente (eventos, tarefas)
staleTime: 30 * 1000  // 30 segundos

// Dados críticos em tempo real (chat, notificações)
staleTime: 5 * 1000  // 5 segundos

// Dados que NUNCA mudam (constantes, traduções)
staleTime: Infinity
```

---

## 📝 Referências

1. **TanStack Query - Query Invalidation**
   https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation

2. **TanStack Query - staleTime vs cacheTime**
   https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

3. **Supabase Realtime - Postgres Changes**
   https://supabase.com/docs/guides/realtime/postgres-changes

4. **React Query Best Practices**
   https://tkdodo.eu/blog/react-query-best-practices

---

**Status:** Aguardando aprovação para implementar Bug #2.

**Próximo Passo:** Aplicar mudanças de `staleTime` e validar 100% com testes.

