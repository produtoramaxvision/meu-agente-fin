# Suite de Testes Playwright - Meu Agente

## 📋 Visão Geral

Suite completa de testes E2E para o sistema Meu Agente, cobrindo funcionalidades, acessibilidade, performance, segurança e testes de carga.

## 🗂️ Estrutura de Arquivos

```
tests/
├── helpers/
│   └── login.ts              # Helper de login compartilhado
├── acessibilidade.spec.ts    # Testes WCAG 2.1 AA (9 testes)
├── multi-browser.spec.ts     # Chrome, Firefox, WebKit (12 testes)
├── performance.spec.ts       # LCP, FCP, TTI, métricas (10 testes)
├── seguranca.spec.ts         # XSS, CSRF, cookies (10 testes)
├── carga.spec.ts             # 5-20 usuários simultâneos (4 testes)
├── realtime-stress.spec.ts   # Stress Supabase Realtime (5 testes)
├── responsividade-avancada.spec.ts  # 6+ viewports (12 testes)
└── validacao-simples.spec.ts # Testes básicos existentes (17 testes)
```

## 🚀 Como Executar

### Pré-requisitos

```bash
# Instalar dependências
npm install
npm install -D @axe-core/playwright

# Iniciar aplicação na porta 8080
npm run preview
# ou
npm run dev:testsprite
```

### Executar Todos os Testes

```bash
npx playwright test
```

### Executar Testes Específicos

```bash
# Apenas acessibilidade
npx playwright test tests/acessibilidade.spec.ts

# Apenas performance
npx playwright test tests/performance.spec.ts

# Apenas segurança
npx playwright test tests/seguranca.spec.ts

# Apenas multi-browser
npx playwright test tests/multi-browser.spec.ts

# Apenas testes de carga
npx playwright test tests/carga.spec.ts

# Apenas stress Realtime
npx playwright test tests/realtime-stress.spec.ts

# Apenas responsividade
npx playwright test tests/responsividade-avancada.spec.ts
```

### Executar em Browsers Específicos

```bash
# Apenas Chrome
npx playwright test --project=chromium

# Apenas Firefox
npx playwright test --project=firefox

# Apenas WebKit (Safari)
npx playwright test --project=webkit

# Apenas Mobile
npx playwright test --project=mobile-chrome --project=mobile-safari

# Todos os browsers
npx playwright test --project=chromium --project=firefox --project=webkit
```

### Modo Debug

```bash
# Com UI interativa
npx playwright test --ui

# Com debug detalhado
npx playwright test --debug

# Apenas headed (com navegador visível)
npx playwright test --headed
```

### Relatórios

```bash
# Ver relatório HTML
npx playwright show-report

# Ver traces de falhas
npx playwright show-trace playwright-report/trace.zip
```

## 📊 Cobertura de Testes

| Categoria | Arquivo | Testes | Descrição |
|-----------|---------|--------|-----------|
| **Acessibilidade** | `acessibilidade.spec.ts` | 9 | WCAG 2.1 AA, axe-core, contraste, ARIA |
| **Multi-Browser** | `multi-browser.spec.ts` | 12 | Chrome, Firefox, WebKit |
| **Performance** | `performance.spec.ts` | 10 | LCP, FCP, TTI, CLS, bundle size |
| **Segurança** | `seguranca.spec.ts` | 10 | XSS, SQL Injection, CSRF, cookies |
| **Carga** | `carga.spec.ts` | 4 | 5-20 usuários simultâneos |
| **Realtime Stress** | `realtime-stress.spec.ts` | 5 | Conexões, latência, memory leaks |
| **Responsividade** | `responsividade-avancada.spec.ts` | 12 | Desktop, tablet, mobile |
| **Validação Básica** | `validacao-simples.spec.ts` | 17 | Login, CRUD, navegação |
| **TOTAL** | | **79** | **Cobertura completa** |

## 🎯 Detalhamento dos Testes

### 1. Acessibilidade (WCAG 2.1 AA)

- ✅ Página de login sem violações
- ✅ Dashboard acessível
- ✅ Página de Contas acessível
- ✅ Página de Notificações acessível
- ✅ Contraste de cores adequado
- ✅ Labels de formulários presentes
- ✅ Atributos ARIA válidos
- ✅ Navegação por teclado funcional
- ✅ Imagens com texto alternativo

### 2. Multi-Browser

