# 📋 PLANO DE CORREÇÃO DETALHADO - MEU AGENTE FIN
## Baseado no Relatório Testsprite MCP

---

## 🎯 **VISÃO GERAL DO PLANO**

**Objetivo**: Corrigir todos os problemas críticos identificados pelo Testsprite, excluindo integração WhatsApp conforme solicitado.

**Status Atual**: 31.25% dos testes passando (5/16)
**Meta**: 90%+ dos testes passando

**Duração Estimada**: 4-6 semanas
**Prioridade**: CRÍTICA

---

## 🚨 **PROBLEMAS CRÍTICOS IDENTIFICADOS**

### 1. **Loop Infinito no useAgendaData** ⚠️ CRÍTICO
- **Arquivo**: `src/hooks/useAgendaData.ts:73`
- **Impacto**: Sobrecarga do Supabase, travamento da UI
- **Causa**: Validação de datas incorreta causando re-renders infinitos

### 2. **Políticas RLS do Supabase** ⚠️ CRÍTICO  
- **Tabela**: `support_tickets`
- **Impacto**: Bloqueia criação de tickets de suporte
- **Causa**: Políticas RLS mal configuradas

### 3. **Funcionalidade de Exclusão LGPD** ⚠️ CRÍTICO
- **Impacto**: Não conformidade com LGPD
- **Causa**: RPC function `delete_user_data` não implementada

### 4. **Bug na Exportação CSV** ⚠️ ALTO
- **Impacto**: Exportação CSV aciona PDF incorretamente
- **Causa**: Lógica de exportação incorreta

### 5. **Travamento após Acesso Negado** ⚠️ ALTO
- **Impacto**: UI fica em loading após tentativa de acesso a recursos premium
- **Causa**: Navegação incorreta após negação de acesso

---

## 📅 **CRONOGRAMA DETALHADO**

### **SEMANA 1: Correções Críticas de Performance**

#### **ETAPA 1.1: Corrigir Loop Infinito no useAgendaData** 
**Duração**: 2-3 dias
**Prioridade**: CRÍTICA

**Problemas Identificados**:
- Validação de datas incorreta na linha 188-191
- Query key instável causando re-renders
- Refetch automático removido mas ainda causando problemas

**Ações Específicas**:
1. **Corrigir validação de datas**:
   ```typescript
   // ANTES (linha 188-191)
   if (!startDate || !endDate || startDate >= endDate) {
     console.warn('useAgendaData: Datas inválidas ou iguais:', { startDate, endDate });
     return [];
   }
   
   // DEPOIS
   if (!startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) {
     console.warn('useAgendaData: Datas inválidas:', { startDate, endDate });
     return [];
   }
   
   if (startDate.getTime() >= endDate.getTime()) {
     console.warn('useAgendaData: Data de início deve ser anterior à data de fim');
     return [];
   }
   ```

2. **Estabilizar query key com useMemo**:
   ```typescript
   const queryKey = useMemo(() => {
     const startStr = options.startDate?.toISOString() || '';
     const endStr = options.endDate?.toISOString() || '';
     return [
       'events', 
       cliente?.phone, 
       options.view, 
       startStr, 
       endStr, 
       options.calendarIds?.join(',') || '', 
       options.categories?.join(',') || '', 
       options.priorities?.join(',') || '', 
       options.statuses?.join(',') || '', 
       options.searchQuery || ''
     ];
   }, [cliente?.phone, options.view, options.startDate, options.endDate, options.calendarIds, options.categories, options.priorities, options.statuses, options.searchQuery]);
   ```

3. **Implementar debounce para queries**:
   ```typescript
   const debouncedQueryKey = useMemo(() => {
     const timeoutId = setTimeout(() => {}, 300);
     return queryKey;
   }, [queryKey]);
   ```

**Critérios de Sucesso**:
- [ ] Console não mostra mais "LOOP INFINITO DETECTADO"
- [ ] Performance da aplicação melhorada
- [ ] Testes TC003, TC004, TC006 passam

