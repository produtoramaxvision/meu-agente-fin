# 🚀 Guia Completo de Migração do Banco de Dados

## 📋 Visão Geral

Este guia contém as instruções para migrar **TODA** a estrutura E DADOS do banco de dados do seu app "Meu Agente Financeiro" para um novo projeto Supabase.

### 📦 Arquivos de Migração:

**1. `MIGRATION_COMPLETE.sql`** - Estrutura do banco:
- ✅ Extensões PostgreSQL
- ✅ Tipos customizados (ENUMs)
- ✅ Sequences
- ✅ **TODAS as 22 tabelas** com colunas, constraints e comentários
- ✅ Índices otimizados
- ✅ 30+ funções SQL
- ✅ Triggers automatizados
- ✅ Políticas RLS (Row Level Security) completas
- ✅ Storage buckets e policies
- ✅ Grants de permissões

**2. `DATA_MIGRATION.sql`** - Dados existentes:
- ✅ 2 clientes
- ✅ 78 registros financeiros
- ✅ 19 metas
- ✅ 13 tarefas
- ✅ 32 eventos de agenda
- ✅ 2 calendários
- ✅ 1 notificação
- ✅ 2 configurações de privacidade
- ✅ 3 tickets de suporte
- ✅ Resetar sequences para valores corretos

---

## 🎯 Passo a Passo

### 1️⃣ Preparar o Novo Projeto Supabase

1. Acesse https://app.supabase.com
2. Crie um novo projeto ou use um projeto vazio existente
3. Aguarde a criação do projeto (pode levar 2-3 minutos)
4. Anote as credenciais:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **Project API Key (anon)**: encontrado em Settings > API
   - **Service Role Key**: encontrado em Settings > API (guarde com segurança)

### 2️⃣ Executar a Migração da ESTRUTURA

#### Opção A: Via Dashboard do Supabase (Recomendado)

1. No projeto criado, vá para **SQL Editor** (menu lateral esquerdo)
2. Clique em **"+ New query"**
3. Abra o arquivo **`MIGRATION_COMPLETE.sql`** em um editor de texto
4. **Copie TODO o conteúdo** do arquivo
5. **Cole** no SQL Editor do Supabase
6. Clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)
7. Aguarde a execução (pode levar 30-60 segundos)
8. ✅ Verifique se não há erros no log de execução

### 2️⃣.1 Executar a Migração dos DADOS

**⚠️ IMPORTANTE**: Execute este passo SOMENTE APÓS executar o `MIGRATION_COMPLETE.sql` com sucesso!

1. No mesmo **SQL Editor**
2. Clique em **"+ New query"** (nova aba)
3. Abra o arquivo **`DATA_MIGRATION.sql`** em um editor de texto
4. **Copie TODO o conteúdo** do arquivo
5. **Cole** no SQL Editor do Supabase
6. Clique em **"Run"** 
7. Aguarde a execução (pode levar 1-2 minutos devido aos 78+ INSERTs)
8. ✅ No final, você verá uma tabela mostrando a contagem de registros inseridos

#### Opção B: Via Supabase CLI

Se você preferir usar a CLI:

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-project-ref

# Executar a migration
supabase db push --include-all --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.seu-projeto.supabase.co:5432/postgres"
```

### 3️⃣ Verificar a Migração

Após executar o SQL, verifique se tudo foi criado corretamente:

1. **Verificar Tabelas Criadas**:
   - Vá para **Table Editor** no dashboard
   - Você deve ver 22 tabelas criadas:
     - `clientes`
     - `financeiro_registros`
     - `metas`
     - `notifications`
     - `tasks`
     - `calendars`
     - `events`
     - `event_participants`
     - `event_reminders`
     - `resources`
     - `event_resources`
     - `privacy_settings`
     - `support_tickets`
     - `plan_access_logs`
     - `scheduling_links`
     - `focus_blocks`
     - `sync_state`
     - `ingestion_log`
     - `bd_ativo`
     - `chat_meu_agente`
     - `chat_agente_sdr`
     - `chat_remarketing`

2. **Verificar RLS Policies**:
   - No SQL Editor, execute:
   ```sql
   SELECT tablename, COUNT(*) as policy_count
   FROM pg_policies 
   WHERE schemaname = 'public'
   GROUP BY tablename
   ORDER BY tablename;
   ```
   - Você deve ver múltiplas policies por tabela

3. **Verificar Functions**:
   - No SQL Editor, execute:
   ```sql
   SELECT proname as function_name
   FROM pg_proc p
   JOIN pg_namespace n ON p.pronamespace = n.oid
   WHERE n.nspname = 'public'
   ORDER BY proname;
   ```
   - Deve listar 30+ funções

4. **Verificar Storage Bucket**:
   - Vá para **Storage** no dashboard
   - Você deve ver o bucket `avatars` criado

### 4️⃣ Atualizar as Credenciais no App

Após confirmar que a migração foi bem-sucedida, atualize as variáveis de ambiente do seu app:

1. Abra o arquivo `.env` (ou `.env.local`) na raiz do projeto
2. Atualize as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-novo-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-nova-anon-key
```

