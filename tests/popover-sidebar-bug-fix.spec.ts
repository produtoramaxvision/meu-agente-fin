import { test, expect } from '@playwright/test';

test.describe('Popover Sidebar Bug Fix Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a aplicação
    await page.goto('http://localhost:8080');
    
    // Aguardar a página carregar
    await page.waitForLoadState('networkidle');
    
    // Aguardar os campos de login aparecerem
    await page.waitForSelector('#phone', { timeout: 10000 });
    await page.waitForSelector('#password', { timeout: 10000 });
    
    // Fazer login
    await page.fill('#phone', '55 (11) 9 4974-6110');
    await page.fill('#password', '12345678');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  });

  test('should NOT toggle sidebar when clicking outside popover', async ({ page }) => {
    // Aguardar o dashboard carregar completamente
    await page.waitForLoadState('networkidle');

    // Procurar pelo botão de ação rápida no sidebar
    const quickActionButton = page.locator('button').filter({ hasText: /nova ação|nova transação/i }).first();
    
    if (await quickActionButton.isVisible()) {
      await quickActionButton.click();
      
      // Aguardar o popover aparecer
      await page.waitForTimeout(1000);
      
      // Procurar pelo botão "Nova Transação" no popover
      const novaTransacaoButton = page.locator('button, [role="menuitem"]').filter({ hasText: /nova transação|nova entrada|nova saída/i }).first();
      
      if (await novaTransacaoButton.isVisible()) {
        await novaTransacaoButton.click();
        
        // Aguardar o segundo popover aparecer
        await page.waitForTimeout(1000);
        
        // Verificar o estado inicial do sidebar
        const sidebar = page.locator('aside').first();
        const initialClasses = await sidebar.getAttribute('class');
        console.log('Initial sidebar classes:', initialClasses);
        
        // Clicar fora do popover (no fundo)
        await page.click('body', { position: { x: 100, y: 100 } });
        await page.waitForTimeout(1000);
        
        // Verificar se o sidebar NÃO mudou de estado
        const finalClasses = await sidebar.getAttribute('class');
        console.log('Final sidebar classes:', finalClasses);
        
        // O sidebar não deve ter mudado de estado
        expect(finalClasses).toBe(initialClasses);
        
        // Capturar screenshot para evidência
        await page.screenshot({ path: 'tests/screenshots/bug-fix-evidence.png', fullPage: true });
        
        console.log('✅ Bug fix working! Sidebar did not toggle when clicking outside popover.');
        
      } else {
        console.log('Nova Transação button not found');
        await page.screenshot({ path: 'tests/screenshots/quick-action-popover.png', fullPage: true });
      }
    } else {
      console.log('Quick action button not found');
      await page.screenshot({ path: 'tests/screenshots/dashboard-state.png', fullPage: true });
    }
  });

  test('should still toggle sidebar when clicking on sidebar background', async ({ page }) => {
    // Aguardar o dashboard carregar
    await page.waitForLoadState('networkidle');
    
    // Verificar o estado inicial do sidebar
    const sidebar = page.locator('aside').first();
    const initialClasses = await sidebar.getAttribute('class');
    console.log('Initial sidebar classes:', initialClasses);
    
    // Clicar diretamente no sidebar (não em elementos interativos)
    await sidebar.click({ position: { x: 10, y: 200 } });
    await page.waitForTimeout(1000);
    
    // Verificar se o sidebar mudou de estado
    const finalClasses = await sidebar.getAttribute('class');
    console.log('Final sidebar classes:', finalClasses);
    
    // O sidebar deve ter mudado de estado
    expect(finalClasses).not.toBe(initialClasses);
    
    console.log('✅ Sidebar toggle functionality still works when clicking on sidebar background.');
  });

  test('should not toggle sidebar when clicking on form fields', async ({ page }) => {
    // Aguardar o dashboard carregar
    await page.waitForLoadState('networkidle');

    // Abrir o popover de ação rápida
    const quickActionButton = page.locator('button').filter({ hasText: /nova ação|nova transação/i }).first();
    
    if (await quickActionButton.isVisible()) {
      await quickActionButton.click();
      await page.waitForTimeout(1000);
      
      // Clicar em "Nova Transação"
      const novaTransacaoButton = page.locator('button, [role="menuitem"]').filter({ hasText: /nova transação|nova entrada|nova saída/i }).first();
      
      if (await novaTransacaoButton.isVisible()) {
        await novaTransacaoButton.click();
        await page.waitForTimeout(1000);
        
        // Verificar o estado inicial do sidebar
        const sidebar = page.locator('aside').first();
        const initialClasses = await sidebar.getAttribute('class');
        
        // Tentar clicar no campo descrição
        const descricaoField = page.locator('input[name="descricao"], textarea[name="descricao"], input[placeholder*="descrição"], textarea[placeholder*="descrição"]').first();
        
        if (await descricaoField.isVisible()) {
          await descricaoField.click();
          await page.waitForTimeout(1000);
          
          // Verificar se o sidebar não mudou de estado
          const finalClasses = await sidebar.getAttribute('class');
          expect(finalClasses).toBe(initialClasses);
          
          console.log('✅ Sidebar did not toggle when clicking on form field.');
        }
      }
    }
  });
});
