import { test, expect } from '@playwright/test';

test.describe('Debug Mobile Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar viewport para mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navegar para a aplicação
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    
    // Fazer login
    await page.fill('input[type="tel"], input[placeholder*="telefone"]', '5511949746110');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"], button:has-text("Entrar")');
    await page.waitForTimeout(3000);
  });

  test('Debug - Verificar elementos no mobile', async ({ page }) => {
    // Verificar se o botão de menu está visível
    const menuButton = page.locator('button[aria-label*="Abrir menu"], button[aria-label*="menu"]').first();
    await expect(menuButton).toBeVisible();
    console.log('Menu button found and visible');
    
    // Clicar no menu
    await menuButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar se o sidebar mobile está visível
    const mobileSidebar = page.locator('.fixed.inset-0.z-50').first();
    await expect(mobileSidebar).toBeVisible();
    console.log('Mobile sidebar is visible');
    
    // Fazer screenshot do sidebar aberto
    await page.screenshot({ path: 'mobile-sidebar-open.png', fullPage: true });
    
    // Procurar por qualquer botão com texto "Ajuda"
    const helpButtons = page.locator('button:has-text("Ajuda"), a:has-text("Ajuda")');
    const helpButtonCount = await helpButtons.count();
    console.log(`Found ${helpButtonCount} help buttons`);
    
    // Verificar se algum botão de ajuda está visível
    for (let i = 0; i < helpButtonCount; i++) {
      const button = helpButtons.nth(i);
      const isVisible = await button.isVisible();
      console.log(`Help button ${i}: visible = ${isVisible}`);
      
      if (isVisible) {
        const text = await button.textContent();
        console.log(`Help button ${i} text: "${text}"`);
      }
    }
    
    // Procurar por ícones de ajuda
    const helpIcons = page.locator('svg').filter({ hasText: /HelpCircle|help/i });
    const helpIconCount = await helpIcons.count();
    console.log(`Found ${helpIconCount} help icons`);
    
    // Procurar por qualquer elemento que contenha "Ajuda"
    const allHelpElements = page.locator('*:has-text("Ajuda")');
    const allHelpCount = await allHelpElements.count();
    console.log(`Found ${allHelpCount} elements containing "Ajuda"`);
    
    // Listar todos os botões no sidebar
    const sidebarButtons = page.locator('.fixed.inset-0.z-50 button');
    const sidebarButtonCount = await sidebarButtons.count();
    console.log(`Found ${sidebarButtonCount} buttons in mobile sidebar`);
    
    for (let i = 0; i < sidebarButtonCount; i++) {
      const button = sidebarButtons.nth(i);
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`Sidebar button ${i}: "${text}" - visible: ${isVisible}`);
    }
  });
});
