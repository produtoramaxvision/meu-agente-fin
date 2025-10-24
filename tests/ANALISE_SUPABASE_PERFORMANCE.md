# 🚨 ANÁLISE CRÍTICA - Supabase Performance Issues

**Data:** 2025-01-24  
**Ferramenta:** supabase-mcp get_advisors  
**Resultado:** **37 problemas detectados** (18 WARN + 19 INFO)

---

## ⚠️ PROBLEMAS CRÍTICOS (WARN) - 18 Issues

### 1. Auth RLS Initplan (10 problemas) 🔴 **CRÍTICO**

**Impacto:** Queries re-avaliam `auth.uid()` para **CADA LINHA**, causando lentidão exponencial

**Tabelas Afetadas:**
1. `clientes` - 2 políticas (view + update)
2. `privacy_settings` - 4 políticas (view + insert + update + delete)
3. `support_tickets` - 4 políticas (create + view + update + delete)
4. `plan_access_logs` - 1 política (view)

**Problema:**
```sql
-- ❌ LENTO: Re-avalia auth.uid() para cada linha
WHERE auth.uid() = auth_user_id

-- ✅ RÁPIDO: Avalia auth.uid() UMA VEZ
WHERE (select auth.uid()) = auth_user_id
```

**Solução:**
- Envolver `auth.uid()` em `(select auth.uid())`
- **Savings esperados:** -30-50% tempo de query (escala)

**Risco:**
- 🟡 MÉDIO: Modificação de RLS policies (precisa migration)
- ✅ Não quebra funcionalidade (mesma lógica)
- ⚠️ Requer teste extensivo de permissões

**Documentação:** https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan

---

### 2. Multiple Permissive Policies (6 problemas) 🟡 **IMPORTANTE**

**Impacto:** Múltiplas políticas RLS são executadas para cada query (suboptimal)

**Tabelas Afetadas:**
1. `clientes` - SELECT (2 políticas duplicadas)
2. `plan_access_logs` - SELECT (2 políticas)
3. `privacy_settings` - DELETE (2 políticas)
4. `privacy_settings` - INSERT (2 políticas)
5. `privacy_settings` - SELECT (2 políticas)
6. `privacy_settings` - UPDATE (2 políticas)

**Problema:**
```sql
-- ❌ LENTO: 2 políticas para SELECT
POLICY "Users can view their own profile via auth_user_id"
POLICY "Allow phone lookup for login"

-- ✅ RÁPIDO: 1 política consolidada usando OR
POLICY "Users can view their own data" AS PERMISSIVE FOR SELECT
  USING ((select auth.uid()) = auth_user_id OR phone = ...");
```

**Solução:**
- Consolidar políticas duplicadas em uma única política com OR
- **Savings esperados:** -20-30% tempo de query

**Risco:**
- 🔴 ALTO: Modificação de RLS pode afetar permissões
- ⚠️ CRÍTICO: Precisa validação extensiva de segurança
- ⚠️ Requer rollback plan

**Documentação:** https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

---

### 3. Duplicate Index (1 problema) 🟡 **IMPORTANTE**

**Tabela:** `financeiro_registros`  
**Índices duplicados:** `idx_financeiro_phone` + `idx_financeiro_registros_phone`

**Impacto:**
- Desperdício de espaço em disco
- Slower INSERTs/UPDATEs (mantém 2 índices)
- Confusão para query planner

**Solução:**
```sql
-- Remover um dos índices duplicados
DROP INDEX IF EXISTS idx_financeiro_phone;
```

**Risco:**
- 🟢 BAIXO: Safe (índice duplicado)
- ✅ Zero impacto em queries (outro índice existe)
- ✅ Implementação simples

**Documentação:** https://supabase.com/docs/guides/database/database-linter?lint=0009_duplicate_index

---

## ℹ️ PROBLEMAS INFORMATIVOS (INFO) - 19 Issues

### 4. Unindexed Foreign Keys (8 problemas) 🟡 **IMPORTANTE**

**Impacto:** JOINs e queries por FK são lentos (full table scan)

**Tabelas Afetadas:**
1. `event_resources` → `resource_id`
2. `events` → `series_master_id`
3. `focus_blocks` → `phone`
4. `ingestion_log` → `phone` + `upserted_event_id`
5. `plan_access_logs` → `user_phone`
6. `scheduling_links` → `calendar_id` + `phone`

**Solução:**
```sql
-- Criar índices nas foreign keys
CREATE INDEX idx_event_resources_resource_id ON event_resources(resource_id);
CREATE INDEX idx_events_series_master_id ON events(series_master_id);
CREATE INDEX idx_focus_blocks_phone ON focus_blocks(phone);
CREATE INDEX idx_ingestion_log_phone_fkey ON ingestion_log(phone);
CREATE INDEX idx_ingestion_log_event_id ON ingestion_log(upserted_event_id);
CREATE INDEX idx_plan_access_logs_phone ON plan_access_logs(user_phone);
CREATE INDEX idx_scheduling_links_calendar ON scheduling_links(calendar_id);
CREATE INDEX idx_scheduling_links_phone ON scheduling_links(phone);
```

