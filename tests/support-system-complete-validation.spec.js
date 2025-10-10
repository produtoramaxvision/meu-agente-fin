import { test, expect } from '@playwright/test';

test.describe('Sistema de Suporte - Validação Completa', () => {
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

  test('Deve abrir o sistema de suporte corretamente', async ({ page }) => {
    // Clicar no botão de Ajuda
    const helpButton = page.locator('button:has-text("Ajuda"), button:has-text("Help")').first();
    await expect(helpButton).toBeVisible();
    await helpButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar se o popover de ajuda abriu
    const helpPopover = page.locator('[role="dialog"], .popover, [data-radix-popper-content-wrapper]').first();
    await expect(helpPopover).toBeVisible();
    
    // Clicar no botão de Suporte
    const supportButton = page.locator('button:has-text("Suporte"), a:has-text("Suporte")').first();
    await expect(supportButton).toBeVisible();
    await supportButton.click();
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog de suporte abriu
    const supportDialog = page.locator('[role="dialog"]').first();
    await expect(supportDialog).toBeVisible();
    
    // Verificar se o título está correto
    const dialogTitle = page.locator('h2:has-text("Suporte"), [role="dialog"] h2').first();
    await expect(dialogTitle).toBeVisible();
  });

  test('Deve exibir informações de SLA corretamente', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se as informações de SLA estão visíveis
    const slaInfo = page.locator('text=/SLA|Tempo de resposta|horas|dias/');
    await expect(slaInfo.first()).toBeVisible();
    
    // Verificar se há badge com informações do plano
    const planBadge = page.locator('[data-testid*="badge"], .badge').first();
    await expect(planBadge).toBeVisible();
  });

  test('Deve ter 3 abas funcionais', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se há abas
    const tabsList = page.locator('[role="tablist"], .tabs-list').first();
    await expect(tabsList).toBeVisible();
    
    // Verificar se há 3 triggers de aba
    const tabTriggers = page.locator('[role="tab"], .tab-trigger');
    await expect(tabTriggers).toHaveCount(3);
    
    // Verificar se as abas têm os textos corretos
    const newTicketTab = page.locator('[role="tab"]:has-text("Novo Ticket")');
    const myTicketsTab = page.locator('[role="tab"]:has-text("Meus Tickets")');
    const faqTab = page.locator('[role="tab"]:has-text("FAQ")');
    
    await expect(newTicketTab).toBeVisible();
    await expect(myTicketsTab).toBeVisible();
    await expect(faqTab).toBeVisible();
  });

  test('Deve permitir preenchimento do formulário de novo ticket', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Clicar na aba "Novo Ticket" (deve estar ativa por padrão)
    const newTicketTab = page.locator('[role="tab"]:has-text("Novo Ticket")');
    await expect(newTicketTab).toBeVisible();
    
    // Verificar se o formulário está visível
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
    
    // Verificar campos obrigatórios
    const titleInput = page.locator('input[placeholder*="título"], input[placeholder*="assunto"], input[name*="title"], input[name*="subject"]');
    const descriptionInput = page.locator('textarea[placeholder*="descrição"], textarea[placeholder*="mensagem"], textarea[name*="description"]');
    const categorySelect = page.locator('select, [role="combobox"]').first();
    const prioritySelect = page.locator('select, [role="combobox"]').nth(1);
    
    await expect(titleInput).toBeVisible();
    await expect(descriptionInput).toBeVisible();
    await expect(categorySelect).toBeVisible();
    await expect(prioritySelect).toBeVisible();
    
    // Preencher formulário
    await titleInput.fill('Teste Automatizado - Validação Completa');
    await descriptionInput.fill('Este é um teste automatizado para validar o funcionamento completo do sistema de suporte.');
    
    // Verificar se o botão de envio está presente
    const submitButton = page.locator('button[type="submit"], button:has-text("Enviar"), button:has-text("Submit")');
    await expect(submitButton).toBeVisible();
    
    // Verificar se o botão está habilitado
    await expect(submitButton).toBeEnabled();
  });

  test('Deve exibir aba de tickets existentes', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Clicar na aba "Meus Tickets"
    const myTicketsTab = page.locator('[role="tab"]:has-text("Meus Tickets")');
    await expect(myTicketsTab).toBeVisible();
    await myTicketsTab.click();
    await page.waitForTimeout(1000);
    
    // Verificar se a aba está ativa
    await expect(myTicketsTab).toHaveAttribute('data-state', 'active');
    
    // Verificar se há conteúdo na aba
    const ticketsContent = page.locator('[role="tabpanel"], .tabs-content').first();
    await expect(ticketsContent).toBeVisible();
    
    // Verificar se há mensagem de "nenhum ticket" ou lista de tickets
    const noTicketsMessage = page.locator('text=/nenhum ticket|nenhum|vazio/i');
    const ticketsList = page.locator('[data-testid*="ticket"], .ticket-item, .ticket-card');
    
    // Pelo menos um dos dois deve estar visível
    const hasNoTicketsMessage = await noTicketsMessage.isVisible();
    const hasTicketsList = await ticketsList.isVisible();
    
    expect(hasNoTicketsMessage || hasTicketsList).toBeTruthy();
  });

  test('Deve exibir FAQ dinâmico', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Clicar na aba "FAQ"
    const faqTab = page.locator('[role="tab"]:has-text("FAQ")');
    await expect(faqTab).toBeVisible();
    await faqTab.click();
    await page.waitForTimeout(1000);
    
    // Verificar se a aba está ativa
    await expect(faqTab).toHaveAttribute('data-state', 'active');
    
    // Verificar se há conteúdo do FAQ
    const faqContent = page.locator('[role="tabpanel"], .tabs-content').first();
    await expect(faqContent).toBeVisible();
    
    // Verificar se há perguntas no FAQ
    const faqQuestions = page.locator('[data-testid*="faq"], .faq-question, .faq-item');
    await expect(faqQuestions.first()).toBeVisible();
    
    // Verificar se há campo de busca no FAQ
    const searchInput = page.locator('input[placeholder*="buscar"], input[placeholder*="search"], input[type="search"]');
    await expect(searchInput).toBeVisible();
  });

  test('Deve ter validação de formulário funcionando', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Tentar enviar formulário vazio
    const submitButton = page.locator('button[type="submit"], button:has-text("Enviar")');
    await submitButton.click();
    
    // Verificar se aparecem mensagens de erro
    const errorMessages = page.locator('[role="alert"], .error-message, .form-error');
    await expect(errorMessages.first()).toBeVisible();
  });

  test('Deve ter acessibilidade adequada', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog tem role="dialog"
    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible();
    
    // Verificar se há aria-label ou aria-labelledby
    const dialogWithAria = page.locator('[role="dialog"][aria-label], [role="dialog"][aria-labelledby]');
    await expect(dialogWithAria).toBeVisible();
    
    // Verificar se os campos de formulário têm labels associados
    const titleInput = page.locator('input[placeholder*="título"], input[placeholder*="assunto"]');
    const titleLabel = page.locator('label[for], label:has-text("Título"), label:has-text("Assunto")');
    await expect(titleLabel.first()).toBeVisible();
    
    // Verificar se há navegação por teclado
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar se o foco está visível
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('Deve ser responsivo em diferentes tamanhos de tela', async ({ page }) => {
    // Testar em mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog se adapta ao mobile
    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible();
    
    // Verificar se as abas são visíveis em mobile
    const tabsList = page.locator('[role="tablist"]').first();
    await expect(tabsList).toBeVisible();
    
    // Testar em tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await expect(dialog).toBeVisible();
    
    // Testar em desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    await expect(dialog).toBeVisible();
  });

  test('Deve fechar corretamente o dialog', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se o dialog está aberto
    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible();
    
    // Clicar no botão de fechar (X)
    const closeButton = page.locator('button[aria-label*="close"], button[aria-label*="fechar"], button:has-text("×"), button:has-text("✕")');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await page.waitForTimeout(1000);
      await expect(dialog).not.toBeVisible();
    }
    
    // Ou pressionar Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    await expect(dialog).not.toBeVisible();
  });
});