**Validação**:
- Executar testes Playwright específicos
- Monitorar console do navegador
- Verificar performance no DevTools

---

#### **ETAPA 1.2: Corrigir Políticas RLS do Supabase**
**Duração**: 1-2 dias  
**Prioridade**: CRÍTICA

**Problemas Identificados**:
- Tabela `support_tickets` bloqueia criação para usuários gratuitos
- Políticas RLS mal configuradas

**Ações Específicas**:
1. **Revisar políticas RLS atuais**:
   ```sql
   -- Verificar políticas atuais
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'support_tickets';
   ```

2. **Corrigir política para support_tickets**:
   ```sql
   -- Remover política problemática
   DROP POLICY IF EXISTS "support_tickets_policy" ON support_tickets;
   
   -- Criar nova política correta
   CREATE POLICY "Users can manage their own support tickets" 
   ON support_tickets
   FOR ALL
   TO authenticated
   USING (
     phone = (SELECT phone FROM clientes WHERE auth_user_id = auth.uid())
   )
   WITH CHECK (
     phone = (SELECT phone FROM clientes WHERE auth_user_id = auth.uid())
   );
   ```

3. **Verificar outras tabelas com problemas similares**:
   - `event_participants`
   - `event_reminders` 
   - `event_resources`

**Critérios de Sucesso**:
- [ ] Usuários podem criar tickets de suporte
- [ ] Teste TC010 passa
- [ ] Políticas RLS funcionam corretamente

**Validação**:
- Testar criação de tickets com diferentes tipos de usuário
- Verificar logs do Supabase
- Executar testes de RLS

---

### **SEMANA 2: Conformidade LGPD e Funcionalidades Core**

#### **ETAPA 2.1: Implementar Exclusão de Dados LGPD**
**Duração**: 3-4 dias
**Prioridade**: CRÍTICA

**Problemas Identificados**:
- RPC function `delete_user_data` não implementada
- Funcionalidade de exclusão não funciona

**Ações Específicas**:
1. **Criar RPC function no Supabase**:
   ```sql
   CREATE OR REPLACE FUNCTION delete_user_data(user_phone TEXT)
   RETURNS JSON
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   DECLARE
     deleted_tables TEXT[] := '{}';
     table_name TEXT;
     tables_to_delete TEXT[] := ARRAY[
       'financeiro_registros',
       'tasks', 
       'metas',
       'events',
       'event_participants',
       'event_reminders', 
       'event_resources',
       'calendars',
       'notifications',
       'support_tickets',
       'privacy_settings',
       'backup_logs',
       'plan_access_logs',
       'clientes'
     ];
   BEGIN
     -- Verificar se usuário existe
     IF NOT EXISTS (SELECT 1 FROM clientes WHERE phone = user_phone) THEN
       RETURN json_build_object('success', false, 'error', 'Usuário não encontrado');
     END IF;
     
     -- Deletar dados de todas as tabelas
     FOREACH table_name IN ARRAY tables_to_delete
     LOOP
       BEGIN
         EXECUTE format('DELETE FROM %I WHERE phone = %L', table_name, user_phone);
         deleted_tables := array_append(deleted_tables, table_name);
       EXCEPTION WHEN OTHERS THEN
         -- Log erro mas continue
         RAISE WARNING 'Erro ao deletar da tabela %: %', table_name, SQLERRM;
       END;
     END LOOP;
     
     RETURN json_build_object(
       'success', true,
       'deleted_tables', deleted_tables,
       'message', 'Dados deletados com sucesso'
     );
   END;
   $$;
   ```

