# 📧 Guia de Configuração de Email - Supabase

## ✅ Implementações Já Realizadas no Código

### 1. Redirect URLs Dinâmicos
- ✅ **Produção**: `https://app.meuagente.api.br/auth/login`
- ✅ **Desenvolvimento**: `http://localhost:8080/auth/login`
- ✅ Detecção automática baseada no hostname

### 2. Template de Email Personalizado
- ✅ Design minimalista preto e branco
- ✅ Totalmente em português
- ✅ Responsivo (mobile + desktop)
- ✅ Marca Meu Agente®
- ✅ Call-to-action claro
- ✅ Informações de segurança

---

## 🔧 Configuração no Painel do Supabase

### Passo 1: Acessar Configurações de Autenticação

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. No menu lateral, clique em **Authentication**
3. Clique na aba **Settings**

### Passo 2: Habilitar Confirmação de Email

1. Localize a seção **Email Auth**
2. **Ative** a opção: ✅ **Enable email confirmations**
3. **Salve** as alterações

### Passo 3: Configurar Redirect URLs

1. Ainda em **Authentication > Settings**
2. Localize a seção **Redirect URLs**
3. Adicione as seguintes URLs:

```
http://localhost:8080/auth/login
https://app.meuagente.api.br/auth/login
```

4. Clique em **Save**

### Passo 4: Configurar Template de Email

1. No menu lateral, clique em **Authentication**
2. Clique na aba **Email Templates**
3. Selecione **Confirm signup**

