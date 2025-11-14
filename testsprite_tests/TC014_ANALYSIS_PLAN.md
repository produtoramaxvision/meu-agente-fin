# Análise e Plano de Correção - TC014 Avatar Upload

**Data:** 2025-11-14  
**Status:** Análise Completa - Aguardando Aprovação

---

## 🔍 Análise Completa do Problema

### Problema Original Reportado
- **Teste TC014:** Botão de upload de avatar não abre diálogo de seleção de arquivo
- **Print do Usuário:** Toast de erro sempre aparece ao tentar salvar imagem
- **Erro nos Logs:** `new row violates row-level security policy for table "objects"`

### ✅ Problema de RLS RESOLVIDO
- **Migration Aplicada:** `202511140007_fix_avatars_rls_upload_by_phone`
- **Status:** ✅ Políticas de RLS criadas corretamente
- **Resultado Esperado:** Upload não deve mais falhar por RLS

---

## 🔎 Análise Detalhada do Componente AvatarUpload

### 1. Estrutura Atual do Componente

**Arquivo:** `src/components/AvatarUpload.tsx`

#### Estrutura de Renderização (Linhas 182-276):
```tsx
<TooltipProvider>
  <div className="flex flex-col items-center gap-4">
    <Tooltip>
      <TooltipTrigger onClick={triggerFileSelect}>  {/* ⚠️ PROBLEMA POTENCIAL */}
        <div 
          className="..."
          onMouseEnter={...}
          onMouseLeave={...}
          onDragEnter={...}
          onDragLeave={...}
          onDragOver={...}
          onDrop={...}
        >
          <Avatar>...</Avatar>
          {/* Overlay com ícone */}
        </div>
      </TooltipTrigger>
      <TooltipContent>...</TooltipContent>
    </Tooltip>
    <input ref={fileInputRef} id="avatar-upload" ... />
  </div>
</TooltipProvider>
```

### 2. Problemas Identificados

#### ⚠️ Problema 1: TooltipTrigger com onClick
**Linha 186:** `<TooltipTrigger onClick={triggerFileSelect}>`

**Análise:**
- O `TooltipTrigger` do Radix UI (usado pelo shadcn) **pode não propagar eventos de click corretamente**
- Segundo a documentação do Radix UI, o `TooltipTrigger` deve usar `asChild` quando precisa passar eventos para elementos filhos
- O `onClick` no `TooltipTrigger` pode estar sendo interceptado antes de chegar ao `div` interno

**Evidência:**
- O teste reportou que o botão não abre o diálogo
- O componente tem um `div` interno com todos os handlers de drag-and-drop, mas o click está no `TooltipTrigger`

**Solução Recomendada:**
```tsx
// ANTES (PROBLEMÁTICO):
<TooltipTrigger onClick={triggerFileSelect}>
  <div onMouseEnter={...} onDrop={...}>
    ...
  </div>
</TooltipTrigger>

// DEPOIS (CORRETO):
<Tooltip>
  <TooltipTrigger asChild>
    <div 
      onClick={triggerFileSelect}
      onMouseEnter={...}
      onDrop={...}
    >
      ...
    </div>
  </TooltipTrigger>
  <TooltipContent>...</TooltipContent>
</Tooltip>
```

#### ⚠️ Problema 2: Tratamento de Erro Genérico
**Linha 171-172:**
```tsx
catch (error) {
  toast.error('Erro ao fazer upload da foto. Verifique o console para mais detalhes.');
}
```

**Análise:**
- O erro é genérico e não informa ao usuário qual foi o problema específico
- Com a correção de RLS, alguns erros podem ser mais específicos (ex: "Arquivo muito grande", "Tipo não suportado")
- Melhorar mensagens de erro ajudaria na UX

**Solução Recomendada:**
```tsx
catch (error: any) {
  console.error('Erro ao fazer upload:', error);
  
  let errorMessage = 'Erro ao fazer upload da foto.';
  
  if (error?.message?.includes('row-level security')) {
    errorMessage = 'Erro de permissão. Verifique se você está logado.';
  } else if (error?.message?.includes('size') || error?.message?.includes('large')) {
    errorMessage = 'Arquivo muito grande. Use uma imagem menor que 600KB.';
  } else if (error?.message?.includes('type') || error?.message?.includes('format')) {
    errorMessage = 'Formato não suportado. Use apenas JPEG ou PNG.';
  } else if (error?.statusCode === 400) {
    errorMessage = 'Erro ao fazer upload. Verifique se o arquivo é válido.';
  }
  
  toast.error(errorMessage);
}
```

