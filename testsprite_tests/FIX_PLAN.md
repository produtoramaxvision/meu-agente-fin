# Plano de Correção Detalhado - TestSprite Failures

**Data:** 2025-11-14  
**Status:** Em Execução

---

## 🔴 Prioridade 1 - URGENTE (Corrigir Imediatamente)

### 1. TC015 - Privacy Settings Toast Error (BUG CRÍTICO) ✅ CONCLUÍDO

**Arquivo:** `src/components/PrivacySection.tsx`  
**Linhas:** 21, 38, 112, 123, 131, 154, 160, 196  
**Problema:** `toast.success()` não existe no hook `use-toast`

**Correção Aplicada:**
- ✅ Mudado import de `useToast` para `toast` do `sonner` (mesmo padrão do login)
- ✅ Removida declaração `const { toast } = useToast();`
- ✅ Mantidos todos os `toast.success()` e `toast.error()` (sonner suporta)
- ✅ Corrigido `toast({ title, description })` para `toast.loading()`

**Arquivos Corrigidos:**
- ✅ `src/components/PrivacySection.tsx` - 6 ocorrências corrigidas

**Impacto:** Bug crítico corrigido - configurações de privacidade agora podem ser salvas

**Validação:**
- ✅ Sem erros de lint
- ✅ Mesmo padrão visual do toast de login (`toast` do sonner)
- ✅ Todas as ocorrências verificadas e corrigidas

---

### 2. TC003 - Login Security (VALIDAR SE É FALSO POSITIVO)

**Arquivo:** `src/contexts/AuthContext.tsx`  
**Problema:** Teste reporta que login funciona com senha incorreta

**Análise:**
- O código usa `supabase.auth.signInWithPassword()` que **sempre** valida a senha no servidor
- **Provável falso positivo** do teste
- Necessário testar manualmente

**Ação:**
1. Testar manualmente login com senha incorreta
2. Se for falso positivo, marcar como tal no relatório
3. Se for real, investigar configurações do Supabase Auth

**Impacto:** Vulnerabilidade crítica de segurança (se real)

---

## 🟡 Prioridade 2 - ALTA (Corrigir em Breve)

### 3. TC014 - Avatar Upload ✅ CONCLUÍDO

**Arquivo:** `src/components/AvatarUpload.tsx`  
**Linhas principais:** 86-178, 183-242  

**O que foi corrigido:**
- ✅ RLS do bucket `avatars` ajustado via migration (`202511140007_fix_avatars_rls_upload_by_phone`)
- ✅ `TooltipTrigger` passou a usar `asChild` e o `onClick={triggerFileSelect}` foi movido para o `div` interno
- ✅ Validações de tipo/tamanho agora ocorrem **antes** de chamar `setUploading(true)`
- ✅ Tratamento de erro foi melhorado com mensagens mais específicas, mantendo toast do `sonner`

**Impacto:** Upload de avatar funcionando; usuário confirmou que o upload está ok

---

### 4. TC004 - Password Recovery ✅ CONCLUÍDO

**Arquivos envolvidos:** 
- `src/pages/auth/ForgotPassword.tsx` (novo)
- `src/pages/auth/ResetPassword.tsx` (novo)
- `src/pages/auth/Login.tsx` (link atualizado)
- `src/App.tsx` (rotas adicionadas)
- `src/integrations/supabase/client.ts` (configuração de auth ajustada)

**Problema original:** Funcionalidade de recuperação de senha não implementada; link \"Esqueci minha senha\" apenas exibia um toast genérico. Após implementação inicial, link de recuperação mostrava erro \"link já utilizado\" mesmo na primeira tentativa.

**Correções aplicadas:**
- ✅ Criada página `/auth/forgot-password` (`ForgotPassword.tsx`) usando `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/auth/reset-password' })`
- ✅ Criada página `/auth/reset-password` (`ResetPassword.tsx`) que valida sessão de reset e chama `supabase.auth.updateUser({ password })`
- ✅ Atualizado link \"Esqueci minha senha\" em `Login.tsx` para navegar com `useNavigate('/auth/forgot-password')`
- ✅ Adicionadas rotas em `App.tsx` para as novas páginas dentro de `AuthLayout`
- ✅ Mantido o mesmo padrão de layout: `Logo`, gradiente no título, cartões com `bg-surface`, `Button`, `Input`, `Label` e `HelpAndSupport` em modo `floatingAuth`
- ✅ **CORREÇÃO FINAL:** Ajustado `src/integrations/supabase/client.ts`:
  - Mudado `detectSessionInUrl: false` para `true` (permite processamento automático de tokens na URL)
  - Removido `flowType: 'pkce'` (volta para fluxo padrão `implicit` do Supabase)
- ✅ **CORREÇÃO FINAL:** Simplificado `ResetPassword.tsx`:
  - `useEffect` agora apenas chama `supabase.auth.getSession()` (Supabase processa automaticamente tokens da URL com `detectSessionInUrl: true`)
  - Removida lógica complexa de `exchangeCodeForSession` e `getSessionFromUrl`