3. Se você usa Service Role Key no backend/admin:
```env
SUPABASE_SERVICE_ROLE_KEY=sua-nova-service-role-key
```

### 5️⃣ Testar a Aplicação

1. **Limpar cache e dependências**:
```bash
# Se usar npm
npm run dev

# Se usar bun
bun run dev
```

2. **Testar funcionalidades principais**:
   - ✅ Registro de novo usuário
   - ✅ Login
   - ✅ Criar registro financeiro
   - ✅ Criar meta
   - ✅ Criar tarefa
   - ✅ Criar evento na agenda
   - ✅ Upload de avatar
   - ✅ Configurações de privacidade (LGPD)
   - ✅ Criar ticket de suporte

---

## 🔐 Dados Já Migrados

✅ **SUCESSO**: O arquivo `DATA_MIGRATION.sql` já inclui TODOS os dados do banco antigo!

### Para Migrar Dados de Usuários do Projeto Antigo:

#### Opção 1: Export/Import Manual (para poucos dados)

1. **Exportar dados do projeto antigo**:
   - No projeto antigo, vá para **Table Editor**
   - Para cada tabela, clique nos 3 pontos > **Export as CSV**
   - Baixe os CSVs de todas as tabelas

2. **Importar no novo projeto**:
   - No novo projeto, vá para **Table Editor**
   - Para cada tabela, clique nos 3 pontos > **Import data from CSV**
   - ⚠️ **ATENÇÃO**: Importe na ordem correta (clientes primeiro, depois as dependentes)

#### Opção 2: Via pg_dump (para muitos dados)

```bash
# 1. Exportar do projeto antigo
pg_dump -h db.projeto-antigo.supabase.co \
  -U postgres \
  -d postgres \
  --data-only \
  --schema=public \
  -f backup_data.sql

# 2. Importar no novo projeto
psql -h db.projeto-novo.supabase.co \
  -U postgres \
  -d postgres \
  -f backup_data.sql
```

#### Opção 3: Migração de Usuários para Supabase Auth

Se você quiser migrar usuários existentes para usar `auth.users` do Supabase:

1. No SQL Editor do novo projeto, execute:
```sql
-- Ver usuários que precisam ser migrados
SELECT * FROM prepare_user_migration_data();
```

2. Para cada usuário, crie via API usando o Service Role:
```javascript
// Node.js/TypeScript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://seu-projeto.supabase.co',
  'SUA-SERVICE-ROLE-KEY' // Use Service Role Key!
)

// Criar usuário no auth
const { data, error } = await supabase.auth.admin.createUser({
  email: 'phone@meuagente.api.br', // email sintético
  password: 'senha-temporaria-ou-hash',
  email_confirm: true,
  user_metadata: {
    phone: '5511999999999',
    name: 'Nome do Usuário',
    cpf: '123.456.789-00',
    plan_id: 'free'
  }
})

// Vincular ao clientes
if (data.user) {
  await supabase
    .from('clientes')
    .update({ auth_user_id: data.user.id })
    .eq('phone', '5511999999999')
}
```

---

## 📊 Estrutura de Tabelas Principais

### `clientes`
Usuários do sistema com integração ao Supabase Auth.
- **PK**: `phone` (VARCHAR 10-15 dígitos)
- **FK**: `auth_user_id` → `auth.users.id`

