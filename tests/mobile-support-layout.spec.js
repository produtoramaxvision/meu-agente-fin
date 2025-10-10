import { test, expect } from '@playwright/test';

test.describe('Layout Mobile - Sistema de Suporte', () => {
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

  test('Deve abrir sistema de suporte via menu hambúrguer no mobile', async ({ page }) => {
    // Verificar se estamos em mobile (sidebar deve estar oculto)
    const sidebar = page.locator('aside').first();
    // No mobile, o sidebar está oculto por padrão
    await expect(sidebar).toBeHidden();
    
    // Clicar no menu hambúrguer no header (botão de menu mobile)
    const menuButton = page.locator('button[aria-label*="Abrir menu"], button[aria-label*="menu"]').first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar se o sidebar mobile está visível (overlay)
    const mobileSidebar = page.locator('.fixed.inset-0.z-50').first();
    await expect(mobileSidebar).toBeVisible();
    
    // Clicar no botão "Ajuda" no sidebar mobile (usar o segundo botão que está visível)
    const helpButtons = page.locator('button:has-text("Ajuda"), a:has-text("Ajuda")');
    const visibleHelpButton = helpButtons.filter({ hasText: "Ajuda" }).nth(1); // Segundo botão
    await expect(visibleHelpButton).toBeVisible();
    await visibleHelpButton.click();
    await page.waitForTimeout(1000);
    
    // Clicar no botão "Suporte" no popover
    const supportButton = page.locator('button:has-text("Suporte"), a:has-text("Suporte")').first();
    await expect(supportButton).toBeVisible();
    await supportButton.click();
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog de suporte está aberto
    const supportDialog = page.locator('[role="dialog"]').first();
    await expect(supportDialog).toBeVisible();
    
    // Verificar se o dialog está visível na tela mobile
    const dialogBox = await supportDialog.boundingBox();
    expect(dialogBox?.width).toBeLessThanOrEqual(375); // Deve caber na largura mobile
    expect(dialogBox?.height).toBeLessThanOrEqual(667); // Deve caber na altura mobile
    
    console.log('Dialog dimensions:', dialogBox);
  });

  test('Deve verificar layout da aba Meus Tickets no mobile', async ({ page }) => {
    // Abrir sistema de suporte via menu hambúrguer
    const menuButton = page.locator('button[aria-label*="Abrir menu"], button[aria-label*="menu"]').first();
    await menuButton.click();
    await page.waitForTimeout(1000);
    
    // Clicar em Ajuda (usar o segundo botão que está visível)
    const helpButtons = page.locator('button:has-text("Ajuda"), a:has-text("Ajuda")');
    const visibleHelpButton = helpButtons.filter({ hasText: "Ajuda" }).nth(1);
    await visibleHelpButton.click();
    await page.waitForTimeout(1000);
    
    // Clicar em Suporte
    const supportButton = page.locator('button:has-text("Suporte"), a:has-text("Suporte")').first();
    await supportButton.click();
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog está aberto
    const supportDialog = page.locator('[role="dialog"]').first();
    await expect(supportDialog).toBeVisible();
    
    // Clicar na aba "Meus Tickets"
    const myTicketsTab = page.locator('[data-testid="my-tickets-tab"]');
    await expect(myTicketsTab).toBeVisible();
    await myTicketsTab.click();
    await page.waitForTimeout(1000);
    
    // Verificar se o conteúdo está visível e não cortado
    const emptyState = page.locator('text=Nenhum ticket encontrado');
    await expect(emptyState).toBeVisible();
    
    // Verificar se o ícone está visível
    const messageIcon = page.locator('svg').first();
    await expect(messageIcon).toBeVisible();
    
    // Verificar se a dica está visível
    const tipSection = page.locator('text=💡 Dica');
    await expect(tipSection).toBeVisible();
    
    // Verificar se o texto explicativo está visível
    const explanationText = page.locator('text=Use a aba "Novo Ticket" para criar seu primeiro ticket');
    await expect(explanationText).toBeVisible();
    
    // Verificar se o resumo do suporte está visível
    const summaryCard = page.locator('text=Resumo do Suporte');
    await expect(summaryCard).toBeVisible();
    
    // Verificar se o badge de tickets disponíveis está visível
    const ticketsBadge = page.locator('text=Tickets disponíveis');
    await expect(ticketsBadge).toBeVisible();
    
    // Fazer screenshot para verificar o layout
    await page.screenshot({ path: 'mobile-support-layout.png', fullPage: true });
    
    // Verificar se todos os elementos estão dentro da viewport
    const viewport = page.viewportSize();
    const allElements = page.locator('[role="dialog"] *');
    const elementCount = await allElements.count();
    
    console.log(`Viewport: ${viewport?.width}x${viewport?.height}`);
    console.log(`Elements in dialog: ${elementCount}`);
    
    // Verificar se o dialog não está cortado
    const dialogBox = await supportDialog.boundingBox();
    if (dialogBox) {
      expect(dialogBox.y).toBeGreaterThanOrEqual(0); // Não deve estar cortado no topo
      expect(dialogBox.y + dialogBox.height).toBeLessThanOrEqual(viewport?.height || 667); // Não deve estar cortado na parte inferior
    }
  });

  test('Deve verificar responsividade em diferentes tamanhos de mobile', async ({ page }) => {
    const mobileSizes = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11' },
      { width: 390, height: 844, name: 'iPhone 12' }
    ];
    
    for (const size of mobileSizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.waitForTimeout(500);
      
      console.log(`Testing ${size.name}: ${size.width}x${size.height}`);
      
      // Abrir sistema de suporte
      const menuButton = page.locator('button[aria-label*="Abrir menu"], button[aria-label*="menu"]').first();
      await menuButton.click();
      await page.waitForTimeout(1000);
      
      const helpButtons = page.locator('button:has-text("Ajuda"), a:has-text("Ajuda")');
      const visibleHelpButton = helpButtons.filter({ hasText: "Ajuda" }).nth(1);
      await visibleHelpButton.click();
      await page.waitForTimeout(1000);
      
      const supportButton = page.locator('button:has-text("Suporte"), a:has-text("Suporte")').first();
      await supportButton.click();
      await page.waitForTimeout(2000);
      
      // Verificar se o dialog está visível
      const supportDialog = page.locator('[role="dialog"]').first();
      await expect(supportDialog).toBeVisible();
      
      // Verificar se o conteúdo cabe na tela
      const dialogBox = await supportDialog.boundingBox();
      if (dialogBox) {
        expect(dialogBox.width).toBeLessThanOrEqual(size.width);
        expect(dialogBox.height).toBeLessThanOrEqual(size.height);
        
        console.log(`${size.name} - Dialog: ${dialogBox.width}x${dialogBox.height}`);
      }
      
      // Fechar dialog
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  });
});