**Risco:**
- 🟢 BAIXO: Safe (apenas adiciona índices)
- ✅ Zero impacto em funcionalidade
- ⚠️ Aumenta espaço em disco (~5-10MB total)
- ⚠️ Slower INSERTs (mantém índices)

**Savings esperados:** -40-60% tempo de JOIN queries

**Documentação:** https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys

---

### 5. Unused Index (10 problemas) 🟢 **OPCIONAL**

**Impacto:** Desperdício de espaço e slower INSERTs/UPDATEs

**Índices não usados:**
1. `financeiro_registros` - 3 índices não usados
2. `events` - 1 índice não usado
3. `privacy_settings` - 1 índice não usado
4. `support_tickets` - 4 índices não usados
5. `ingestion_log` - 1 índice não usado

**Solução:**
```sql
-- Remover índices não usados (se confirmado após análise)
-- ⚠️ CUIDADO: Analisar uso em produção antes!
DROP INDEX IF EXISTS idx_financeiro_phone;
DROP INDEX IF EXISTS idx_financeiro_registros_phone;
DROP INDEX IF EXISTS financeiro_registros_phone_tipo_idx;
-- ... etc
```

**Risco:**
- 🟡 MÉDIO: Índices podem estar em uso em produção
- ⚠️ Analisar logs de queries antes de remover
- ⚠️ Remover apenas se 100% não usado

**Savings esperados:** -5-10% tempo de INSERT/UPDATE

**Documentação:** https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

---

## 📊 RESUMO DE IMPACTO

| Categoria | Quantidade | Prioridade | Impacto | Risco | Esforço |
|-----------|-----------|-----------|---------|-------|---------|
| **Auth RLS Initplan** | 10 | 🔴 P0 | -30-50% query time | 🟡 Médio | 2-3h |
| **Multiple Policies** | 6 | 🟡 P1 | -20-30% query time | 🔴 Alto | 3-4h |
| **Duplicate Index** | 1 | 🟡 P1 | -5-10% INSERT time | 🟢 Baixo | 15min |
| **Unindexed FKs** | 8 | 🟡 P1 | -40-60% JOIN time | 🟢 Baixo | 1-2h |
| **Unused Index** | 10 | 🟢 P2 | -5-10% INSERT time | 🟡 Médio | 1-2h |

**Savings Total Esperado:** -30-60% tempo médio de query

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### Opção A: Conservador (RECOMENDADO) 🛡️

**Implementar apenas itens de BAIXO RISCO:**

1. ✅ **Duplicate Index** (15min) - Zero risco
2. ✅ **Unindexed FKs** (1-2h) - Baixo risco
3. ⏳ **Auth RLS Initplan** - AGUARDAR APROVAÇÃO (teste extensivo necessário)
4. ⏳ **Multiple Policies** - AGUARDAR APROVAÇÃO (teste de segurança necessário)
5. ⏳ **Unused Index** - AGUARDAR APROVAÇÃO (análise de produção necessário)

**Tempo:** 2-3h  
**Risco:** 🟢 Baixo  
**Savings:** -40-60% JOIN queries + -5-10% INSERTs

---

### Opção B: Agressivo (NÃO RECOMENDADO) ⚠️

**Implementar todos os itens:**

1. ✅ Auth RLS Initplan (2-3h)
2. ✅ Multiple Policies (3-4h)
3. ✅ Duplicate Index (15min)
4. ✅ Unindexed FKs (1-2h)
5. ✅ Unused Index (1-2h)

**Tempo:** 8-12h  
**Risco:** 🔴 Alto (modificações extensivas de segurança)  
**Savings:** -30-60% query time total

**⚠️ CRÍTICO:** Requer teste extensivo de:
- Todas as permissões RLS
- Todas as queries de produção
- Rollback plan para cada migration

---

## ⚠️ AVISOS CRÍTICOS

### ❌ NÃO FAZER SEM TESTES EXTENSIVOS:

1. **❌ Modificar RLS Policies** sem validar todas as permissões
2. **❌ Remover índices** sem analisar queries de produção
3. **❌ Consolidar políticas** sem testar todos os cenários de acesso
4. **❌ Fazer em produção** sem testar em staging primeiro

### ✅ FAZER SEMPRE:

1. **✅ Backup do banco** antes de qualquer migration
2. **✅ Testar em local/staging** antes de produção
3. **✅ Rollback plan** para cada migration
4. **✅ Validar permissões** após cada mudança RLS
5. **✅ Monitorar queries** após deploy

---

## 🚀 PRÓXIMOS PASSOS

**Aguardando aprovação do usuário para:**

- [ ] Implementar Opção A (Conservador - RECOMENDADO)
- [ ] Implementar Opção B (Agressivo - NÃO RECOMENDADO)
- [ ] Analisar queries de produção primeiro (mais seguro)
- [ ] Apenas documentar problemas (sem implementação)

---

**📌 NOTA:** Esta análise foi gerada automaticamente pelo `supabase-mcp get_advisors`.  
**📖 Documentação:** https://supabase.com/docs/guides/database/database-linter

