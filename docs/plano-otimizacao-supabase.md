# 🚨 **PLANO DE OTIMIZAÇÃO SUPABASE - EXCESSO DE REQUISIÇÕES**

## 📊 **Diagnóstico dos Logs**

**SIM, você está tendo MUITAS requisições no Supabase!**

### 🔥 **Problemas Identificados:**

1. **Requisições Excessivas para `/events`**: 
   - **Centenas de requisições** para a mesma URL em poucos minutos
   - Padrão: `GET /rest/v1/events?select=*&phone=eq.5511949746110&or=...`
   - **Cada requisição duplicada** (OPTIONS + GET)

2. **Loop Infinito Detectado**:
   - Requisições a cada **50-100ms** para a mesma consulta
   - **Timestamp pattern**: 14:35:18.831Z → 14:35:15.227Z (3+ minutos de requisições contínuas)

3. **Problema de Cache**:
   - Todas as requisições retornam **status 200** mas provavelmente dados vazios
   - **Sem cache** - cada requisição vai direto ao banco

## 🛠️ **SOLUÇÕES BASEADAS NAS MELHORES PRÁTICAS**

### **1. Implementar React Query com Cache Inteligente**

```tsx
// hooks/useAgendaData.ts - OTIMIZADO
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useAgendaData = (phone: string) => {
  return useQuery({
    queryKey: ['agenda', phone],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('phone', phone);
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false, // Evita refetch desnecessário
    refetchOnMount: false, // Usa cache se disponível
    retry: 2, // Máximo 2 tentativas
  });
};
```

### **2. Implementar Debounce para Evitar Requisições Múltiplas**

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Uso no componente
const debouncedPhone = useDebounce(phone, 500); // 500ms de delay
```

### **3. Otimizar Políticas RLS (CRÍTICO)**

```sql
-- OTIMIZAÇÃO CRÍTICA: Wrapping auth.uid() em SELECT
-- ANTES (LENTO):
CREATE POLICY "Users can view their own events"
ON events FOR SELECT
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

-- DEPOIS (RÁPIDO):
CREATE POLICY "Users can view their own events"
ON events FOR SELECT
USING (phone = (SELECT current_setting('request.jwt.claims', true)::json->>'phone'));
```

### **4. Implementar Loading States e Error Boundaries**

```tsx
// components/AgendaOptimized.tsx
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from 'react-error-boundary';

const AgendaOptimized = () => {
  return (
    <ErrorBoundary fallback={<div>Erro ao carregar agenda</div>}>
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <AgendaContent />
      </Suspense>
    </ErrorBoundary>
  );
};
```

### **5. Configurar QueryClient Global**

```tsx
// main.tsx - Configuração Global
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Sua aplicação */}
    </QueryClientProvider>
  );
}
```

### **6. Implementar Paginação e Limite de Dados**

```tsx
// hooks/usePaginatedEvents.ts
export const usePaginatedEvents = (phone: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['events', phone, page, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('phone', phone)
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    keepPreviousData: true, // Mantém dados anteriores durante carregamento
  });
};
```

## 🎯 **AÇÕES IMEDIATAS RECOMENDADAS**

### **Prioridade ALTA (Implementar AGORA):**

1. **Implementar React Query** com cache de 5 minutos
2. **Adicionar debounce** de 500ms nas consultas
3. **Otimizar políticas RLS** com SELECT wrapping
4. **Desabilitar refetch automático** no window focus

### **Prioridade MÉDIA:**

1. **Implementar paginação** para grandes datasets
2. **Adicionar loading states** para melhor UX
3. **Configurar error boundaries** para tratamento de erros

### **Prioridade BAIXA:**

1. **Monitorar métricas** de cache hit rate
2. **Implementar lazy loading** para componentes pesados

## 📈 **Resultados Esperados**

- **Redução de 80-90%** nas requisições ao Supabase
- **Melhoria significativa** na performance da aplicação
- **Redução de custos** de bandwidth e database queries
- **Melhor experiência** do usuário com loading states

## 📋 **Status de Implementação**

- [x] Diagnóstico completo dos logs
- [x] Identificação dos problemas críticos
- [x] Criação do plano de otimização
- [x] **ETAPA 1**: Implementar React Query com cache ✅ **CONCLUÍDA**
- [x] **ETAPA 2**: Adicionar debounce nas consultas ✅ **CONCLUÍDA**
- [ ] **ETAPA 3**: Otimizar políticas RLS
- [ ] **ETAPA 4**: Desabilitar refetch automático
- [ ] **ETAPA 5**: Implementar loading states
- [ ] **ETAPA 6**: Configurar error boundaries
- [ ] **ETAPA 7**: Implementar paginação
- [ ] **ETAPA 8**: Monitorar métricas

## 🎉 **ETAPAS CONCLUÍDAS**

### ✅ **ETAPA 1: React Query com Cache Inteligente**
- Configurado QueryClient global com cache de 5 minutos
- Desabilitado `refetchOnWindowFocus` e `refetchOnMount`
- Implementado retry inteligente com backoff exponencial
- Otimizado todos os hooks principais (`useAgendaData`, `useFinancialData`, `useTasksData`)

### ✅ **ETAPA 2: Debounce nas Consultas**
- Criado hook `useDebounce` para valores simples
- Criado hook `useDebounceObject` para objetos complexos
- Implementado debounce de 500ms para buscas
- Implementado debounce de 300ms para filtros
- Criados componentes de exemplo otimizados

### 🚨 **CORREÇÃO CRÍTICA: Loop Infinito Detectado**
- **Problema identificado**: Lógica de datas incorreta no `useAgendaData`
- **Causa**: `startDate` e `endDate` iguais causando query inválida
- **Solução implementada**:
  - Validação de datas antes da query
  - Proteção contra loops infinitos com contador de requisições
  - Query otimizada com lógica de datas correta
  - Bloqueio automático após 10 requisições em sequência rápida

---

**Data de Criação**: 2025-01-11  
**Última Atualização**: 2025-01-11  
**Status**: Em Implementação  
**Prioridade**: CRÍTICA