### `financeiro_registros`
Registros financeiros (entradas e saídas).
- **PK**: `id` (BIGINT)
- **FK**: `phone` → `clientes.phone`
- **ENUM**: `tipo` (entrada, saida)

### `events`
Eventos da agenda/calendário.
- **PK**: `id` (UUID)
- **FK**: `calendar_id` → `calendars.id`
- **FK**: `phone` → `clientes.phone`

### `tasks`
Tarefas e afazeres.
- **PK**: `id` (UUID)
- **ENUM**: `priority` (low, medium, high)
- **ENUM**: `status` (pending, done, overdue)

### `privacy_settings`
Configurações LGPD por usuário.
- **PK**: `id` (UUID)
- **UNIQUE**: `phone`

---

## 🛡️ Segurança e RLS

Todas as tabelas têm **Row Level Security (RLS)** habilitado com políticas que garantem:

1. ✅ Usuários só acessam seus próprios dados
2. ✅ Isolamento total por telefone (`phone`) ou `auth_user_id`
3. ✅ Políticas otimizadas usando `get_user_phone_optimized()`
4. ✅ Suporte a admin roles para tickets de suporte

### Testando RLS

Execute no SQL Editor como usuário autenticado:

```sql
-- Ver dados do usuário logado
SELECT * FROM financeiro_registros;

-- Isso deve retornar vazio se você tentar acessar dados de outro usuário
SELECT * FROM financeiro_registros WHERE phone = 'outro-telefone';
```

---

## 🔧 Troubleshooting

### Erro: "relation already exists"
- **Solução**: Algumas tabelas já existem. Limpe o banco ou use outro projeto.

### Erro: "permission denied"
- **Solução**: Execute o SQL como `postgres` user (automático no SQL Editor do dashboard).

### Erro: "enum type already exists"
- **Solução**: Os ENUMs já existem. Você pode ignorar ou fazer DROP primeiro:
```sql
DROP TYPE IF EXISTS financeiro_tipo CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
```

### RLS Policies causando erro de acesso
- **Solução**: Verifique se o usuário está autenticado e se `auth.uid()` está definido.
- Para debug, desabilite temporariamente RLS:
```sql
ALTER TABLE nome_tabela DISABLE ROW LEVEL SECURITY;
```

### Storage bucket não aparece
- **Solução**: Verifique se você tem permissões. Ou crie manualmente:
  - Vá para **Storage** > **New bucket**
  - Nome: `avatars`
  - Public: ✅ Ativado

---

## 📞 Suporte

Se encontrar problemas:

1. ✅ Verifique os logs de erro no SQL Editor
2. ✅ Consulte a documentação: https://supabase.com/docs
3. ✅ Verifique o status do Supabase: https://status.supabase.com
4. ✅ Suporte Supabase: https://supabase.help

---

## ✅ Checklist Final

### Estrutura (MIGRATION_COMPLETE.sql)
- [ ] SQL de estrutura executado sem erros
- [ ] 22 tabelas criadas
- [ ] RLS policies criadas (100+ policies)
- [ ] Funções criadas (30+)
- [ ] Triggers criados
- [ ] Storage bucket `avatars` criado

### Dados (DATA_MIGRATION.sql)
- [ ] SQL de dados executado sem erros
- [ ] 2 clientes inseridos
- [ ] 78 registros financeiros inseridos
- [ ] 19 metas inseridas
- [ ] 13 tarefas inseridas
- [ ] 32 eventos inseridos
- [ ] Sequences resetadas corretamente
- [ ] Query de verificação mostra contagens corretas

### App
- [ ] Variáveis de ambiente atualizadas no app
- [ ] App rodando e conectando ao novo banco
- [ ] Login funcionando com usuários migrados
- [ ] Dados aparecendo corretamente (financeiro, metas, tarefas)
- [ ] Agenda mostrando eventos migrados
- [ ] Testes de CRUD funcionando

---

**🎉 Parabéns! Sua migração está completa!**

Agora você tem um banco de dados Supabase completo, seguro e pronto para produção com:
- 🔒 Row Level Security em todas as tabelas
- ⚡ Índices otimizados para performance
- 🛡️ Conformidade LGPD
- 🔄 Integração com Supabase Auth
- 📦 Storage para avatars

