import { test, expect } from '@playwright/test';

test.describe('Consistência de Altura das Abas do Suporte', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a aplicação
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    
    // Fazer login
    await page.fill('input[type="tel"], input[placeholder*="telefone"]', '5511949746110');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"], button:has-text("Entrar")');
    await page.waitForTimeout(3000);
  });

  test('Deve manter altura consistente entre todas as abas', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog está aberto
    const supportDialog = page.locator('[role="dialog"]').first();
    await expect(supportDialog).toBeVisible();
    
    // Obter altura inicial do dialog
    const dialogBox = await supportDialog.boundingBox();
    const initialHeight = dialogBox?.height || 0;
    console.log('Altura inicial do dialog:', initialHeight);
    
    // Testar aba "Novo Ticket"
    const newTicketTab = page.locator('[data-testid="new-ticket-tab"]');
    await newTicketTab.click();
    await page.waitForTimeout(1000);
    
    const newTicketDialogBox = await supportDialog.boundingBox();
    const newTicketHeight = newTicketDialogBox?.height || 0;
    console.log('Altura na aba Novo Ticket:', newTicketHeight);
    
    // Testar aba "Meus Tickets"
    const myTicketsTab = page.locator('[data-testid="my-tickets-tab"]');
    await myTicketsTab.click();
    await page.waitForTimeout(1000);
    
    const myTicketsDialogBox = await supportDialog.boundingBox();
    const myTicketsHeight = myTicketsDialogBox?.height || 0;
    console.log('Altura na aba Meus Tickets:', myTicketsHeight);
    
    // Testar aba "FAQ"
    const faqTab = page.locator('[data-testid="faq-tab"]');
    await faqTab.click();
    await page.waitForTimeout(1000);
    
    const faqDialogBox = await supportDialog.boundingBox();
    const faqHeight = faqDialogBox?.height || 0;
    console.log('Altura na aba FAQ:', faqHeight);
    
    // Verificar se as alturas são consistentes (diferença máxima de 50px)
    const heights = [newTicketHeight, myTicketsHeight, faqHeight];
    const maxHeight = Math.max(...heights);
    const minHeight = Math.min(...heights);
    const heightDifference = maxHeight - minHeight;
    
    console.log('Altura máxima:', maxHeight);
    console.log('Altura mínima:', minHeight);
    console.log('Diferença de altura:', heightDifference);
    
    // A diferença deve ser pequena (máximo 50px para permitir pequenas variações)
    expect(heightDifference).toBeLessThan(50);
    
    // Todas as alturas devem ser maiores que 400px (altura mínima esperada)
    heights.forEach((height, index) => {
      const tabNames = ['Novo Ticket', 'Meus Tickets', 'FAQ'];
      expect(height).toBeGreaterThan(400, `Altura da aba ${tabNames[index]} deve ser maior que 400px`);
    });
  });

  test('Deve verificar se a aba Meus Tickets tem conteúdo expandido', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Clicar na aba "Meus Tickets"
    const myTicketsTab = page.locator('[data-testid="my-tickets-tab"]');
    await myTicketsTab.click();
    await page.waitForTimeout(1000);
    
    // Verificar se há conteúdo expandido
    const emptyState = page.locator('text=Nenhum ticket encontrado');
    await expect(emptyState).toBeVisible();
    
    // Verificar se há ícone maior
    const messageIcon = page.locator('svg').filter({ hasText: /MessageSquare|message/ });
    await expect(messageIcon).toBeVisible();
    
    // Verificar se há dica adicional
    const tipSection = page.locator('text=💡 Dica');
    await expect(tipSection).toBeVisible();
    
    // Verificar se há texto explicativo expandido
    const explanationText = page.locator('text=Use a aba "Novo Ticket" para criar seu primeiro ticket');
    await expect(explanationText).toBeVisible();
  });

  test('Deve verificar se o layout é responsivo em diferentes tamanhos', async ({ page }) => {
    // Testar em diferentes tamanhos de tela
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      // Abrir sistema de suporte
      await page.click('button:has-text("Ajuda")');
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
      await page.waitForTimeout(2000);
      
      // Verificar se o dialog está visível
      const supportDialog = page.locator('[role="dialog"]').first();
      await expect(supportDialog).toBeVisible();
      
      // Testar todas as abas
      const tabs = [
        { selector: '[data-testid="new-ticket-tab"]', name: 'Novo Ticket' },
        { selector: '[data-testid="my-tickets-tab"]', name: 'Meus Tickets' },
        { selector: '[data-testid="faq-tab"]', name: 'FAQ' }
      ];
      
      for (const tab of tabs) {
        await page.click(tab.selector);
        await page.waitForTimeout(500);
        
        const dialogBox = await supportDialog.boundingBox();
        const height = dialogBox?.height || 0;
        
        console.log(`${viewport.name} - ${tab.name}: ${height}px`);
        
        // Verificar se a altura é razoável para o viewport
        if (viewport.name === 'Mobile') {
          expect(height).toBeLessThan(600); // Mobile deve ser menor
        } else {
          expect(height).toBeGreaterThan(400); // Desktop/Tablet devem ser maiores
        }
      }
      
      // Fechar dialog
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  });
});