4. **Copie e cole o template abaixo** (substitua TODO o conteúdo):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirme seu Email - Meu Agente</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background-color: #FAFAFA; color: #000000; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; }
        .header { background: linear-gradient(135deg, #000000 0%, #1A1A1A 100%); padding: 40px 20px; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.2); margin: 0 auto 20px; }
        .header-title { color: #FFFFFF; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
        .content { padding: 48px 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #000000; margin: 0 0 24px 0; }
        .message { font-size: 16px; line-height: 1.6; color: #666666; margin: 0 0 32px 0; }
        .button-container { text-align: center; margin: 40px 0; }
        .cta-button { display: inline-block; background-color: #000000; color: #FFFFFF !important; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .cta-button:hover { background-color: #1A1A1A; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); }
        .alternative-link { background-color: #F5F5F5; border: 1px solid #E0E0E0; border-radius: 8px; padding: 20px; margin: 32px 0; }
        .alternative-link p { font-size: 14px; color: #666666; margin: 0 0 12px 0; }
        .link-text { font-size: 13px; color: #1A1A1A; word-break: break-all; font-family: 'Courier New', monospace; background-color: #FFFFFF; padding: 12px; border-radius: 4px; border: 1px solid #E0E0E0; display: block; }
        .info-box { background-color: #F9FAFB; border-left: 4px solid #000000; padding: 16px 20px; margin: 32px 0; }
        .info-box p { font-size: 14px; color: #666666; margin: 0; line-height: 1.5; }
        .footer { background-color: #F5F5F5; padding: 32px 20px; text-align: center; border-top: 1px solid #E0E0E0; }
        .footer-text { font-size: 13px; color: #999999; margin: 8px 0; }
        .footer-links { margin: 16px 0; }
        .footer-link { color: #666666; text-decoration: none; font-size: 13px; margin: 0 12px; }
        .footer-link:hover { color: #000000; text-decoration: underline; }
        @media only screen and (max-width: 600px) {
            .content { padding: 32px 24px !important; }
            .header-title { font-size: 24px !important; }
            .cta-button { padding: 14px 32px !important; font-size: 15px !important; }
            .greeting { font-size: 16px !important; }
            .message { font-size: 15px !important; }
        }
    </style>
</head>
<body>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container">
                    <tr>
                        <td class="header">
                            <h1 class="header-title">Meu Agente®</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <p class="greeting">Olá, {{ .Data.name }}!</p>
                            <p class="message">Bem-vindo ao <strong>Meu Agente</strong> - sua plataforma inteligente de gestão financeira pessoal.</p>
                            <p class="message">Para começar a usar todas as funcionalidades e manter sua conta segura, precisamos confirmar seu endereço de email.</p>
                            <div class="button-container">
                                <a href="{{ .ConfirmationURL }}" class="cta-button">Confirmar Meu Email</a>
                            </div>
                            <div class="alternative-link">
                                <p><strong>Ou copie e cole este link no seu navegador:</strong></p>
                                <span class="link-text">{{ .ConfirmationURL }}</span>
                            </div>
                            <div class="info-box">
                                <p><strong>⏱️ Este link expira em 24 horas</strong><br>Se você não se cadastrou no Meu Agente, ignore este email com segurança.</p>
                            </div>
                            <p class="message">Após confirmar seu email, você terá acesso completo a:</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
                                <tr><td style="padding: 8px 0;"><p style="margin: 0; font-size: 15px; color: #666666;">✓ Dashboard financeiro inteligente</p></td></tr>
                                <tr><td style="padding: 8px 0;"><p style="margin: 0; font-size: 15px; color: #666666;">✓ Controle completo de receitas e despesas</p></td></tr>
                                <tr><td style="padding: 8px 0;"><p style="margin: 0; font-size: 15px; color: #666666;">✓ Metas e planejamento financeiro</p></td></tr>
                                <tr><td style="padding: 8px 0;"><p style="margin: 0; font-size: 15px; color: #666666;">✓ Relatórios e análises detalhadas</p></td></tr>
                                <tr><td style="padding: 8px 0;"><p style="margin: 0; font-size: 15px; color: #666666;">✓ Agenda e organização de tarefas</p></td></tr>
                            </table>
                            <p class="message" style="margin-top: 32px;">Estamos animados para ter você conosco!</p>
                            <p class="message" style="color: #000000; font-weight: 600;">Equipe Meu Agente<br><span style="font-weight: 400; font-size: 14px; color: #666666;">Gestão Financeira Inteligente</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            <p class="footer-text"><strong>Meu Agente®</strong> - Gestão Financeira Pessoal</p>
                            <div class="footer-links">
                                <a href="https://app.meuagente.api.br" class="footer-link">Acessar Plataforma</a>
                                <a href="https://app.meuagente.api.br/suporte" class="footer-link">Central de Ajuda</a>
                            </div>
                            <p class="footer-text">© 2025 Meu Agente. Todos os direitos reservados.</p>
                            <p class="footer-text" style="margin-top: 16px; font-size: 12px;">Você recebeu este email porque criou uma conta no Meu Agente.<br>Se você não reconhece esta ação, pode ignorar este email com segurança.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

5. Clique em **Save**

### Passo 5: Testar o Email

1. Faça um teste criando uma nova conta
2. Verifique sua caixa de entrada
3. O email deve chegar em português com o design do Meu Agente

---

## 🎨 Customizações Opcionais

### Adicionar Logo no Email

Se quiser adicionar a logo circular no header do email:

1. Faça upload da imagem `meuagente_logo.jpg` para um servidor acessível
2. No template, localize esta linha:

```html
<h1 class="header-title">Meu Agente®</h1>
```

3. Substitua por:

```html
<img src="https://SEU-SERVIDOR/meuagente_logo.jpg" alt="Meu Agente" class="logo">
<h1 class="header-title">Meu Agente®</h1>
```

### Personalizar Assunto do Email

1. Em **Email Templates > Confirm signup**
2. Localize o campo **Subject**
3. Altere para: `Confirme seu email - Meu Agente`

---

## 📊 Monitoramento

### Verificar Emails Enviados

1. Acesse **Authentication > Logs**
2. Filtre por tipo: **Email**
3. Você verá todos os emails de confirmação enviados

### Testar em Desenvolvimento

Em modo desenvolvimento (localhost):
- Emails aparecem nos logs do Supabase
- Copie o link de confirmação dos logs
- Cole no navegador para testar

---

## 🔒 Segurança

### Variáveis Disponíveis no Template

- `{{ .Data.name }}` - Nome do usuário
- `{{ .ConfirmationURL }}` - Link de confirmação
- `{{ .SiteURL }}` - URL do site
- `{{ .Token }}` - Token de confirmação
- `{{ .TokenHash }}` - Hash do token

### Expiração do Link

- Padrão: 24 horas
- Configurável em **Settings > Auth > Email**

---

## 📝 Checklist de Configuração

- [ ] Habilitar "Enable email confirmations"
- [ ] Adicionar Redirect URLs (localhost + produção)
- [ ] Configurar template de email personalizado
- [ ] Personalizar assunto do email
- [ ] Testar com conta de teste
- [ ] Verificar email recebido
- [ ] Confirmar redirect funciona
- [ ] Testar em produção

---

## 🆘 Troubleshooting

### Email não chega

**Problema**: Email não está sendo entregue

**Soluções**:
1. Verifique spam/lixo eletrônico
2. Verifique logs em **Authentication > Logs**
3. Confirme que "Enable email confirmations" está ativo
4. Teste com outro provedor de email

### Link de confirmação não funciona

**Problema**: Erro ao clicar no link

**Soluções**:
1. Verifique se Redirect URLs estão corretas
2. Confirme que link não expirou (24h)
3. Teste copiar/colar o link manualmente
4. Verifique console do navegador

### Email em inglês

**Problema**: Email ainda vem em inglês

**Soluções**:
1. Confirme que salvou o template em **Confirm signup**
2. Limpe cache do navegador
3. Aguarde alguns minutos para propagação
4. Teste com nova conta

---

## 📈 Próximos Passos

Após configurar confirmação de email:

1. **Configurar SMTP Customizado** (Opcional)
   - Gmail, SendGrid, Mailgun
   - Melhor deliverability
   - Mais controle

2. **Templates Adicionais**
   - Password Reset
   - Email Change
   - Magic Link

3. **Analytics**
   - Taxa de confirmação
   - Tempo médio de confirmação
   - Bounce rate

---

**Data**: 22/01/2025  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para configuração

