import { test, expect } from '@playwright/test';

test.describe('Sidebar Toggle em Áreas Vazias', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de login e fazer login
    await page.goto('/auth/login');
    
    // Simular login (ajuste conforme sua implementação)
    await page.fill('input[type="tel"]', '11999999999');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para dashboard
    await page.waitForURL('/dashboard');
  });

  test('deve expandir sidebar quando clicar em áreas vazias (quando colapsado)', async ({ page }) => {
    const sidebar = page.locator('aside');
    
    // Primeiro, colapsar o sidebar clicando no botão de toggle
    const toggleButton = page.locator('button[aria-label*="menu"]').first();
    await toggleButton.click();
    
    // Verificar se o sidebar está colapsado
    await expect(sidebar).toHaveClass(/w-16/);
    
    // Clicar na área vazia do logo para expandir
    const logoArea = sidebar.locator('div').first();
    await logoArea.click();
    
    // Verificar se o sidebar expandiu
    await expect(sidebar).toHaveClass(/w-64/);
  });

  test('deve expandir sidebar quando clicar na área de navegação (quando colapsado)', async ({ page }) => {
    const sidebar = page.locator('aside');
    
    // Colapsar o sidebar
    const toggleButton = page.locator('button[aria-label*="menu"]').first();
    await toggleButton.click();
    
    // Verificar se está colapsado
    await expect(sidebar).toHaveClass(/w-16/);
    
    // Clicar na área de navegação para expandir
    const navArea = sidebar.locator('nav');
    await navArea.click();
    
    // Verificar se o sidebar expandiu
    await expect(sidebar).toHaveClass(/w-64/);
  });

  test('não deve interferir com cliques em links de navegação', async ({ page }) => {
    const sidebar = page.locator('aside');
    
    // Clicar em um link de navegação
    const dashboardLink = sidebar.locator('a[href="/dashboard"]');
    await dashboardLink.click();
    
    // Verificar se o sidebar não mudou de estado
    await expect(sidebar).toHaveClass(/w-64/);
  });

  test('não deve interferir com cliques em botões', async ({ page }) => {
    const sidebar = page.locator('aside');
    
    // Clicar no botão de ações rápidas
    const quickActionButton = sidebar.locator('button').first();
    await quickActionButton.click();
    
    // Verificar se o sidebar não mudou de estado
    await expect(sidebar).toHaveClass(/w-64/);
  });

  test('deve funcionar apenas quando sidebar está colapsado', async ({ page }) => {
    const sidebar = page.locator('aside');
    
    // Verificar se está expandido inicialmente
    await expect(sidebar).toHaveClass(/w-64/);
    
    // Tentar clicar na área vazia quando expandido
    const logoArea = sidebar.locator('div').first();
    await logoArea.click();
    
    // Verificar se o sidebar permanece expandido
    await expect(sidebar).toHaveClass(/w-64/);
  });
});