#### ⚠️ Problema 3: Validação Antes do Upload
**Linhas 110-120:**
- Validação de tipo e tamanho está correta
- **MAS:** Se a validação falhar, o `setUploading(true)` já foi chamado (linha 94)
- Isso pode deixar o componente em estado de "uploading" mesmo quando não há upload

**Solução Recomendada:**
```tsx
// Mover setUploading(true) para DEPOIS das validações
if (!allowedTypes.includes(file.type)) {
  toast.error('Por favor, selecione um arquivo JPEG ou PNG.');
  return; // ✅ Não precisa setUploading(false) porque nunca foi setado
}

if (file.size > maxSizeInBytes) {
  toast.error('O tamanho máximo da imagem é de 600KB.');
  return; // ✅ Não precisa setUploading(false) porque nunca foi setado
}

// Agora sim, iniciar upload
setUploading(true);
```

#### ✅ Problema 4: Falta de Reset do Estado em Erro
**Análise:**
- O `finally` já reseta `uploading` corretamente
- O `fileInputRef.current.value = ""` já limpa o input
- **Status:** ✅ CORRETO

### 3. Verificação de Padrões no Código

#### Busca por TooltipTrigger com onClick:
- **Resultado:** Apenas `AvatarUpload.tsx` usa `TooltipTrigger` com `onClick`
- **Conclusão:** Não há padrão estabelecido no código para isso

#### Busca por asChild em TooltipTrigger:
- **Resultado:** Nenhum uso encontrado
- **Conclusão:** O padrão `asChild` não está sendo usado, mas é a forma recomendada pelo Radix UI

### 4. Verificação de Compatibilidade com shadcn/ui

**Componente Tooltip do shadcn:**
- Baseado em `@radix-ui/react-tooltip`
- Suporta `asChild` prop (padrão do Radix)
- Quando `asChild={true}`, o `TooltipTrigger` passa todas as props (incluindo `onClick`) para o primeiro filho

**Conclusão:** ✅ Usar `asChild` é a forma correta e recomendada

---

## 📋 Plano de Correção Detalhado

### Correção 1: Usar `asChild` no TooltipTrigger (CRÍTICO)

**Arquivo:** `src/components/AvatarUpload.tsx`  
**Linhas:** 185-251

**Mudança:**
```tsx
// ANTES:
<Tooltip>
  <TooltipTrigger onClick={triggerFileSelect}>
    <div 
      className="..."
      onMouseEnter={...}
      onMouseLeave={...}
      onDragEnter={...}
      onDragLeave={...}
      onDragOver={...}
      onDrop={...}
    >
      <Avatar>...</Avatar>
      {/* Overlay */}
    </div>
  </TooltipTrigger>
  <TooltipContent>...</TooltipContent>
</Tooltip>

// DEPOIS:
<Tooltip>
  <TooltipTrigger asChild>
    <div 
      className="..."
      onClick={triggerFileSelect}  // ✅ Movido para o div
      onMouseEnter={...}
      onMouseLeave={...}
      onDragEnter={...}
      onDragLeave={...}
      onDragOver={...}
      onDrop={...}
    >
      <Avatar>...</Avatar>
      {/* Overlay */}
    </div>
  </TooltipTrigger>
  <TooltipContent>...</TooltipContent>
</Tooltip>
```

**Justificativa:**
- `asChild` faz o `TooltipTrigger` passar todas as props para o primeiro filho
- O `onClick` funcionará corretamente no `div`
- Mantém compatibilidade com drag-and-drop
- Segue padrão recomendado do Radix UI

---

### Correção 2: Melhorar Tratamento de Erros (MELHORIA)

**Arquivo:** `src/components/AvatarUpload.tsx`  
**Linhas:** 171-178

**Mudança:**
```tsx
// ANTES:
catch (error) {
  toast.error('Erro ao fazer upload da foto. Verifique o console para mais detalhes.');
} finally {
  setUploading(false);
  if(fileInputRef.current) {
    fileInputRef.current.value = "";
  }
}

// DEPOIS:
catch (error: any) {
  console.error('❌ Erro ao fazer upload de avatar:', error);
  
  let errorMessage = 'Erro ao fazer upload da foto.';
  
  // Mensagens específicas baseadas no tipo de erro
  if (error?.message?.includes('row-level security') || error?.message?.includes('RLS')) {
    errorMessage = 'Erro de permissão. Verifique se você está logado corretamente.';
  } else if (error?.message?.includes('size') || error?.message?.includes('large') || error?.statusCode === 413) {
    errorMessage = 'Arquivo muito grande. O tamanho máximo é de 600KB.';
  } else if (error?.message?.includes('type') || error?.message?.includes('format') || error?.message?.includes('content-type')) {
    errorMessage = 'Formato não suportado. Use apenas imagens JPEG ou PNG.';
  } else if (error?.statusCode === 400) {
    errorMessage = 'Erro ao fazer upload. Verifique se o arquivo é uma imagem válida.';
  } else if (error?.statusCode === 401 || error?.statusCode === 403) {
    errorMessage = 'Erro de autenticação. Faça login novamente.';
  } else if (error?.statusCode === 500) {
    errorMessage = 'Erro no servidor. Tente novamente em alguns instantes.';
  }
  
  toast.error(errorMessage);
} finally {
  setUploading(false);
  if(fileInputRef.current) {
    fileInputRef.current.value = "";
  }
}
```

