# 📧 Templates de Email - Meu Agente

Templates de email personalizados para autenticação no Supabase, seguindo o design system minimalista preto e branco do app.

## 🎨 Design System

Todos os templates seguem o design elegante do Meu Agente:
- **Cores**: Preto (#000000), Branco (#FFFFFF), Cinza (#666666, #999999)
- **Bordas**: Arredondadas (8px-12px)
- **Sombras**: Sutis e minimalistas
- **Tipografia**: System fonts (-apple-system, Roboto, etc.)
- **Layout**: Responsivo e mobile-friendly

## 📁 Templates Disponíveis

### 1. `confirm-signup.html`
Template para confirmação de email após cadastro.

**Variáveis utilizadas:**
- `{{ .ConfirmationURL }}` - Link de confirmação
- `{{ .Data.name }}` - Nome do usuário (opcional)

### 2. `magic-link.html`
Template para login via magic link (email sem senha).

**Variáveis utilizadas:**
- `{{ .ConfirmationURL }}` - Link de login mágico

### 3. `reset-password.html`
Template para redefinição de senha.

**Variáveis utilizadas:**
- `{{ .ConfirmationURL }}` - Link de redefinição

## 🚀 Como Configurar no Supabase

### Método 1: Via Dashboard (Recomendado)

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Authentication > Email Templates**
3. Selecione o template que deseja personalizar:
   - **Confirm signup** → usar `confirm-signup.html`
   - **Magic Link** → usar `magic-link.html`
   - **Reset Password** → usar `reset-password.html`
4. Copie todo o conteúdo HTML do arquivo
5. Cole no editor do Supabase
6. Clique em **Save**

### Método 2: Via API Management

```bash
# Configure suas variáveis de ambiente
export SUPABASE_ACCESS_TOKEN="seu-access-token"
export PROJECT_REF="seu-project-ref"

# Atualizar template de confirmação
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @- <<'EOF'
{
  "mailer_subjects_confirmation": "Confirme seu email - Meu Agente",
  "mailer_templates_confirmation_content": "<!-- Cole aqui o conteúdo do confirm-signup.html -->"
}
EOF
```

### Método 3: Via Supabase CLI (Local Development)

1. Edite o arquivo `supabase/config.toml`:

```toml
[auth.email.template.confirmation]
subject = "Confirme seu email - Meu Agente"
content_path = "./supabase/email-templates/confirm-signup.html"

[auth.email.template.magic_link]
subject = "Seu Magic Link - Meu Agente"
content_path = "./supabase/email-templates/magic-link.html"

[auth.email.template.recovery]
subject = "Redefinir Senha - Meu Agente"
content_path = "./supabase/email-templates/reset-password.html"
```

2. Execute:
```bash
supabase functions deploy
```

## 🔧 Configurações Adicionais

### Redirect URLs

Configure as URLs de redirect no painel do Supabase:

1. Vá em **Authentication > URL Configuration**
2. Adicione as seguintes URLs em **Redirect URLs**:
   ```
   http://localhost:8080/auth/login
   https://app.meuagente.api.br/auth/login
   ```

### Site URL

1. Vá em **Authentication > URL Configuration**
2. Configure o **Site URL** para produção:
   ```
   https://app.meuagente.api.br
   ```

## 🖼️ Logo

### Implementação Atual

Os templates utilizam o **logotipo oficial** do Meu Agente hospedado no Supabase Storage:

```html
<img 
  src="https://pzoodkjepcarxnawuxoa.supabase.co/storage/v1/object/public/meuagente-logo/meuagente_logo_transparente-branco.png" 
  alt="Meu Agente" 
  class="logo-image" 
/>
```

**Especificações:**
- ✅ Formato: PNG transparente
- ✅ Cor: Branco (ideal para header escuro)
- ✅ Largura: 80px (responsivo)
- ✅ Hosting: Supabase Storage (público)
- ✅ Carregamento rápido e otimizado
- ✅ Renderizado perfeitamente em todos os clientes de email

### Personalizar com Outro Logo

Se desejar atualizar o logo:

1. **Faça upload da imagem** no Supabase Storage:
   ```bash
   supabase storage upload meuagente-logo novo_logo.png ./caminho/novo_logo.png
   ```

2. **Atualize a URL** nos 3 templates HTML se usar um nome diferente.

## 🧪 Testando os Templates

### Teste Local

1. Execute o Supabase localmente:
   ```bash
   supabase start
   ```

2. Configure o InBucket (captura de emails):
   ```
   http://localhost:54324
   ```

3. Faça um cadastro de teste no seu app

4. Verifique o email no InBucket

### Teste em Produção

⚠️ **Importante**: Teste com um email real antes de ativar para todos os usuários!

1. Crie uma conta de teste
2. Verifique a renderização no seu cliente de email
3. Teste em diferentes clientes:
   - Gmail (Web, Mobile)
   - Outlook (Web, Desktop)
   - Apple Mail
   - Thunderbird

## 📱 Responsividade

Todos os templates são totalmente responsivos:
- **Desktop**: Layout otimizado para leitura confortável
- **Mobile**: Adapta-se perfeitamente a telas pequenas
- **Dark Mode**: Funciona bem em ambos os temas

## 🔒 Segurança

Os templates incluem:
- ✅ Avisos de segurança claros
- ✅ Informações sobre expiração de links
- ✅ Instruções para usuários que não solicitaram a ação
- ✅ Links de suporte e privacidade

## 📞 Suporte

Se tiver problemas com os templates:
1. Verifique os logs no Supabase Dashboard
2. Teste em diferentes clientes de email
3. Valide o HTML em [Email on Acid](https://www.emailonacid.com/) ou similar

## 📝 Customização

Para personalizar os templates:
1. Mantenha as variáveis do Supabase intactas: `{{ .ConfirmationURL }}`, `{{ .Data.name }}`, etc.
2. Ajuste cores, fontes e espaçamentos conforme necessário
3. Teste em múltiplos clientes de email
4. Valide o HTML para garantir compatibilidade

---

**Versão**: 1.0.0  
**Data**: 22/01/2025  
**Status**: ✅ Pronto para uso

