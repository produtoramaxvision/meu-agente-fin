import { test, expect } from '@playwright/test';

test.describe('Bug do Sidebar - Investigação', () => {
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

  test('Deve investigar o bug do sidebar ao clicar nas abas', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog está aberto
    const supportDialog = page.locator('[role="dialog"]').first();
    await expect(supportDialog).toBeVisible();
    
    // Verificar estado inicial do sidebar
    const sidebar = page.locator('[data-testid="sidebar"], .sidebar, nav[role="navigation"]').first();
    const initialSidebarState = await sidebar.getAttribute('data-state') || 'closed';
    console.log('Estado inicial do sidebar:', initialSidebarState);
    
    // Clicar na aba "Meus Tickets"
    const myTicketsTab = page.locator('[data-testid="my-tickets-tab"]');
    await expect(myTicketsTab).toBeVisible();
    
    // Verificar se o sidebar muda de estado ao clicar
    await myTicketsTab.click();
    await page.waitForTimeout(500);
    
    const afterClickSidebarState = await sidebar.getAttribute('data-state') || 'closed';
    console.log('Estado do sidebar após clicar em Meus Tickets:', afterClickSidebarState);
    
    // Clicar na aba "FAQ"
    const faqTab = page.locator('[data-testid="faq-tab"]');
    await expect(faqTab).toBeVisible();
    
    await faqTab.click();
    await page.waitForTimeout(500);
    
    const afterFAQClickSidebarState = await sidebar.getAttribute('data-state') || 'closed';
    console.log('Estado do sidebar após clicar em FAQ:', afterFAQClickSidebarState);
    
    // Clicar na aba "Novo Ticket"
    const newTicketTab = page.locator('[data-testid="new-ticket-tab"]');
    await expect(newTicketTab).toBeVisible();
    
    await newTicketTab.click();
    await page.waitForTimeout(500);
    
    const afterNewTicketClickSidebarState = await sidebar.getAttribute('data-state') || 'closed';
    console.log('Estado do sidebar após clicar em Novo Ticket:', afterNewTicketClickSidebarState);
    
    // Verificar se há mudanças no estado do sidebar
    const sidebarStates = [initialSidebarState, afterClickSidebarState, afterFAQClickSidebarState, afterNewTicketClickSidebarState];
    const uniqueStates = [...new Set(sidebarStates)];
    
    if (uniqueStates.length > 1) {
      console.log('BUG CONFIRMADO: Sidebar está mudando de estado:', uniqueStates);
    } else {
      console.log('Sidebar mantém estado consistente:', uniqueStates[0]);
    }
  });

  test('Deve verificar se há eventos de clique sendo propagados', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Adicionar listener para eventos de clique
    await page.evaluate(() => {
      window.clickEvents = [];
      document.addEventListener('click', (e) => {
        window.clickEvents.push({
          target: e.target.tagName + (e.target.className ? '.' + e.target.className.split(' ').join('.') : ''),
          timestamp: Date.now()
        });
      });
    });
    
    // Clicar nas abas
    await page.click('[data-testid="my-tickets-tab"]');
    await page.waitForTimeout(500);
    
    await page.click('[data-testid="faq-tab"]');
    await page.waitForTimeout(500);
    
    await page.click('[data-testid="new-ticket-tab"]');
    await page.waitForTimeout(500);
    
    // Verificar eventos capturados
    const clickEvents = await page.evaluate(() => window.clickEvents);
    console.log('Eventos de clique capturados:', clickEvents);
    
    // Verificar se há cliques em elementos do sidebar
    const sidebarClicks = clickEvents.filter(event => 
      event.target.includes('sidebar') || 
      event.target.includes('nav') ||
      event.target.includes('menu')
    );
    
    if (sidebarClicks.length > 0) {
      console.log('BUG CONFIRMADO: Cliques estão afetando o sidebar:', sidebarClicks);
    } else {
      console.log('Nenhum clique detectado no sidebar');
    }
  });
});
