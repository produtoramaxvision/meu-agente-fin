import { test, expect } from '@playwright/test';

test.describe('Correções do Sistema de Suporte', () => {
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

  test('Deve verificar se o FAQ tem layout de abas elegante', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Clicar na aba "FAQ"
    const faqTab = page.locator('[data-testid="faq-tab"]');
    await expect(faqTab).toBeVisible();
    await faqTab.click();
    await page.waitForTimeout(1000);
    
    // Verificar se há sistema de abas no FAQ
    const faqTabsList = page.locator('[role="tablist"]').nth(1); // Segundo tablist (FAQ interno)
    await expect(faqTabsList).toBeVisible();
    
    // Verificar se há abas de categoria
    const categoryTabs = page.locator('[role="tablist"]').nth(1).locator('[role="tab"]');
    await expect(categoryTabs).toHaveCount(6); // Todas + 5 categorias
    
    // Verificar se a aba "Todas" está ativa por padrão
    const allTab = page.locator('[role="tablist"]').nth(1).locator('[role="tab"]').first();
    await expect(allTab).toHaveAttribute('data-state', 'active');
    
    // Verificar se há conteúdo nas abas
    const faqContent = page.locator('[role="tabpanel"]').nth(2); // Terceiro tabpanel (FAQ)
    await expect(faqContent).toBeVisible();
  });

  test('Deve verificar se o bug do sidebar foi corrigido', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog está aberto
    const supportDialog = page.locator('[role="dialog"]').first();
    await expect(supportDialog).toBeVisible();
    
    // Verificar estado inicial do sidebar (se existir)
    const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar').first();
    const initialSidebarState = await sidebar.getAttribute('data-state') || 'closed';
    console.log('Estado inicial do sidebar:', initialSidebarState);
    
    // Clicar nas abas e verificar se o sidebar não muda
    const myTicketsTab = page.locator('[data-testid="my-tickets-tab"]');
    await myTicketsTab.click();
    await page.waitForTimeout(500);
    
    const afterClickSidebarState = await sidebar.getAttribute('data-state') || 'closed';
    console.log('Estado do sidebar após clicar em Meus Tickets:', afterClickSidebarState);
    
    const faqTab = page.locator('[data-testid="faq-tab"]');
    await faqTab.click();
    await page.waitForTimeout(500);
    
    const afterFAQClickSidebarState = await sidebar.getAttribute('data-state') || 'closed';
    console.log('Estado do sidebar após clicar em FAQ:', afterFAQClickSidebarState);
    
    const newTicketTab = page.locator('[data-testid="new-ticket-tab"]');
    await newTicketTab.click();
    await page.waitForTimeout(500);
    
    const afterNewTicketClickSidebarState = await sidebar.getAttribute('data-state') || 'closed';
    console.log('Estado do sidebar após clicar em Novo Ticket:', afterNewTicketClickSidebarState);
    
    // Verificar se o sidebar mantém estado consistente
    const sidebarStates = [initialSidebarState, afterClickSidebarState, afterFAQClickSidebarState, afterNewTicketClickSidebarState];
    const uniqueStates = [...new Set(sidebarStates)];
    
    if (uniqueStates.length === 1) {
      console.log('✅ BUG CORRIGIDO: Sidebar mantém estado consistente:', uniqueStates[0]);
    } else {
      console.log('❌ BUG AINDA EXISTE: Sidebar está mudando de estado:', uniqueStates);
    }
    
    // O sidebar deve manter o mesmo estado
    expect(uniqueStates.length).toBe(1);
  });

  test('Deve verificar se as abas do FAQ funcionam corretamente', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Clicar na aba "FAQ"
    const faqTab = page.locator('[data-testid="faq-tab"]');
    await faqTab.click();
    await page.waitForTimeout(1000);
    
    // Clicar na aba "Conta" do FAQ
    const contaTab = page.locator('[role="tablist"]').nth(1).locator('[role="tab"]').nth(1);
    await expect(contaTab).toBeVisible();
    await contaTab.click();
    await page.waitForTimeout(500);
    
    // Verificar se a aba "Conta" está ativa
    await expect(contaTab).toHaveAttribute('data-state', 'active');
    
    // Clicar na aba "Planos" do FAQ
    const planosTab = page.locator('[role="tablist"]').nth(1).locator('[role="tab"]').nth(2);
    await expect(planosTab).toBeVisible();
    await planosTab.click();
    await page.waitForTimeout(500);
    
    // Verificar se a aba "Planos" está ativa
    await expect(planosTab).toHaveAttribute('data-state', 'active');
    
    // Voltar para "Todas"
    const todasTab = page.locator('[role="tablist"]').nth(1).locator('[role="tab"]').first();
    await todasTab.click();
    await page.waitForTimeout(500);
    
    // Verificar se a aba "Todas" está ativa
    await expect(todasTab).toHaveAttribute('data-state', 'active');
  });

  test('Deve verificar se a busca no FAQ funciona', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Clicar na aba "FAQ"
    const faqTab = page.locator('[data-testid="faq-tab"]');
    await faqTab.click();
    await page.waitForTimeout(1000);
    
    // Buscar por "conta"
    const searchInput = page.locator('input[placeholder*="Buscar perguntas"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('conta');
    await page.waitForTimeout(500);
    
    // Verificar se há resultados
    const faqItems = page.locator('[role="tabpanel"]').nth(2).locator('.card, [class*="card"]');
    const itemCount = await faqItems.count();
    console.log('Número de itens encontrados na busca:', itemCount);
    
    // Deve haver pelo menos 1 item
    expect(itemCount).toBeGreaterThan(0);
    
    // Limpar busca
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    // Verificar se todos os itens voltaram
    const allItems = await faqItems.count();
    console.log('Número de itens após limpar busca:', allItems);
    expect(allItems).toBeGreaterThan(itemCount);
  });
});