2. **Atualizar componente PrivacySection**:
   ```typescript
   const handleDataDeletion = async () => {
     if (!confirm('ATENÇÃO: Esta ação irá deletar TODOS os seus dados permanentemente. Esta ação não pode ser desfeita. Tem certeza?')) {
       return;
     }

     if (!confirm('Confirmação final: Você tem certeza absoluta de que deseja deletar todos os seus dados?')) {
       return;
     }

     try {
       setIsSaving(true);
       
       const { data, error } = await supabase.rpc('delete_user_data', {
         user_phone: cliente?.phone
       });

       if (error) throw error;

       if (!data.success) {
         throw new Error(data.error || 'Erro na exclusão');
       }

       toast({
         title: "Dados deletados",
         description: `Todos os seus dados foram removidos permanentemente. Tabelas afetadas: ${data.deleted_tables.join(', ')}`,
       });

       // Fazer logout e redirecionar
       await logout();
       window.location.href = '/auth/login';

     } catch (error) {
       console.error('Erro ao deletar dados:', error);
       toast({
         title: "Erro na exclusão",
         description: "Não foi possível deletar seus dados. Tente novamente.",
         variant: "destructive",
       });
     } finally {
       setIsSaving(false);
     }
   };
   ```

3. **Implementar RPC function para exportação**:
   ```sql
   CREATE OR REPLACE FUNCTION export_user_data(user_phone TEXT)
   RETURNS JSON
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   DECLARE
     user_data JSON;
   BEGIN
     -- Verificar se usuário existe
     IF NOT EXISTS (SELECT 1 FROM clientes WHERE phone = user_phone) THEN
       RETURN json_build_object('success', false, 'error', 'Usuário não encontrado');
     END IF;
     
     -- Coletar todos os dados do usuário
     SELECT json_build_object(
       'cliente', (SELECT row_to_json(c) FROM clientes c WHERE phone = user_phone),
       'financeiro_registros', (SELECT json_agg(row_to_json(f)) FROM financeiro_registros f WHERE phone = user_phone),
       'tasks', (SELECT json_agg(row_to_json(t)) FROM tasks t WHERE phone = user_phone),
       'metas', (SELECT json_agg(row_to_json(m)) FROM metas m WHERE phone = user_phone),
       'events', (SELECT json_agg(row_to_json(e)) FROM events e WHERE phone = user_phone),
       'notifications', (SELECT json_agg(row_to_json(n)) FROM notifications n WHERE phone = user_phone),
       'support_tickets', (SELECT json_agg(row_to_json(s)) FROM support_tickets s WHERE phone = user_phone),
       'privacy_settings', (SELECT row_to_json(p) FROM privacy_settings p WHERE phone = user_phone),
       'exported_at', now()
     ) INTO user_data;
     
     RETURN json_build_object('success', true, 'data', user_data);
   END;
   $$;
   ```

**Critérios de Sucesso**:
- [ ] RPC functions implementadas no Supabase
- [ ] Exclusão de dados funciona corretamente
- [ ] Exportação de dados funciona corretamente
- [ ] Teste TC014 passa

**Validação**:
- Testar exclusão completa de dados
- Verificar se todas as tabelas são limpas
- Testar exportação de dados
- Verificar conformidade LGPD

---

#### **ETAPA 2.2: Corrigir Bug na Exportação CSV**
**Duração**: 1-2 dias
**Prioridade**: ALTA

**Problemas Identificados**:
- Exportação CSV aciona PDF incorretamente
- Lógica de exportação confusa

**Ações Específicas**:
1. **Identificar componente de exportação**:
   - Localizar onde está a lógica de exportação CSV/PDF
   - Verificar se é no Dashboard ou Reports

2. **Corrigir lógica de exportação**:
   ```typescript
   const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
     try {
       switch (format) {
         case 'csv':
           await exportToCSV();
           break;
         case 'pdf':
           await exportToPDF();
           break;
         case 'json':
           await exportToJSON();
           break;
         default:
           throw new Error('Formato não suportado');
       }
     } catch (error) {
       console.error('Erro na exportação:', error);
       toast.error('Erro ao exportar dados');
     }
   };

   const exportToCSV = async () => {
     // Implementar exportação CSV específica
     const csvData = convertToCSV(data);
     downloadFile(csvData, 'relatorio.csv', 'text/csv');
   };

   const exportToPDF = async () => {
     // Implementar exportação PDF específica
     const pdfData = await generatePDF(data);
     downloadFile(pdfData, 'relatorio.pdf', 'application/pdf');
   };
   ```

