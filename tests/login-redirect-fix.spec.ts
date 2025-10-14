import { test, expect } from '@playwright/test';

test.describe('Login Redirect Fix Test', () => {
  test('should redirect to dashboard without cycling back to login', async ({ page }) => {
    // Monitorar navegações
    const navigations: string[] = [];
    page.on('framenavigated', frame => {
      if (frame.url().includes('localhost:8080')) {
        navigations.push(frame.url());
        console.log('Navigation:', frame.url());
      }
    });

    // Monitorar console logs
    page.on('console', msg => {
      if (msg.text().includes('Auth state changed') || 
          msg.text().includes('Login') || 
          msg.text().includes('Error')) {
        console.log('Console:', msg.text());
      }
    });

    // Navegar para login
    await page.goto('http://localhost:8080/auth/login');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Initial page loaded');
    
    // Preencher formulário
    await page.fill('input[type="tel"]', '55 (11) 9 4974-6110');
    await page.fill('input[type="password"]', '12345678');
    
    console.log('✅ Form filled');
    
    // Clicar no botão de login
    await page.click('button[type="submit"]');
    
    // Aguardar mudança de estado do botão
    await page.waitForSelector('button[type="submit"]:has-text("Entrando...")');
    console.log('✅ Button state changed to "Entrando..."');
    
    // Aguardar redirecionamento para dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('✅ Redirected to dashboard');
    
    // Aguardar um pouco para garantir que não há mais redirecionamentos
    await page.waitForTimeout(3000);
    
    // Verificar se ainda estamos no dashboard
    const finalURL = page.url();
    console.log('Final URL:', finalURL);
    
    // Verificar se não houve ciclo de redirecionamento
    const loginNavigations = navigations.filter(url => url.includes('/auth/login'));
    const dashboardNavigations = navigations.filter(url => url.includes('/dashboard'));
    
    console.log('Login navigations:', loginNavigations.length);
    console.log('Dashboard navigations:', dashboardNavigations.length);
    console.log('All navigations:', navigations);
    
    // Verificar se estamos no dashboard
    expect(finalURL).toContain('/dashboard');
    
    // Verificar se não houve múltiplos redirecionamentos para login
    // Deve haver apenas 1 navegação para login (a inicial) e pelo menos 1 para dashboard
    expect(loginNavigations.length).toBeLessThanOrEqual(1);
    expect(dashboardNavigations.length).toBeGreaterThanOrEqual(1);
    
    // Verificar se os elementos do dashboard estão visíveis
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    console.log('✅ SUCCESS: Login redirect works without cycling!');
  });

  test('should handle page refresh correctly after login', async ({ page }) => {
    // Fazer login primeiro
    await page.goto('http://localhost:8080/auth/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="tel"]', '55 (11) 9 4974-6110');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Recarregar a página
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Aguardar um pouco para garantir que a autenticação foi processada
    await page.waitForTimeout(3000);
    
    // Verificar se ainda estamos no dashboard
    const urlAfterReload = page.url();
    console.log('URL after reload:', urlAfterReload);
    
    expect(urlAfterReload).toContain('/dashboard');
    
    // Verificar se os elementos do dashboard estão visíveis
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    console.log('✅ SUCCESS: Page refresh maintains session!');
  });
});