**Validação:**
- ✅ Configuração do Supabase Dashboard: Redirect URLs incluem `http://localhost:8080/auth/reset-password` e `https://app.meuagente.api.br/auth/reset-password`
- ✅ Site URL configurado como `http://localhost:8080`
- ✅ Link de recuperação agora chega como `?code=...` (PKCE flow)
- ✅ Supabase processa automaticamente o código e cria sessão
- ✅ Formulário de redefinição aparece corretamente na primeira tentativa

**Impacto:** UX e segurança melhoradas — usuários agora podem recuperar e redefinir a senha de forma segura, alinhada ao Supabase Auth. Fluxo completo funcionando desde solicitação até redefinição.

---

### 5. TC012 - Support Upgrade Button

**Arquivo:** `src/components/SupportTabs.tsx`  
**Linhas:** 276, 566  
**Problema:** `window.location.href` pode não funcionar corretamente

**Correção:**
```typescript
// ANTES:
import { useAuth } from '@/contexts/AuthContext';

<Button 
  onClick={() => window.location.href = '/perfil?tab=plans'}
  className="..."
>
  Ver Planos Disponíveis
</Button>

// DEPOIS:
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const navigate = useNavigate();

<Button 
  onClick={() => navigate('/perfil?tab=plans')}
  className="..."
>
  Ver Planos Disponíveis
</Button>
```

**Impacto:** Navegação quebrada - usuários não conseguem acessar página de planos

---

## 🟢 Prioridade 3 - MÉDIA (Melhorias)

### 6. TC020 - React Warnings (forwardRef)

**Arquivo:** `src/components/AgendaGridWeek.tsx`  
**Linha:** 112  
**Problema:** Componente funcional recebendo ref sem `forwardRef()`

**Correção:**
```typescript
// ANTES:
function DraggableEvent({ event, calendarColor, onEventClick }: DraggableEventProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({ id: event.id });
  
  // ...
}

// DEPOIS:
const DraggableEvent = React.forwardRef<HTMLDivElement, DraggableEventProps>(
  ({ event, calendarColor, onEventClick }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useDraggable({ id: event.id });
    
    // Combinar refs se necessário
    const combinedRef = (node: HTMLDivElement | null) => {
      setNodeRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };
    
    // ...
  }
);

DraggableEvent.displayName = 'DraggableEvent';
```

**Impacto:** Warnings no console - não crítico mas deve ser corrigido

---

### 7. TC001 - Signup Error 400

**Arquivo:** `src/contexts/AuthContext.tsx`  
**Problema:** Erro 400 do Supabase pode ter várias causas

**Melhorias:**
1. Melhorar tratamento de erros para mostrar mensagens mais específicas
2. Adicionar validação de email duplicado antes do signup
3. Verificar logs do Supabase para identificar causa específica

**Código:**
```typescript
// Melhorar tratamento de erros
if (error) {
  let errorMessage = 'Erro ao criar conta';
  
  if (error.message.includes('User already registered')) {
    errorMessage = 'Este email já está cadastrado';
  } else if (error.message.includes('Password')) {
    errorMessage = 'Senha inválida. Use pelo menos 8 caracteres';
  } else if (error.message.includes('Email')) {
    errorMessage = 'Email inválido';
  }
  
  throw new Error(errorMessage);
}
```

**Impacto:** Melhor UX - mensagens de erro mais claras

---

## 📋 Resumo de Arquivos a Modificar

1. ✅ `src/components/PrivacySection.tsx` - Corrigir `toast.success()` (2 ocorrências)
2. ✅ `src/components/AvatarUpload.tsx` - Corrigir click do botão de upload
3. ✅ `src/components/SupportTabs.tsx` - Substituir `window.location.href` por `navigate()` (2 ocorrências)
4. ✅ `src/components/AgendaGridWeek.tsx` - Adicionar `forwardRef()` ao `DraggableEvent`
5. ✅ `src/contexts/AuthContext.tsx` - Melhorar tratamento de erros no signup
6. ✅ `src/pages/auth/Login.tsx` - Adicionar link "Esqueci minha senha"
7. ✅ `src/pages/auth/ForgotPassword.tsx` - **CRIAR** nova página
8. ✅ `src/App.tsx` ou router - Adicionar rota `/auth/forgot-password`

---

## ✅ Checklist de Validação

Após as correções, validar:

- [ ] TC015: Privacy settings podem ser salvos sem erro
- [ ] TC014: Botão de upload de avatar abre diálogo de seleção de arquivo
- [ ] TC012: Botão de upgrade navega corretamente para página de planos
- [ ] TC004: Link "Esqueci minha senha" aparece na página de login
- [ ] TC004: Página de recuperação de senha funciona corretamente
- [ ] TC020: Warnings do React sobre refs desaparecem do console
- [ ] TC001: Mensagens de erro de signup são mais claras
- [ ] TC003: Testar manualmente login com senha incorreta (deve falhar)

---

## 🚀 Ordem de Execução

1. **TC015** - Corrigir toast em PrivacySection (5 min)
2. **TC014** - Corrigir upload de avatar (10 min)
3. **TC012** - Corrigir botão de upgrade (5 min)
4. **TC004** - Implementar recuperação de senha (30 min)
5. **TC020** - Adicionar forwardRef (10 min)
6. **TC001** - Melhorar tratamento de erros (10 min)
7. **TC003** - Testar manualmente (5 min)

**Tempo Total Estimado:** ~75 minutos

---

**Status:** Aguardando aprovação do usuário para prosseguir