**Critérios de Sucesso**:
- [ ] Exportação CSV funciona corretamente
- [ ] Exportação PDF funciona corretamente
- [ ] Teste TC011 passa

**Validação**:
- Testar cada formato de exportação
- Verificar se arquivos são gerados corretamente
- Verificar conteúdo dos arquivos

---

### **SEMANA 3: Correções de Navegação e UI**

#### **ETAPA 3.1: Corrigir Travamento após Acesso Negado**
**Duração**: 2-3 dias
**Prioridade**: ALTA

**Problemas Identificados**:
- UI fica em loading após tentativa de acesso a recursos premium
- Navegação incorreta após negação de acesso

**Ações Específicas**:
1. **Revisar componente ProtectedFeature**:
   ```typescript
   export function ProtectedFeature({ children, feature }: { children: React.ReactNode; feature: string }) {
     const { cliente } = useAuth();
     const permissions = usePermissions();
     
     const hasPermission = permissions[feature as keyof typeof permissions];
     
     if (!hasPermission) {
       return (
         <div className="p-6 text-center">
           <Card>
             <CardContent className="pt-6">
               <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
               <h3 className="text-lg font-semibold mb-2">Recurso Premium</h3>
               <p className="text-sm text-muted-foreground mb-4">
                 Este recurso está disponível apenas para usuários Premium.
               </p>
               <Button onClick={() => navigate('/profile')} variant="outline">
                 Fazer Upgrade
               </Button>
             </CardContent>
           </Card>
         </div>
       );
     }
     
     return <>{children}</>;
   }
   ```

2. **Corrigir navegação após negação**:
   ```typescript
   const handleAccessDenied = () => {
     // Limpar estado de loading
     setLoading(false);
     
     // Mostrar toast informativo
     toast.info('Este recurso requer um plano Premium');
     
     // Navegar para página de upgrade
     navigate('/profile?tab=plans');
   };
   ```

3. **Implementar loading states mais robustos**:
   ```typescript
   const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
   
   const setLoading = (key: string, loading: boolean) => {
     setLoadingStates(prev => ({ ...prev, [key]: loading }));
   };
   ```

**Critérios de Sucesso**:
- [ ] UI não trava após acesso negado
- [ ] Navegação funciona corretamente
- [ ] Testes TC008, TC012 passam

**Validação**:
- Testar acesso a recursos premium com usuário gratuito
- Verificar navegação após negação
- Testar diferentes cenários de acesso

---

#### **ETAPA 3.2: Melhorar Sistema de Rate Limiting**
**Duração**: 1-2 dias
**Prioridade**: MÉDIA

**Problemas Identificados**:
- Sistema de rate limiting não foi completamente testado
- Implementação pode estar incompleta

**Ações Específicas**:
1. **Revisar implementação no AuthContext**:
   ```typescript
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
   ```

2. **Implementar testes para rate limiting**:
   ```typescript
   const testRateLimiting = async () => {
     const attempts = [];
     for (let i = 0; i < 6; i++) {
       try {
         await login('invalid_phone', 'invalid_password');
       } catch (error) {
         attempts.push(error.message);
       }
     }
     
     // Verificar se rate limiting foi aplicado
     const lastAttempt = attempts[attempts.length - 1];
     expect(lastAttempt).toContain('Muitas tentativas');
   };
   ```

**Critérios de Sucesso**:
- [ ] Rate limiting funciona corretamente
- [ ] Teste TC003 passa
- [ ] Sistema bloqueia após 5 tentativas

**Validação**:
- Testar múltiplas tentativas de login
- Verificar bloqueio temporário
- Testar reset do bloqueio

---

### **SEMANA 4: Testes e Validação Final**

#### **ETAPA 4.1: Executar Testes Completos**
**Duração**: 2-3 dias
**Prioridade**: CRÍTICA

**Ações Específicas**:
1. **Executar todos os testes Playwright**:
   ```bash
   npx playwright test tests/critical-functionality.spec.ts --headed
   ```

