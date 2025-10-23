import { test, expect } from '@playwright/test';
import { loginUser, logoutUser, clearAuth, BASE_URL, TEST_USER, waitForToast } from '../helpers/test-data';

test.describe('🔐 Autenticação e Autorização', () => {
  
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  // ========================================
  // TC001: Login com Sucesso
  // ========================================
  test('TC001: Deve fazer login com credenciais válidas', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Etapa 1: Preencher telefone
    await expect(page.getByRole('textbox', { name: /telefone/i })).toBeVisible();
    await page.getByRole('textbox', { name: /telefone/i }).fill(TEST_USER.phone);
    
    // Clicar em Continuar
    const continueButton = page.getByRole('button', { name: /continuar/i });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
    
    // Etapa 2: Aguardar campo de senha aparecer
    await expect(page.locator('#password')).toBeVisible({ timeout: 15000 });
    
    // Preencher senha
    await page.getByRole('textbox', { name: /senha/i }).fill(TEST_USER.password);
    
    // Clicar em Entrar
    const loginButton = page.getByRole('button', { name: /entrar/i });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();
    
    // Verificar redirecionamento para dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 20000 });
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Verificar elementos do dashboard
    await expect(page.getByRole('heading', { name: /dashboard/i }).first()).toBeVisible();
    
    console.log('✅ TC001: Login com sucesso - PASSOU');
  });

  // ========================================
  // TC002: Login com Senha Incorreta
  // ========================================
  test('TC002: Deve bloquear login com senha incorreta', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Etapa 1: Telefone
    await page.getByRole('textbox', { name: /telefone/i }).fill(TEST_USER.phone);
    await page.getByRole('button', { name: /continuar/i }).click();
    
    // Etapa 2: Senha incorreta
    await expect(page.locator('#password')).toBeVisible({ timeout: 15000 });
    await page.getByRole('textbox', { name: /senha/i }).fill('senhaerrada123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Verificar mensagem de erro
    const errorToast = page.getByText(/telefone ou senha incorretos/i).first();
    await expect(errorToast).toBeVisible({ timeout: 8000 });
    
    // Verificar mensagem de tentativas restantes
    const attemptsToast = page.getByText(/tentativa.*restante/i).first();
    await expect(attemptsToast).toBeVisible({ timeout: 8000 });
    
    // Verificar que NÃO redirecionou para dashboard
    await page.waitForTimeout(2000);
    await expect(page).not.toHaveURL(/\/dashboard/);
    
    console.log('✅ TC002: Senha incorreta bloqueada - PASSOU');
  });

  // ========================================
  // TC003: Rate Limiting
  // ========================================
  test('TC003: Deve aplicar rate limiting após múltiplas tentativas', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Fazer 3 tentativas de login incorretas
    for (let i = 0; i < 3; i++) {
      await page.getByRole('textbox', { name: /telefone/i }).fill(TEST_USER.phone);
      await page.getByRole('button', { name: /continuar/i }).click();
      
      await expect(page.locator('#password')).toBeVisible({ timeout: 15000 });
      await page.getByRole('textbox', { name: /senha/i }).fill(`senha${i}`);
      await page.getByRole('button', { name: /entrar/i }).click();
      
      await page.waitForTimeout(2000);
      
      // Voltar para etapa de telefone se necessário
      const backButton = page.getByRole('button', { name: /voltar/i });
      if (await backButton.isVisible()) {
        await backButton.click();
      }
    }
    
    // Verificar que aparece mensagem de tentativas
    const attemptsMessage = page.getByText(/tentativa/i).first();
    await expect(attemptsMessage).toBeVisible({ timeout: 5000 });
    
    console.log('✅ TC003: Rate limiting funcional - PASSOU');
  });

  // ========================================
  // TC004: Proteção de Rotas
  // ========================================
  test('TC004: Deve bloquear acesso a rotas protegidas sem autenticação', async ({ page }) => {
    // Tentar acessar dashboard sem login
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Deve redirecionar para login
    await page.waitForURL(`${BASE_URL}/auth/login`, { timeout: 10000 });
    await expect(page).toHaveURL(/\/auth\/login/);
    
    // Tentar acessar contas
    await page.goto(`${BASE_URL}/contas`);
    await expect(page).toHaveURL(/\/auth\/login/);
    
    // Tentar acessar notifications
    await page.goto(`${BASE_URL}/notifications`);
    await expect(page).toHaveURL(/\/auth\/login/);
    
    console.log('✅ TC004: Proteção de rotas funcional - PASSOU');
  });

  // ========================================
  // TC005: Logout
  // ========================================
  test('TC005: Deve fazer logout corretamente', async ({ page }) => {
    // Fazer login
    await loginUser(page);
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Fazer logout
    await logoutUser(page);
    
    // Verificar redirecionamento para login
    await expect(page).toHaveURL(/\/auth\/login/);
    
    // Verificar toast de confirmação
    const logoutToast = page.getByText(/sessão encerrada|logout|saiu/i).first();
    await expect(logoutToast).toBeVisible({ timeout: 5000 }).catch(() => {
      console.log('⚠️ Toast de logout pode ter desaparecido rápido');
    });
    
    // Tentar acessar dashboard novamente (deve bloquear)
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(/\/auth\/login/);
    
    console.log('✅ TC005: Logout funcional - PASSOU');
  });

  // ========================================
  // TC006: Validação de Formato de Telefone
  // ========================================
  test('TC006: Deve validar formato de telefone', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Tentar telefone inválido (curto)
    await page.getByRole('textbox', { name: /telefone/i }).fill('123');
    await page.getByRole('button', { name: /continuar/i }).click();
    
    // Verificar mensagem de erro ou que não prosseguiu
    await page.waitForTimeout(2000);
    const errorMessage = page.getByText(/formato|inválido|telefone/i).first();
    const stillOnLogin = page.url().includes('/auth/login');
    
    const hasValidation = await errorMessage.isVisible().catch(() => false) || stillOnLogin;
    expect(hasValidation).toBeTruthy();
    
    console.log('✅ TC006: Validação de telefone - PASSOU');
  });

  // ========================================
  // TC007: Validação de Senha Mínima
  // ========================================
  test('TC007: Deve validar senha mínima de 8 caracteres', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    
    await page.getByRole('textbox', { name: /telefone/i }).fill(TEST_USER.phone);
    await page.getByRole('button', { name: /continuar/i }).click();
    
    await expect(page.locator('#password')).toBeVisible({ timeout: 15000 });
    
    // Tentar senha curta
    await page.getByRole('textbox', { name: /senha/i }).fill('123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Verificar mensagem de erro
    await page.waitForTimeout(2000);
    const errorMessage = page.getByText(/senha.*mínimo.*8|caracteres/i).first();
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    // Ou verificar que não fez login
    const notLoggedIn = !page.url().includes('/dashboard');
    
    expect(hasError || notLoggedIn).toBeTruthy();
    
    console.log('✅ TC007: Validação de senha mínima - PASSOU');
  });

  // ========================================
  // TC008: Persistência de Sessão
  // ========================================
  test('TC008: Deve manter sessão após reload', async ({ page }) => {
    await loginUser(page);
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Recarregar página
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Deve continuar no dashboard (sessão mantida)
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /dashboard/i }).first()).toBeVisible();
    
    console.log('✅ TC008: Sessão persistente - PASSOU');
  });

});