- ✅ Login em todos browsers
- ✅ Navegação em todos browsers
- ✅ UI financeira em todos browsers
- ✅ Logout em todos browsers
- ✅ Formulários em todos browsers
- ✅ Dados carregam em todos browsers
- ✅ Tema persiste em todos browsers
- ✅ Responsividade em todos browsers
- ✅ Notificações em todos browsers
- ✅ Performance em todos browsers
- ✅ Proteção de rotas em todos browsers
- ✅ Renderização consistente em todos browsers

### 3. Performance

- ✅ Login < 2s
- ✅ Dashboard < 3s
- ✅ LCP < 2.5s
- ✅ FCP < 1.8s
- ✅ CLS < 0.1
- ✅ Navegação entre páginas < 1s
- ✅ Carregamento dados financeiros < 2s
- ✅ Requisições de rede < 50
- ✅ JavaScript bundle aceitável (< 3MB)
- ✅ Web Vitals (TTFB, DOM Content Loaded)

### 4. Segurança

- ✅ XSS bloqueado em inputs
- ✅ SQL Injection bloqueado
- ✅ Rate limiting funcional
- ✅ Session hijacking prevention
- ✅ Cookies seguros (HttpOnly, SameSite)
- ✅ Content Security Policy
- ✅ Proteção contra clickjacking
- ✅ Inputs sanitizados
- ✅ Logout limpa sessão
- ✅ Senha não exposta em rede

### 5. Testes de Carga

- ✅ 5 usuários simultâneos login
- ✅ 10 usuários simultâneos navegando
- ✅ 5 usuários carregando dados
- ✅ 8 sessões ativas mantendo performance

### 6. Realtime Stress

- ✅ 10 abas conexão Realtime ativa
- ✅ Multi-tab sync com 5 abas
- ✅ Reconnection após disconnect
- ✅ Sem memory leak
- ✅ Latência < 2s

### 7. Responsividade Avançada

- ✅ Desktop 1920x1080
- ✅ Desktop 1366x768
- ✅ Tablet iPad Pro (Landscape)
- ✅ Tablet iPad Mini (Portrait)
- ✅ Mobile iPhone 12
- ✅ Mobile Samsung Galaxy
- ✅ Mobile Landscape
- ✅ Elementos clicáveis 44x44px
- ✅ Texto legível em todos dispositivos
- ✅ Dashboard responsivo
- ✅ Imagens não distorcem
- ✅ Modais responsivos

## 🔧 Configuração

### playwright.config.ts

```typescript
- Timeout: 90s (para testes de carga)
- Retries: 1 (local), 2 (CI)
- Workers: 3 (paralelismo controlado)
- Trace: retain-on-failure
- Screenshot: only-on-failure
- Video: retain-on-failure
```

### Projects Configurados

1. **chromium** - Desktop Chrome (1920x1080)
2. **firefox** - Desktop Firefox (1920x1080)
3. **webkit** - Desktop Safari (1920x1080)
4. **tablet-ipad** - iPad Pro (1024x768)
5. **mobile-chrome** - Pixel 5
6. **mobile-safari** - iPhone 12

## 📝 Credenciais de Teste

```typescript
Phone: 5511949746110
Password: 123456789
URL: http://localhost:8080
```

## 🎓 Boas Práticas

1. **Helper Compartilhado**: `login()` reutilizado em todos os testes
2. **Timeouts Adequados**: 90s para testes de carga, 15s para assertions
3. **Retry Strategy**: 1 retry local, 2 em CI
4. **Logs Detalhados**: Console logs para debugging
5. **Cleanup**: Sempre fechar contextos/páginas após testes
6. **Assertions Específicas**: Verificações precisas, não genéricas

## 🐛 Debugging

```bash
# Ver traces de falhas
npx playwright show-trace playwright-report/trace.zip

# Executar teste específico com debug
npx playwright test tests/acessibilidade.spec.ts --debug

# Ver screenshots de falhas
ls playwright-report/screenshots/

# Ver vídeos de falhas
ls playwright-report/videos/
```

## 📈 Métricas de Sucesso

- **Cobertura**: 79 testes cobrindo todas as funcionalidades principais
- **Performance**: LCP < 2.5s, FCP < 1.8s, CLS < 0.1
- **Acessibilidade**: 100% WCAG 2.1 AA compliance
- **Segurança**: XSS, CSRF, SQL Injection bloqueados
- **Carga**: Suporta 10+ usuários simultâneos
- **Compatibilidade**: Chrome, Firefox, Safari (desktop + mobile)

## 🔄 CI/CD

Para integração com CI/CD, adicionar:

```yaml
# .github/workflows/playwright.yml
- name: Run Playwright tests
  run: npx playwright test
- name: Upload report
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 📚 Recursos

- [Playwright Docs](https://playwright.dev)
- [Axe-core Docs](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)

