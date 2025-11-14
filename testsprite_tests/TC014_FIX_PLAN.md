# Plano de Correção Detalhado - TC014 Avatar Upload

**Data:** 2025-11-14  
**Status:** Correções Aplicadas - Aguardando Validação Manual

---

## ✅ Status Atual

### Problema de RLS: RESOLVIDO
- ✅ Migration `202511140007_fix_avatars_rls_upload_by_phone` aplicada
- ✅ Políticas de RLS criadas corretamente para bucket `avatars`
- ✅ Upload não deve mais falhar por RLS

### Problemas Identificados no Componente

1. **CRÍTICO:** `TooltipTrigger` com `onClick` não funciona corretamente
2. **MELHORIA:** Tratamento de erro genérico demais
3. **MELHORIA:** `setUploading(true)` chamado antes das validações

---

## 🔧 Correções Aplicadas

### Correção 1: Usar `asChild` no TooltipTrigger (CRÍTICA) ✅

**Problema:**
- `TooltipTrigger` com `onClick` não propaga o evento corretamente
- O `div` interno tem todos os handlers, mas o click está no `TooltipTrigger`
- Outros componentes do projeto usam `asChild` (ex: `HelpAndSupport.tsx`, `sidebar.tsx`)

**Solução:**
```tsx
// ANTES (Linhas 185-242):
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
- Segue o padrão usado em outros componentes do projeto
- Compatível com Radix UI e shadcn/ui v4

---

### Correção 2: Melhorar Tratamento de Erros (MELHORIA) ✅

**Problema:**
- Mensagem de erro genérica não ajuda o usuário
- Não diferencia tipos de erro (RLS, tamanho, tipo, etc.)

**Solução:**
```tsx
// ANTES (Linhas 171-178):
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
- Mensagens específicas melhoram UX
- Ajuda usuário a entender e corrigir o problema
- Mantém logs detalhados no console

---

### Correção 3: Otimizar Ordem de Validação (MELHORIA) ✅

**Problema:**
- `setUploading(true)` é chamado antes das validações
- Se validação falhar, estado fica como "uploading" sem realmente fazer upload

**Solução:**
```tsx
// ANTES (Linhas 93-120):
try {
  setUploading(true);  // ⚠️ Setado antes das validações

  if (!event.target.files || event.target.files.length === 0) {
    return;  // ⚠️ Retorna mas uploading continua true
  }

  const file = event.target.files[0];

  // Validações...
  if (!allowedTypes.includes(file.type)) {
    toast.error('Por favor, selecione um arquivo JPEG ou PNG.');
    return;  // ⚠️ Retorna mas uploading continua true
  }

  if (file.size > maxSizeInBytes) {
    toast.error('O tamanho máximo da imagem é de 600KB.');
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

  console.log('📤 Enviando arquivo para Supabase Storage...', {
    fileName,
    bucket: 'avatars'
  });

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { 
      upsert: true,
      cacheControl: '0'
    });

  // ... resto do código
}
```

**Justificativa:**
- Evita estado de "uploading" quando validação falha
- Mais eficiente (não seta estado desnecessariamente)
- Melhor UX (não mostra loading quando não há upload)

---

## 📋 Resumo das Mudanças

| # | Mudança | Linhas | Prioridade | Impacto |
|---|---------|--------|------------|---------|
| 1 | `TooltipTrigger` usar `asChild` e mover `onClick` para `div` | 186-242 | **CRÍTICA** | Resolve problema principal |
| 2 | Melhorar tratamento de erros com mensagens específicas | 171-178 | Alta | Melhora UX |
| 3 | Mover `setUploading(true)` para depois das validações | 93-120 | Média | Melhora performance |

---

## ✅ Checklist de Validação

Após aplicar as correções, validar:

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
- [ ] **Teste 11:** Upload funciona após correção de RLS (sem erro 400)

---

## 🎯 Ordem de Execução

1. **Correção 1** (asChild) - **CRÍTICA** - Resolve problema do teste TC014
2. **Correção 3** (Validação) - **MELHORIA** - Previne bugs
3. **Correção 2** (Erros) - **MELHORIA** - Melhora UX

**Tempo Estimado:** ~15 minutos

---

## ⚠️ Observações Importantes

1. **RLS já foi corrigido** - A migration já foi aplicada, então o erro de RLS não deve mais ocorrer
2. **Padrão do projeto** - Outros componentes (`HelpAndSupport.tsx`, `sidebar.tsx`) já usam `asChild` com `TooltipTrigger`
3. **Sem breaking changes** - As mudanças não afetam outros componentes
4. **Compatibilidade** - Compatível com shadcn/ui v4 e Radix UI

---

**Status:** ✅ Plano Completo - Aguardando Aprovação para Aplicar Correções

