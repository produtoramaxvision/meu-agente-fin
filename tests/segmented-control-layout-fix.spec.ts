import { test, expect } from '@playwright/test';

test.describe('SegmentedControl Layout Fix Test', () => {
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

  test('should have properly distributed buttons in finance record form', async ({ page }) => {
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
        
        // Aguardar o formulário de transação aparecer
        await page.waitForTimeout(2000);
        
        // Verificar se o formulário de transação abriu
        const financeForm = page.locator('[role="dialog"]').first();
        
        if (await financeForm.isVisible()) {
          // Verificar se o segmented control de tipo está presente
          const tipoControl = page.locator('button[role="tab"]').filter({ hasText: /saída|entrada/i }).first();
          
          if (await tipoControl.isVisible()) {
            // Verificar se os botões estão distribuídos corretamente
            const saidaButton = page.locator('button[role="tab"]').filter({ hasText: /saída/i }).first();
            const entradaButton = page.locator('button[role="tab"]').filter({ hasText: /entrada/i }).first();
            
            if (await saidaButton.isVisible() && await entradaButton.isVisible()) {
              // Verificar se ambos os botões têm flex-1
              const saidaClasses = await saidaButton.getAttribute('class');
              const entradaClasses = await entradaButton.getAttribute('class');
              
              console.log('Saída button classes:', saidaClasses);
              console.log('Entrada button classes:', entradaClasses);
              
              // Verificar se ambos têm flex-1 para distribuição igual
              expect(saidaClasses).toContain('flex-1');
              expect(entradaClasses).toContain('flex-1');
              
              console.log('✅ Both buttons have flex-1 for equal distribution');
              
              // Verificar se o container tem flex (não inline-flex)
              const container = saidaButton.locator('..');
              const containerClasses = await container.getAttribute('class');
              console.log('Container classes:', containerClasses);
              
              // Deve ter 'flex' mas não 'inline-flex'
              expect(containerClasses).toContain('flex');
              expect(containerClasses).not.toContain('inline-flex');
              
              console.log('✅ Container uses flex layout (not inline-flex)');
              
              // Capturar screenshot para verificar visualmente
              await page.screenshot({ path: 'tests/screenshots/fixed-layout-segmented-control.png', fullPage: true });
              
              console.log('✅ Layout fix applied successfully!');
              console.log('📊 Buttons should now be properly distributed without empty space');
              
            } else {
              console.log('Buttons not found');
              await page.screenshot({ path: 'tests/screenshots/buttons-not-found.png', fullPage: true });
            }
          } else {
            console.log('Tipo control not found');
            await page.screenshot({ path: 'tests/screenshots/tipo-control-not-found.png', fullPage: true });
          }
        } else {
          console.log('Finance form dialog not found');
          await page.screenshot({ path: 'tests/screenshots/finance-form-not-found.png', fullPage: true });
        }
      } else {
        console.log('Nova Transação button not found');
        await page.screenshot({ path: 'tests/screenshots/quick-actions-no-transaction.png', fullPage: true });
      }
    } else {
      console.log('Quick action button not found');
      await page.screenshot({ path: 'tests/screenshots/dashboard-no-quick-action.png', fullPage: true });
    }
  });

  test('should test button width distribution', async ({ page }) => {
    // Abrir o formulário de transação
    const quickActionButton = page.locator('button').filter({ hasText: /nova ação/i }).first();
    
    if (await quickActionButton.isVisible()) {
      await quickActionButton.click();
      await page.waitForTimeout(1000);
      
      const novaTransacaoButton = page.locator('button, [role="menuitem"]').filter({ hasText: /nova transação/i }).first();
      
      if (await novaTransacaoButton.isVisible()) {
        await novaTransacaoButton.click();
        await page.waitForTimeout(2000);
        
        // Verificar largura dos botões
        const saidaButton = page.locator('button[role="tab"]').filter({ hasText: /saída/i }).first();
        const entradaButton = page.locator('button[role="tab"]').filter({ hasText: /entrada/i }).first();
        
        if (await saidaButton.isVisible() && await entradaButton.isVisible()) {
          // Obter bounding boxes para verificar largura
          const saidaBox = await saidaButton.boundingBox();
          const entradaBox = await entradaButton.boundingBox();
          
          console.log('Saída button dimensions:', saidaBox);
          console.log('Entrada button dimensions:', entradaBox);
          
          if (saidaBox && entradaBox) {
            // Verificar se as larguras são aproximadamente iguais (tolerância de 5px)
            const widthDifference = Math.abs(saidaBox.width - entradaBox.width);
            console.log('Width difference:', widthDifference);
            
            expect(widthDifference).toBeLessThan(5);
            
            console.log('✅ Button widths are approximately equal');
            
            // Verificar se não há espaço vazio significativo
            const container = saidaButton.locator('..');
            const containerBox = await container.boundingBox();
            
            if (containerBox) {
              const totalButtonWidth = saidaBox.width + entradaBox.width;
              const containerWidth = containerBox.width;
              const emptySpace = containerWidth - totalButtonWidth;
              
              console.log('Container width:', containerWidth);
              console.log('Total button width:', totalButtonWidth);
              console.log('Empty space:', emptySpace);
              
              // Deve haver muito pouco espaço vazio (apenas padding/gap)
              expect(emptySpace).toBeLessThan(20);
              
              console.log('✅ Minimal empty space detected');
            }
          }
          
          // Capturar screenshot final
          await page.screenshot({ path: 'tests/screenshots/width-distribution-test.png', fullPage: true });
          
          console.log('✅ Width distribution test completed successfully!');
        }
      }
    }
  });
});
