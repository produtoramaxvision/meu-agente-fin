import { test, expect } from '@playwright/test';

test.describe('Sistema de Suporte - Validação Corrigida', () => {
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
    
    // Verificar se há badge com informações do plano usando data-testid
    const planBadge = page.locator('[data-testid="plan-badge"]');
    await expect(planBadge).toBeVisible();
  });

  test('Deve ter 3 abas funcionais', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se há abas usando data-testid
    const tabsList = page.locator('[data-testid="support-tabs-list"]');
    await expect(tabsList).toBeVisible();
    
    // Verificar se há 3 triggers de aba específicos
    const newTicketTab = page.locator('[data-testid="new-ticket-tab"]');
    const myTicketsTab = page.locator('[data-testid="my-tickets-tab"]');
    const faqTab = page.locator('[data-testid="faq-tab"]');
    
    await expect(newTicketTab).toBeVisible();
    await expect(myTicketsTab).toBeVisible();
    await expect(faqTab).toBeVisible();
    
    // Verificar se as abas têm os textos corretos
    await expect(newTicketTab).toContainText('Novo Ticket');
    await expect(myTicketsTab).toContainText('Meus Tickets');
    await expect(faqTab).toContainText('FAQ');
  });

  test('Deve permitir preenchimento do formulário de novo ticket', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Verificar se o formulário está visível
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
    
    // Verificar campos obrigatórios usando data-testid
    const titleInput = page.locator('[data-testid="ticket-subject-input"]');
    const descriptionInput = page.locator('[data-testid="ticket-description-textarea"]');
    
    await expect(titleInput).toBeVisible();
    await expect(descriptionInput).toBeVisible();
    
    // Preencher formulário
    await titleInput.fill('Teste Automatizado - Validação Completa');
    await descriptionInput.fill('Este é um teste automatizado para validar o funcionamento completo do sistema de suporte.');
    
    // Verificar se o botão de envio está presente usando data-testid
    const submitButton = page.locator('[data-testid="submit-ticket-button"]');
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
    const myTicketsTab = page.locator('[data-testid="my-tickets-tab"]');
    await expect(myTicketsTab).toBeVisible();
    await myTicketsTab.click();
    await page.waitForTimeout(1000);
    
    // Verificar se a aba está ativa
    await expect(myTicketsTab).toHaveAttribute('data-state', 'active');
    
    // Verificar se há conteúdo na aba (usando seletor mais específico)
    const ticketsContent = page.locator('[data-testid="my-tickets-tab"][data-state="active"] + * [role="tabpanel"]');
    await expect(ticketsContent).toBeVisible();
  });

  test('Deve exibir FAQ dinâmico', async ({ page }) => {
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
    
    // Verificar se a aba está ativa
    await expect(faqTab).toHaveAttribute('data-state', 'active');
    
    // Verificar se há conteúdo do FAQ
    const faqContent = page.locator('[data-testid="faq-tab"][data-state="active"] + * [role="tabpanel"]');
    await expect(faqContent).toBeVisible();
  });

  test('Deve ter validação de formulário funcionando', async ({ page }) => {
    // Abrir sistema de suporte
    await page.click('button:has-text("Ajuda")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Suporte"), a:has-text("Suporte")');
    await page.waitForTimeout(2000);
    
    // Tentar enviar formulário vazio
    const submitButton = page.locator('[data-testid="submit-ticket-button"]');
    await submitButton.click();
    
    // Verificar se aparecem mensagens de erro usando data-testid
    const errorMessages = page.locator('[data-testid="error-message"]');
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
    const titleInput = page.locator('[data-testid="ticket-subject-input"]');
    const titleLabel = page.locator('label[for], label:has-text("Assunto")');
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
    const tabsList = page.locator('[data-testid="support-tabs-list"]');
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
