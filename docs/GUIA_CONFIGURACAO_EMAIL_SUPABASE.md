# 📧 Guia de Configuração de Email Templates no Supabase

## ✅ Objetivo

Personalizar os templates de email do Supabase seguindo o design elegante e minimalista do Meu Agente.

---

## 🎨 Características do Template

### Design System
- **Paleta**: Black & Gray minimalista
- **Tipografia**: Inter (Google Fonts)
- **Estilo**: Limpo, elegante e profissional
- **Responsivo**: Otimizado para desktop e mobile
- **Acessível**: Alto contraste e legibilidade

### Elementos Visuais
- ✅ Logo em destaque com sombra suave
- ✅ Header com gradiente preto elegante
- ✅ Botão CTA estilizado com hover effect
- ✅ Link alternativo para copiar/colar
- ✅ Info box com destaque
- ✅ Footer informativo com links úteis
- ✅ Espaçamento consistente e hierarquia visual

---

## 📋 Passo a Passo de Configuração

### Etapa 1: Acessar Configurações de Email

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, vá em **Authentication**
4. Clique em **Email Templates**

### Etapa 2: Configurar "Confirm signup"

1. Na lista de templates, selecione **Confirm signup**
2. Você verá 3 campos:
   - **Subject** (Assunto)
   - **Body (HTML)**
   - **Variables** (Variáveis disponíveis)

### Etapa 3: Configurar o Assunto

Cole no campo **Subject**:
```
Confirme seu email - Meu Agente
```

### Etapa 4: Colar o Template HTML

1. Abra o arquivo: `docs/email-templates/confirm-signup.html`
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. **Cole** no campo **Body (HTML)** do Supabase
4. Clique em **Save**

### Etapa 5: Testar o Template

1. Faça um cadastro de teste na aplicação
2. Verifique o email recebido
3. Confirme que:
   - ✅ Logo aparece corretamente
   - ✅ Nome do usuário está presente
   - ✅ Botão "Confirmar Email" funciona
   - ✅ Link alternativo está visível
   - ✅ Layout está responsivo no mobile

---

## 🔧 Personalização Avançada

### Hospedar Logo

O template usa a logo de:
```html
https://app.meuagente.api.br/meuagente_logo.jpg
```

**Se a logo não aparecer:**

1. **Opção 1 - Hospedar no Supabase Storage:**
   ```bash
   # Faça upload da logo para o Supabase Storage
   # Obtenha a URL pública
   # Substitua no template
   ```

2. **Opção 2 - Usar CDN externo:**
   - Upload no Cloudinary, ImgBB, ou similar
   - Obter URL pública
   - Substituir no template

3. **Opção 3 - Usar logo em Base64:**
   ```bash
   # Converter logo para base64
   base64 src/assets/meuagente_logo.jpg
   # Usar: data:image/jpeg;base64,<código>
   ```

### Alterar Cores

No template, procure por:
```css
/* Header */
background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);

/* Botão CTA */
background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
```

Substitua os códigos hexadecimais conforme necessário.

### Personalizar Textos

Localize e edite:
```html
<p class="brand-tagline">Gestão Financeira Pessoal</p>
<p class="message">Seja bem-vindo ao <strong>Meu Agente</strong>...</p>
```

---

## 🌐 Configurar Redirect URLs

### No Painel do Supabase:

1. Vá em **Authentication > URL Configuration**
2. Em **Redirect URLs**, adicione:
   ```
   http://localhost:8080/auth/login
   https://app.meuagente.api.br/auth/login
   ```
3. Clique em **Save**

### Verificar no Código:

O código já está configurado para usar automaticamente:
- **Desenvolvimento**: `http://localhost:8080/auth/login`
- **Produção**: `https://app.meuagente.api.br/auth/login`

Veja em `src/contexts/AuthContext.tsx` (linhas 404-406):
```typescript
const redirectUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080/auth/login'
  : 'https://app.meuagente.api.br/auth/login';
```

---

## 📱 Outros Templates (Opcional)

Você pode criar templates similares para:

### 1. **Magic Link** (Login sem senha)
- Subject: `Seu link de acesso - Meu Agente`
- Usar mesmo estilo visual

### 2. **Reset Password** (Recuperar senha)
- Subject: `Redefinir senha - Meu Agente`
- Adaptar mensagem para contexto de senha

### 3. **Email Change** (Mudança de email)
- Subject: `Confirme seu novo email - Meu Agente`
- Mensagem sobre verificação de novo email

---

## ✅ Checklist de Validação

Após configurar, verifique:

- [ ] Template HTML salvo no Supabase
- [ ] Assunto configurado
- [ ] Redirect URLs adicionadas
- [ ] Logo aparecendo corretamente
- [ ] Botão CTA funcionando
- [ ] Link alternativo visível
- [ ] Layout responsivo no mobile
- [ ] Nome do usuário aparecendo ({{ .Data.name }})
- [ ] Link de confirmação funcionando ({{ .ConfirmationURL }})
- [ ] Footer com informações corretas

---

## 🧪 Teste Completo

### 1. Criar Conta de Teste

```bash
# Acesse: http://localhost:8080/auth/login
# Digite telefone não cadastrado
# Preencha formulário de signup
```

### 2. Verificar Email Recebido

- ✅ Email chegou na caixa de entrada
- ✅ Assunto correto
- ✅ Logo aparece
- ✅ Layout elegante
- ✅ Botão funcionando

### 3. Confirmar Email

- ✅ Clicar no botão "Confirmar Email"
- ✅ Redirecionar para `/auth/login`
- ✅ Poder fazer login com sucesso

---

## 🎨 Preview do Template

### Desktop:
```
┌─────────────────────────────────────────┐
│         [HEADER COM GRADIENTE]          │
│            [LOGO CIRCULAR]              │
│           Meu Agente®                   │
│      Gestão Financeira Pessoal          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Olá, João Silva!                       │
│                                         │
│  Seja bem-vindo ao Meu Agente...        │
│                                         │
│      [BOTÃO: Confirmar Email]           │
│                                         │
│  [Link alternativo em caixa cinza]      │
│                                         │
│  [Info box com borda preta]             │
│                                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│         [FOOTER INFORMATIVO]            │
│    © 2025 - Links úteis                 │
└─────────────────────────────────────────┘
```

### Mobile (Responsivo):
- Logo menor
- Textos ajustados
- Botão otimizado para toque
- Espaçamento adequado

---

## 🚨 Troubleshooting

### Logo não aparece
```
Solução: Hospedar logo publicamente e atualizar URL
```

### Botão não funciona
```
Solução: Verificar se {{ .ConfirmationURL }} está presente
```

### Layout quebrado
```
Solução: Verificar se HTML foi copiado completamente
```

### Nome não aparece
```
Solução: Verificar se {{ .Data.name }} está no template
```

### Redirect errado
```
Solução: Verificar Redirect URLs no Supabase Dashboard
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador
2. Confira logs no Supabase Dashboard > Authentication > Logs
3. Teste com email diferente
4. Verifique spam/lixo eletrônico

---

## 🎯 Resultado Final

Após configuração completa, você terá:

✅ Email elegante e profissional
✅ Design consistente com o app
✅ Responsivo para todos dispositivos
✅ Experiência de usuário aprimorada
✅ Taxa de conversão melhorada

---

**Data**: 22/10/2025  
**Versão**: 1.0.0  
**Status**: ✅ Template pronto para uso