2. **Executar testes Testsprite**:
   ```bash
   node testsprite_tests/generateCodeAndExecute
   ```

3. **Verificar cobertura de testes**:
   - TC001: ✅ Phone-based Authentication Success
   - TC002: ✅ Phone-based Authentication Failure
   - TC003: ❌ Rate Limiting (corrigir)
   - TC004: ❌ Financial Record Creation (corrigir)
   - TC005: ❌ Financial Record Export (corrigir)
   - TC006: ❌ Google Calendar Integration (corrigir)
   - TC007: ❌ WhatsApp Integration (EXCLUÍDO)
   - TC008: ❌ Role-Based Access Control (corrigir)
   - TC009: ✅ Backup System
   - TC010: ❌ Support Ticket Creation (corrigir)
   - TC011: ❌ Dashboard Export Reports (corrigir)
   - TC012: ❌ AI Sub-agent Functionalities (corrigir)
   - TC013: ❌ UI Responsiveness (corrigir)
   - TC014: ❌ LGPD Compliance (corrigir)
   - TC015: ✅ Support System FAQ
   - TC016: ✅ WhatsApp Reminders

**Critérios de Sucesso**:
- [ ] 90%+ dos testes passando
- [ ] Todos os problemas críticos resolvidos
- [ ] Performance melhorada

---

#### **ETAPA 4.2: Documentação e Deploy**
**Duração**: 1-2 dias
**Prioridade**: MÉDIA

**Ações Específicas**:
1. **Atualizar documentação**:
   - Atualizar README.md
   - Documentar correções implementadas
   - Criar guia de troubleshooting

2. **Preparar para deploy**:
   - Verificar configurações de produção
   - Testar em ambiente de staging
   - Preparar rollback se necessário

3. **Monitoramento**:
   - Configurar logs de erro
   - Monitorar performance
   - Alertas para problemas críticos

---

## 🔍 **CRITÉRIOS DE VALIDAÇÃO POR ETAPA**

### **Validação Técnica**:
- [ ] Console sem erros críticos
- [ ] Performance melhorada (tempo de carregamento < 3s)
- [ ] Todos os testes passando
- [ ] Políticas RLS funcionando

### **Validação Funcional**:
- [ ] Autenticação funciona corretamente
- [ ] Gestão financeira completa
- [ ] Sistema de backup operacional
- [ ] Conformidade LGPD

### **Validação de Segurança**:
- [ ] Rate limiting ativo
- [ ] Políticas RLS corretas
- [ ] Exclusão de dados segura
- [ ] Exportação de dados segura

---

## 📊 **MÉTRICAS DE SUCESSO**

### **Antes das Correções**:
- Taxa de sucesso: 31.25% (5/16 testes)
- Problemas críticos: 7
- Performance: Ruim (loops infinitos)

### **Após as Correções**:
- Taxa de sucesso: 90%+ (14/15 testes)
- Problemas críticos: 0
- Performance: Boa (< 3s carregamento)

---

## ⚠️ **RISCOS E MITIGAÇÕES**

### **Riscos Identificados**:
1. **Quebra de funcionalidades existentes**
   - Mitigação: Testes extensivos antes de cada deploy
   
2. **Problemas de performance**
   - Mitigação: Monitoramento contínuo e otimizações

3. **Problemas de segurança**
   - Mitigação: Revisão de políticas RLS e testes de segurança

### **Plano de Rollback**:
- Manter backup da versão atual
- Deploy gradual por funcionalidade
- Monitoramento 24/7 após deploy

---

## 🎯 **PRÓXIMOS PASSOS**

1. **Aguardar aprovação** para iniciar ETAPA 1.1
2. **Implementar correções** etapa por etapa
3. **Validar cada etapa** antes de prosseguir
4. **Documentar progresso** e problemas encontrados
5. **Executar testes finais** e validar sucesso

---

**Este plano está pronto para execução. Aguardo sua aprovação para iniciar a ETAPA 1.1: Correção do Loop Infinito no useAgendaData.**
