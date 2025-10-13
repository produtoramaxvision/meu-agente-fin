import { test, expect } from '@playwright/test';

test.describe('Popover Sidebar Bug Test', () => {
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

  test('should reproduce sidebar popover bug when clicking outside popover', async ({ page }) => {
    // Aguardar o dashboard carregar completamente
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 }).catch(() => {
      console.log('Dashboard selector not found, continuing with test...');
    });

    // Procurar pelo botão de ação rápida no sidebar
    const quickActionButton = page.locator('button').filter({ hasText: /ação rápida|quick action|nova transação/i }).first();
    
    // Se não encontrar pelo texto, procurar por ícones ou outros seletores
    if (!(await quickActionButton.isVisible())) {
      // Procurar por botão com ícone de plus ou similar
      const plusButton = page.locator('button[aria-label*="plus"], button[aria-label*="add"], button svg[data-lucide="plus"]').first();
      if (await plusButton.isVisible()) {
        await plusButton.click();
      } else {
        // Procurar por qualquer botão no sidebar que possa ser o de ação rápida
        const sidebarButtons = page.locator('aside button, nav button').first();
        await sidebarButtons.click();
      }
    } else {
      await quickActionButton.click();
    }

    // Aguardar o popover aparecer
    await page.waitForTimeout(1000);

    // Procurar pelo botão "Nova Transação" no popover
    const novaTransacaoButton = page.locator('button, [role="menuitem"]').filter({ hasText: /nova transação|nova entrada|nova saída/i }).first();
    
    if (await novaTransacaoButton.isVisible()) {
      await novaTransacaoButton.click();
      
      // Aguardar o segundo popover aparecer
      await page.waitForTimeout(1000);
      
      // Tentar clicar no campo descrição
      const descricaoField = page.locator('input[name="descricao"], textarea[name="descricao"], input[placeholder*="descrição"], textarea[placeholder*="descrição"]').first();
      
      if (await descricaoField.isVisible()) {
        console.log('Found description field, clicking on it...');
        await descricaoField.click();
        
        // Aguardar um pouco para ver se o sidebar fica abrindo/fechando
        await page.waitForTimeout(2000);
        
        // Verificar se o sidebar está se comportando de forma estranha
        const sidebar = page.locator('aside, nav').first();
        const sidebarClasses = await sidebar.getAttribute('class');
        console.log('Sidebar classes after clicking description:', sidebarClasses);
        
        // Tentar clicar fora do popover (no fundo)
        await page.click('body', { position: { x: 100, y: 100 } });
        await page.waitForTimeout(1000);
        
        // Verificar novamente o estado do sidebar
        const sidebarClassesAfter = await sidebar.getAttribute('class');
        console.log('Sidebar classes after clicking background:', sidebarClassesAfter);
        
        // Capturar screenshot para evidência
        await page.screenshot({ path: 'tests/screenshots/popover-bug-evidence.png', fullPage: true });
        
      } else {
        console.log('Description field not found');
        // Capturar screenshot do estado atual
        await page.screenshot({ path: 'tests/screenshots/popover-state.png', fullPage: true });
      }
    } else {
      console.log('Nova Transação button not found');
      // Capturar screenshot do estado atual
      await page.screenshot({ path: 'tests/screenshots/quick-action-popover.png', fullPage: true });
    }
  });

  test('should test sidebar behavior with multiple clicks', async ({ page }) => {
    // Aguardar o dashboard carregar
    await page.waitForLoadState('networkidle');
    
    // Procurar pelo botão de ação rápida
    const quickActionButton = page.locator('button').filter({ hasText: /ação rápida|quick action/i }).first();
    
    if (await quickActionButton.isVisible()) {
      // Fazer múltiplos cliques para testar o comportamento
      for (let i = 0; i < 5; i++) {
        await quickActionButton.click();
        await page.waitForTimeout(500);
        
        // Verificar se o popover está visível
        const popover = page.locator('[role="dialog"], [data-radix-popper-content-wrapper], .popover').first();
        const isVisible = await popover.isVisible();
        console.log(`Click ${i + 1}: Popover visible = ${isVisible}`);
        
        // Capturar screenshot a cada clique
        await page.screenshot({ path: `tests/screenshots/click-${i + 1}.png` });
      }
    }
  });

  test('should test clicking outside popover multiple times', async ({ page }) => {
    // Aguardar o dashboard carregar
    await page.waitForLoadState('networkidle');
    
    // Abrir o popover de ação rápida
    const quickActionButton = page.locator('button').filter({ hasText: /ação rápida|quick action/i }).first();
    
    if (await quickActionButton.isVisible()) {
      await quickActionButton.click();
      await page.waitForTimeout(1000);
      
      // Fazer múltiplos cliques fora do popover
      for (let i = 0; i < 10; i++) {
        // Clicar em diferentes posições fora do popover
        const positions = [
          { x: 50, y: 50 },
          { x: 200, y: 100 },
          { x: 100, y: 200 },
          { x: 300, y: 150 },
          { x: 150, y: 300 }
        ];
        
        const pos = positions[i % positions.length];
        await page.click('body', { position: pos });
        await page.waitForTimeout(300);
        
        // Verificar o estado do sidebar
        const sidebar = page.locator('aside, nav').first();
        const sidebarClasses = await sidebar.getAttribute('class');
        console.log(`Click ${i + 1} at (${pos.x}, ${pos.y}): Sidebar classes = ${sidebarClasses}`);
        
        // Capturar screenshot a cada 3 cliques
        if ((i + 1) % 3 === 0) {
          await page.screenshot({ path: `tests/screenshots/outside-click-${i + 1}.png` });
        }
      }
    }
  });
});
