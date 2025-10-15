# 🔌 DOCUMENTAÇÃO DE API E INTEGRAÇÕES
## Meu Agente Financeiro - APIs, Webhooks e Integrações

---

## 📋 **ÍNDICE**

1. [Visão Geral das APIs](#visão-geral-das-apis)
2. [Autenticação e Segurança](#autenticação-e-segurança)
3. [API do Supabase](#api-do-supabase)
4. [Endpoints Customizados](#endpoints-customizados)
5. [Webhooks](#webhooks)
6. [Integrações Externas](#integrações-externas)
7. [SDKs e Bibliotecas](#sdks-e-bibliotecas)
8. [Rate Limiting](#rate-limiting)
9. [Códigos de Erro](#códigos-de-erro)
10. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 **VISÃO GERAL DAS APIs**

### **Arquitetura de APIs**

O Meu Agente Financeiro utiliza uma arquitetura híbrida combinando:
- **Supabase APIs**: Backend-as-a-Service para operações CRUD
- **Edge Functions**: Lógica de negócio customizada
- **Webhooks**: Integrações em tempo real
- **REST APIs**: Endpoints padronizados

### **Stack Tecnológico**
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Autenticação**: Supabase Auth (JWT)
- **API Gateway**: Supabase REST API
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage

---

## 🔐 **AUTENTICAÇÃO E SEGURANÇA**

### **Sistema de Autenticação**

#### **JWT Tokens**
```typescript
// Configuração do cliente Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### **Fluxo de Autenticação**
```typescript
// Login com telefone e senha
const login = async (phone: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone: phone,
    password: password
  })
  
  if (error) throw error
  return data
}

// Verificar sessão ativa
const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Logout
const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

### **Row Level Security (RLS)**

#### **Políticas de Segurança**
```sql
-- Política para financeiro_registros
CREATE POLICY "Users can view own financial records"
ON financeiro_registros
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  phone = (SELECT phone FROM clientes WHERE auth_user_id = auth.uid())
);

-- Política para inserção
CREATE POLICY "Users can insert own financial records"
ON financeiro_registros
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  phone = (SELECT phone FROM clientes WHERE auth_user_id = auth.uid())
);
```

#### **Função de Autenticação**
```sql
CREATE OR REPLACE FUNCTION get_authenticated_user_phone()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_phone TEXT;
BEGIN
  SELECT phone INTO user_phone
  FROM clientes
  WHERE auth_user_id = auth.uid();
  
  RETURN user_phone;
END;
$$;
```

---

## 🗄️ **API DO SUPABASE**

### **Estrutura do Banco de Dados**

#### **Tabelas Principais**
```sql
-- Tabela de clientes
CREATE TABLE clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id),
  phone TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de registros financeiros
CREATE TABLE financeiro_registros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  valor NUMERIC(12,2) NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'recebido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de metas
CREATE TABLE metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  nome TEXT NOT NULL,
  valor_meta NUMERIC(12,2) NOT NULL,
  valor_atual NUMERIC(12,2) DEFAULT 0,
  prazo DATE NOT NULL,
  categoria TEXT,
  descricao TEXT,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Operações CRUD**

#### **📊 Registros Financeiros**
```typescript
// Criar registro
const createFinancialRecord = async (record: FinancialRecord) => {
  const { data, error } = await supabase
    .from('financeiro_registros')
    .insert(record)
    .select()
  
  if (error) throw error
  return data
}

// Buscar registros
const getFinancialRecords = async (filters?: RecordFilters) => {
  let query = supabase
    .from('financeiro_registros')
    .select('*')
    .order('data_hora', { ascending: false })
  
  if (filters?.startDate) {
    query = query.gte('data_hora', filters.startDate)
  }
  
  if (filters?.endDate) {
    query = query.lte('data_hora', filters.endDate)
  }
  
  if (filters?.category) {
    query = query.eq('categoria', filters.category)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

// Atualizar registro
const updateFinancialRecord = async (id: string, updates: Partial<FinancialRecord>) => {
  const { data, error } = await supabase
    .from('financeiro_registros')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data
}

// Deletar registro
const deleteFinancialRecord = async (id: string) => {
  const { error } = await supabase
    .from('financeiro_registros')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
```

#### **🎯 Metas**
```typescript
// Criar meta
const createGoal = async (goal: Goal) => {
  const { data, error } = await supabase
    .from('metas')
    .insert(goal)
    .select()
  
  if (error) throw error
  return data
}

// Buscar metas
const getGoals = async (status?: string) => {
  let query = supabase
    .from('metas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

// Atualizar progresso da meta
const updateGoalProgress = async (id: string, newAmount: number) => {
  const { data, error } = await supabase
    .from('metas')
    .update({ valor_atual: newAmount })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data
}
```

### **Queries Avançadas**

#### **📈 Relatórios e Estatísticas**
```typescript
// Relatório por categoria
const getCategoryReport = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('financeiro_registros')
    .select('categoria, valor, tipo')
    .gte('data_hora', startDate)
    .lte('data_hora', endDate)
  
  if (error) throw error
  
  // Agrupar por categoria
  const grouped = data.reduce((acc, record) => {
    const category = record.categoria
    if (!acc[category]) {
      acc[category] = { entrada: 0, saida: 0 }
    }
    acc[category][record.tipo] += parseFloat(record.valor)
    return acc
  }, {})
  
  return grouped
}

// Evolução temporal
const getTemporalEvolution = async (days: number = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('financeiro_registros')
    .select('data_hora, valor, tipo')
    .gte('data_hora', startDate.toISOString())
    .order('data_hora', { ascending: true })
  
  if (error) throw error
  return data
}
```

---

## 🚀 **ENDPOINTS CUSTOMIZADOS**

### **Edge Functions**

#### **📊 Relatório Completo**
```typescript
// supabase/functions/generate-report/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { startDate, endDate, format } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Buscar dados
    const { data: records, error } = await supabaseClient
      .from('financeiro_registros')
      .select('*')
      .gte('data_hora', startDate)
      .lte('data_hora', endDate)
    
    if (error) throw error
    
    // Gerar relatório
    const report = generateReport(records)
    
    // Formatar resposta
    let response
    switch (format) {
      case 'pdf':
        response = await generatePDF(report)
        break
      case 'json':
        response = report
        break
      case 'csv':
        response = generateCSV(report)
        break
      default:
        response = report
    }
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

#### **🔍 Validação de Duplicatas**
```typescript
// supabase/functions/check-duplicates/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { valor, categoria, descricao, data_hora } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Buscar registros similares
    const { data: existingRecords, error } = await supabaseClient
      .from('financeiro_registros')
      .select('id, valor, categoria, data_hora, descricao')
      .eq('valor', valor)
      .eq('categoria', categoria)
      .gte('data_hora', new Date(data_hora).toISOString().split('T')[0])
      .lt('data_hora', new Date(data_hora).toISOString().split('T')[0] + 'T23:59:59')
    
    if (error) throw error
    
    // Verificar duplicatas
    const isDuplicate = existingRecords?.some(record => 
      record.valor === valor &&
      record.categoria === categoria &&
      record.descricao === descricao &&
      Math.abs(new Date(record.data_hora).getTime() - new Date(data_hora).getTime()) < 60000
    )
    
    return new Response(JSON.stringify({ isDuplicate }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### **Chamadas para Edge Functions**
```typescript
// Cliente para chamar Edge Functions
const callEdgeFunction = async (functionName: string, payload: any) => {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload
  })
  
  if (error) throw error
  return data
}

// Exemplo de uso
const checkDuplicates = async (record: FinancialRecord) => {
  return await callEdgeFunction('check-duplicates', {
    valor: record.valor,
    categoria: record.categoria,
    descricao: record.descricao,
    data_hora: record.data_hora
  })
}
```

---

## 🔗 **WEBHOOKS**

### **Webhooks Implementados**

#### **💰 Transação Criada**
```typescript
// Webhook para quando uma transação é criada
const handleTransactionCreated = async (payload: any) => {
  const { record } = payload
  
  // Atualizar progresso de metas
  await updateGoalProgress(record)
  
  // Enviar notificação
  await sendNotification({
    type: 'transaction_created',
    message: `Nova ${record.tipo} de R$ ${record.valor} registrada`,
    userId: record.phone
  })
  
  // Atualizar estatísticas
  await updateStatistics(record.phone)
}
```

#### **🎯 Meta Concluída**
```typescript
// Webhook para quando uma meta é concluída
const handleGoalCompleted = async (payload: any) => {
  const { record } = payload
  
  // Enviar notificação de parabéns
  await sendNotification({
    type: 'goal_completed',
    message: `Parabéns! Você alcançou a meta "${record.nome}"`,
    userId: record.phone
  })
  
  // Sugerir nova meta
  await suggestNewGoal(record.phone)
}
```

### **Configuração de Webhooks**
```typescript
// Configurar webhook no Supabase
const setupWebhooks = async () => {
  // Webhook para inserção em financeiro_registros
  await supabase
    .from('financeiro_registros')
    .on('INSERT', handleTransactionCreated)
    .subscribe()
  
  // Webhook para atualização em metas
  await supabase
    .from('metas')
    .on('UPDATE', (payload) => {
      if (payload.new.status === 'concluida' && payload.old.status !== 'concluida') {
        handleGoalCompleted(payload)
      }
    })
    .subscribe()
}
```

---

## 🌐 **INTEGRAÇÕES EXTERNAS**

### **Integrações Implementadas**

#### **📧 Serviço de Email**
```typescript
// Integração com serviço de email
const sendEmail = async (to: string, subject: string, content: string) => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify({
      to,
      subject,
      content,
      template: 'default'
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to send email')
  }
  
  return await response.json()
}
```

#### **📱 Serviço de SMS**
```typescript
// Integração com serviço de SMS
const sendSMS = async (phone: string, message: string) => {
  const response = await fetch('/api/send-sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify({
      phone,
      message
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to send SMS')
  }
  
  return await response.json()
}
```

#### **📊 Serviço de Analytics**
```typescript
// Integração com Google Analytics
const trackEvent = (eventName: string, parameters: Record<string, any>) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters)
  }
}

// Exemplo de uso
trackEvent('financial_record_created', {
  category: 'Finance',
  value: record.valor,
  currency: 'BRL'
})
```

### **Integrações Futuras**

#### **🏦 APIs Bancárias**
- **Open Banking**: Integração com bancos
- **PIX**: Pagamentos instantâneos
- **Cartões**: Integração com cartões de crédito

#### **📈 Investimentos**
- **Corretoras**: APIs de corretoras
- **Fundos**: Informações de fundos
- **Criptomoedas**: APIs de exchanges

---

## 📚 **SDKS E BIBLIOTECAS**

### **SDK Oficial**
```typescript
// Instalação
npm install @supabase/supabase-js

// Configuração
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)
```

### **Hooks Customizados**
```typescript
// Hook para dados financeiros
export const useFinancialData = () => {
  const [data, setData] = useState<FinancialRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const { data: records, error } = await supabase
        .from('financeiro_registros')
        .select('*')
        .order('data_hora', { ascending: false })

      if (error) throw error
      setData(records)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
```

### **Utilitários**
```typescript
// Utilitário para formatação de dados
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Utilitário para validação
export const validateFinancialRecord = (record: Partial<FinancialRecord>) => {
  const errors: string[] = []
  
  if (!record.valor || record.valor <= 0) {
    errors.push('Valor deve ser maior que zero')
  }
  
  if (!record.categoria) {
    errors.push('Categoria é obrigatória')
  }
  
  if (!record.data_hora) {
    errors.push('Data é obrigatória')
  }
  
  return errors
}
```

---

## ⚡ **RATE LIMITING**

### **Limites Implementados**

#### **📊 Limites por Usuário**
- **Requisições por minuto**: 100
- **Requisições por hora**: 1000
- **Requisições por dia**: 10000

#### **🔒 Limites por Endpoint**
- **Autenticação**: 5 tentativas por minuto
- **Criação de registros**: 50 por minuto
- **Relatórios**: 10 por minuto
- **Exportação**: 5 por minuto

### **Implementação**
```typescript
// Middleware de rate limiting
const rateLimitMiddleware = async (req: Request, userId: string) => {
  const key = `rate_limit:${userId}:${Date.now()}`
  const current = await redis.get(key)
  
  if (current && parseInt(current) > 100) {
    throw new Error('Rate limit exceeded')
  }
  
  await redis.incr(key)
  await redis.expire(key, 60) // 1 minuto
}
```

---

## ❌ **CÓDIGOS DE ERRO**

### **Códigos de Erro Padrão**

#### **🔐 Autenticação (4xx)**
- **401**: Não autorizado
- **403**: Acesso negado
- **422**: Dados inválidos

#### **🚨 Servidor (5xx)**
- **500**: Erro interno do servidor
- **502**: Bad Gateway
- **503**: Serviço indisponível

### **Códigos Customizados**
```typescript
// Códigos de erro customizados
export const ERROR_CODES = {
  DUPLICATE_RECORD: 'DUPLICATE_RECORD',
  INVALID_VALUE: 'INVALID_VALUE',
  GOAL_NOT_FOUND: 'GOAL_NOT_FOUND',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const

// Tratamento de erros
const handleError = (error: any) => {
  switch (error.code) {
    case ERROR_CODES.DUPLICATE_RECORD:
      return { message: 'Registro duplicado detectado', code: 409 }
    case ERROR_CODES.INVALID_VALUE:
      return { message: 'Valor inválido', code: 422 }
    case ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return { message: 'Limite de requisições excedido', code: 429 }
    default:
      return { message: 'Erro interno do servidor', code: 500 }
  }
}
```

---

## 💡 **EXEMPLOS DE USO**

### **Exemplos Completos**

#### **📊 Dashboard Completo**
```typescript
// Hook para dashboard completo
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Buscar dados em paralelo
      const [
        financialRecords,
        goals,
        notifications
      ] = await Promise.all([
        supabase.from('financeiro_registros').select('*'),
        supabase.from('metas').select('*'),
        supabase.from('notifications').select('*')
      ])

      // Processar dados
      const processedData = {
        totalReceitas: calculateTotal(financialRecords.data, 'entrada'),
        totalDespesas: calculateTotal(financialRecords.data, 'saida'),
        saldo: calculateBalance(financialRecords.data),
        metasAtivas: goals.data.filter(g => g.status === 'ativa'),
        notificacoesNaoLidas: notifications.data.filter(n => !n.is_read)
      }

      setDashboardData(processedData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { dashboardData, loading, refetch: fetchDashboardData }
}
```

#### **📈 Relatório com Exportação**
```typescript
// Função para gerar e exportar relatório
const generateAndExportReport = async (format: 'pdf' | 'json' | 'csv') => {
  try {
    // Buscar dados
    const { data: records, error } = await supabase
      .from('financeiro_registros')
      .select('*')
      .gte('data_hora', startDate)
      .lte('data_hora', endDate)

    if (error) throw error

    // Gerar relatório
    const report = {
      periodo: { inicio: startDate, fim: endDate },
      resumo: {
        totalReceitas: calculateTotal(records, 'entrada'),
        totalDespesas: calculateTotal(records, 'saida'),
        saldo: calculateBalance(records)
      },
      porCategoria: groupByCategory(records),
      evolucaoTemporal: groupByDate(records),
      transacoes: records
    }

    // Exportar
    switch (format) {
      case 'pdf':
        return await generatePDF(report)
      case 'json':
        return downloadJSON(report, 'relatorio.json')
      case 'csv':
        return await generateCSV(report)
    }
  } catch (error) {
    throw new Error(`Erro ao gerar relatório: ${error.message}`)
  }
}
```

#### **🔔 Sistema de Notificações**
```typescript
// Sistema completo de notificações
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    setNotifications(data)
    setUnreadCount(data.filter(n => !n.is_read).length)
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) throw error
    
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
    setUnreadCount(prev => prev - 1)
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Escutar novas notificações
  useEffect(() => {
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    refetch: fetchNotifications
  }
}
```

---

## 📊 **MONITORAMENTO DE API**

### **Métricas de API**
- **Latência**: < 200ms (p95)
- **Throughput**: > 1000 req/min
- **Disponibilidade**: > 99.9%
- **Taxa de erro**: < 0.1%

### **Logs de API**
```typescript
// Middleware de logging
const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    }
    
    console.log(JSON.stringify(logEntry))
  })
  
  next()
}
```

---

**Documentação de API atualizada em**: 16/01/2025  
**Versão**: 1.0.0  
**Próxima revisão**: 16/04/2025
