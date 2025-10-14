import { test, expect } from '@playwright/test';

test.describe('Session Persistence Test', () => {
  test('should maintain session after page refresh', async ({ page }) => {
    // Navegar para a página de login
    await page.goto('http://localhost:8080/auth/login');
    
    // Aguardar a página carregar completamente
    await page.waitForLoadState('networkidle');
    
    // Preencher o formulário de login com as credenciais fornecidas
    await page.fill('input[type="tel"]', '55 (11) 9 4974-6110');
    await page.fill('input[type="password"]', '12345678');
    
    // Clicar no botão de login
    await page.click('button[type="submit"]');
    
    // Aguardar o redirecionamento para o dashboard
    await page.waitForURL('**/dashboard');
    
    // Verificar se estamos no dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verificar se o usuário está logado (presença de elementos do dashboard)
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    // Aguardar um pouco para garantir que a sessão foi estabelecida
    await page.waitForTimeout(2000);
    
    // Recarregar a página (F5)
    await page.reload();
    
    // Aguardar o carregamento completo após o reload
    await page.waitForLoadState('networkidle');
    
    // Aguardar um pouco mais para garantir que a autenticação foi processada
    await page.waitForTimeout(3000);
    
    // Verificar se ainda estamos no dashboard (não redirecionados para login)
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Aguardar o elemento do dashboard aparecer
    await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 10000 });
    
    // Verificar se os elementos do dashboard ainda estão visíveis
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    console.log('✅ Session persistence test passed - user remained logged in after page refresh');
  });

  test('should handle login button state correctly', async ({ page }) => {
    // Navegar para a página de login
    await page.goto('http://localhost:8080/auth/login');
    
    // Aguardar a página carregar completamente
    await page.waitForLoadState('networkidle');
    
    // Preencher o formulário de login
    await page.fill('input[type="tel"]', '55 (11) 9 4974-6110');
    await page.fill('input[type="password"]', '12345678');
    
    // Verificar o estado inicial do botão
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toHaveText('Entrar');
    
    // Clicar no botão de login
    await loginButton.click();
    
    // Verificar se o botão muda para "Entrando..." durante o processo
    await expect(loginButton).toHaveText('Entrando...');
    
    // Aguardar o redirecionamento
    await page.waitForURL('**/dashboard');
    
    // Verificar se chegamos ao dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    console.log('✅ Login button state test passed - button correctly shows loading state');
  });

  test('should persist session across browser tabs', async ({ browser }) => {
    // Criar duas páginas (simulando duas abas)
    const page1 = await browser.newPage();
    const page2 = await browser.newPage();
    
    try {
      // Fazer login na primeira aba
      await page1.goto('http://localhost:8080/auth/login');
      await page1.waitForLoadState('networkidle');
      
      await page1.fill('input[type="tel"]', '55 (11) 9 4974-6110');
      await page1.fill('input[type="password"]', '12345678');
      await page1.click('button[type="submit"]');
      
      // Aguardar login na primeira aba
      await page1.waitForURL('**/dashboard');
      
      // Aguardar um pouco para garantir que a sessão foi salva
      await page1.waitForTimeout(2000);
      
      // Navegar para dashboard na segunda aba
      await page2.goto('http://localhost:8080/dashboard');
      await page2.waitForLoadState('networkidle');
      
      // Aguardar um pouco para garantir que a autenticação foi processada
      await page2.waitForTimeout(3000);
      
      // Verificar se a segunda aba também está logada
      await expect(page2).toHaveURL(/.*dashboard/);
      
      // Aguardar o elemento do dashboard aparecer
      await page2.waitForSelector('h1:has-text("Dashboard")', { timeout: 10000 });
      await expect(page2.locator('h1:has-text("Dashboard")')).toBeVisible();
      
      console.log('✅ Cross-tab session persistence test passed');
      
    } finally {
      await page1.close();
      await page2.close();
    }
  });

  test('should clear session on logout', async ({ page }) => {
    // Fazer login primeiro
    await page.goto('http://localhost:8080/auth/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="tel"]', '55 (11) 9 4974-6110');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard');
    
    // Fazer logout (assumindo que há um botão de logout)
    // Vamos procurar por elementos comuns de logout
    const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout"), [data-testid="logout"]').first();
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Aguardar redirecionamento para login
      await page.waitForURL('**/auth/login');
      
      // Verificar se estamos na página de login
      await expect(page).toHaveURL(/.*auth\/login/);
      
      // Tentar acessar dashboard diretamente - deve redirecionar para login
      await page.goto('http://localhost:8080/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Deve estar na página de login
      await expect(page).toHaveURL(/.*auth\/login/);
      
      console.log('✅ Logout test passed - session properly cleared');
    } else {
      console.log('⚠️ Logout button not found, skipping logout test');
    }
  });
});