**Justificativa:**
- Mensagens de erro mais específicas melhoram UX
- Ajuda usuário a entender o problema
- Mantém logs detalhados no console para debugging

---

### Correção 3: Otimizar Ordem de Validação (MELHORIA)

**Arquivo:** `src/components/AvatarUpload.tsx`  
**Linhas:** 93-120

**Mudança:**
```tsx
// ANTES:
try {
  setUploading(true);  // ⚠️ Setado antes das validações

  if (!event.target.files || event.target.files.length === 0) {
    return;  // ⚠️ Retorna mas uploading continua true
  }

  const file = event.target.files[0];

  // Validações...
  if (!allowedTypes.includes(file.type)) {
    toast.error('...');
    return;  // ⚠️ Retorna mas uploading continua true
  }

  if (file.size > maxSizeInBytes) {
    toast.error('...');
    return;  // ⚠️ Retorna mas uploading continua true
  }

  // Upload...
}

// DEPOIS:
try {
  // Validações PRIMEIRO
  if (!event.target.files || event.target.files.length === 0) {
    return;
  }

  const file = event.target.files[0];

  // Validação de tipo
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    toast.error('Por favor, selecione um arquivo JPEG ou PNG.');
    return;
  }

  // Validação de tamanho
  const maxSizeInBytes = 600 * 1024; // 600KB
  if (file.size > maxSizeInBytes) {
    toast.error('O tamanho máximo da imagem é de 600KB.');
    return;
  }

  // ✅ AGORA SIM, iniciar upload
  setUploading(true);

  const fileExt = file.name.split('.').pop();
  const fileName = `${userPhone}/avatar.${fileExt}`;

  // Upload...
}
```

**Justificativa:**
- Evita estado de "uploading" quando validação falha
- Mais eficiente (não seta estado desnecessariamente)
- Melhor UX (não mostra loading quando não há upload)

---

## ✅ Checklist de Validação

Após as correções, validar:

- [ ] **Teste 1:** Click no avatar abre diálogo de seleção de arquivo
- [ ] **Teste 2:** Drag-and-drop ainda funciona corretamente
- [ ] **Teste 3:** Upload de imagem válida (JPEG/PNG < 600KB) funciona
- [ ] **Teste 4:** Toast de sucesso aparece após upload bem-sucedido
- [ ] **Teste 5:** Validação de tipo rejeita arquivos inválidos com mensagem clara
- [ ] **Teste 6:** Validação de tamanho rejeita arquivos grandes com mensagem clara
- [ ] **Teste 7:** Mensagens de erro são específicas e úteis
- [ ] **Teste 8:** Estado de "uploading" não fica preso após erro de validação
- [ ] **Teste 9:** Tooltip ainda aparece ao passar mouse sobre o avatar
- [ ] **Teste 10:** Console não mostra erros de React (warnings)

---

## 📊 Resumo das Correções

| # | Correção | Prioridade | Impacto | Complexidade |
|---|----------|------------|---------|--------------|
| 1 | Usar `asChild` no TooltipTrigger | **CRÍTICA** | Resolve problema principal | Baixa |
| 2 | Melhorar tratamento de erros | Alta | Melhora UX | Média |
| 3 | Otimizar ordem de validação | Média | Melhora performance | Baixa |

---

## 🎯 Ordem de Execução

1. **Correção 1** (asChild) - **CRÍTICA** - Resolve problema do teste
2. **Correção 3** (Validação) - **MELHORIA** - Previne bugs
3. **Correção 2** (Erros) - **MELHORIA** - Melhora UX

**Tempo Estimado:** ~15 minutos

---

## ⚠️ Observações Importantes

1. **RLS já foi corrigido** - A migration `202511140007_fix_avatars_rls_upload_by_phone` já foi aplicada
2. **Teste após correção** - É importante testar manualmente após aplicar as correções
3. **Compatibilidade** - As correções são compatíveis com shadcn/ui v4 e Radix UI
4. **Sem breaking changes** - As mudanças não afetam outros componentes

---

**Status:** ✅ Análise Completa - Aguardando Aprovação para Aplicar Correções

