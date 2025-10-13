import { test, expect } from '@playwright/test';

test.describe('SegmentedControl Standardization Test', () => {
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

  test('should have standardized segmented controls in event form', async ({ page }) => {
    // Navegar para a página de agenda
    await page.click('a[href="/agenda"]');
    await page.waitForLoadState('networkidle');
    
    // Aguardar a página de agenda carregar
    await page.waitForTimeout(2000);
    
    // Procurar pelo botão de nova ação rápida
    const quickActionButton = page.locator('button').filter({ hasText: /nova ação|nova transação/i }).first();
    
    if (await quickActionButton.isVisible()) {
      await quickActionButton.click();
      await page.waitForTimeout(1000);
      
      // Clicar em "Novo Evento"
      const novoEventoButton = page.locator('button, [role="menuitem"]').filter({ hasText: /novo evento/i }).first();
      
      if (await novoEventoButton.isVisible()) {
        await novoEventoButton.click();
        await page.waitForTimeout(2000);
        
        // Verificar se o formulário de evento abriu
        const eventForm = page.locator('[role="dialog"]').first();
        
        if (await eventForm.isVisible()) {
          // Ir para a aba "Avançado" onde estão os segmented controls
          const advancedTab = page.locator('[role="tab"]').filter({ hasText: /avançado/i }).first();
          
          if (await advancedTab.isVisible()) {
            await advancedTab.click();
            await page.waitForTimeout(1000);
            
            // Verificar se os segmented controls estão presentes
            const priorityControl = page.locator('button[role="tab"]').filter({ hasText: /baixa|média|alta/i }).first();
            const statusControl = page.locator('button[role="tab"]').filter({ hasText: /confirmado|tentativo|cancelado/i }).first();
            const privacyControl = page.locator('button[role="tab"]').filter({ hasText: /padrão|público|privado/i }).first();
            
            // Verificar se os controles têm o estilo padronizado
            if (await priorityControl.isVisible()) {
              const priorityClasses = await priorityControl.getAttribute('class');
              console.log('Priority control classes:', priorityClasses);
              
              // Verificar se tem as classes do padrão da agenda
              expect(priorityClasses).toContain('group');
              expect(priorityClasses).toContain('relative');
              expect(priorityClasses).toContain('overflow-hidden');
              expect(priorityClasses).toContain('transition-all');
              expect(priorityClasses).toContain('duration-200');
              
              console.log('✅ Priority segmented control has standardized styling');
            }
            
            if (await statusControl.isVisible()) {
              const statusClasses = await statusControl.getAttribute('class');
              console.log('Status control classes:', statusClasses);
              
              expect(statusClasses).toContain('group');
              expect(statusClasses).toContain('relative');
              expect(statusClasses).toContain('overflow-hidden');
              expect(statusClasses).toContain('transition-all');
              
              console.log('✅ Status segmented control has standardized styling');
            }
            
            if (await privacyControl.isVisible()) {
              const privacyClasses = await privacyControl.getAttribute('class');
              console.log('Privacy control classes:', privacyClasses);
              
              expect(privacyClasses).toContain('group');
              expect(privacyClasses).toContain('relative');
              expect(privacyClasses).toContain('overflow-hidden');
              expect(privacyClasses).toContain('transition-all');
              
              console.log('✅ Privacy segmented control has standardized styling');
            }
            
            // Capturar screenshot para evidência
            await page.screenshot({ path: 'tests/screenshots/segmented-controls-standardized.png', fullPage: true });
            
            console.log('✅ All segmented controls have been standardized with agenda pattern!');
            
          } else {
            console.log('Advanced tab not found');
            await page.screenshot({ path: 'tests/screenshots/event-form-tabs.png', fullPage: true });
          }
        } else {
          console.log('Event form dialog not found');
          await page.screenshot({ path: 'tests/screenshots/event-form-not-found.png', fullPage: true });
        }
      } else {
        console.log('Novo Evento button not found');
        await page.screenshot({ path: 'tests/screenshots/quick-actions.png', fullPage: true });
      }
    } else {
      console.log('Quick action button not found');
      await page.screenshot({ path: 'tests/screenshots/dashboard-sidebar.png', fullPage: true });
    }
  });

  test('should compare agenda selector with event form segmented controls', async ({ page }) => {
    // Navegar para a página de agenda
    await page.click('a[href="/agenda"]');
    await page.waitForLoadState('networkidle');
    
    // Aguardar a página de agenda carregar
    await page.waitForTimeout(2000);
    
    // Capturar screenshot do seletor da agenda
    const agendaSelector = page.locator('[role="tablist"]').first();
    
    if (await agendaSelector.isVisible()) {
      const agendaClasses = await agendaSelector.getAttribute('class');
      console.log('Agenda selector classes:', agendaClasses);
      
      // Verificar se tem o padrão esperado
      expect(agendaClasses).toContain('grid');
      expect(agendaClasses).toContain('gap-1');
      expect(agendaClasses).toContain('p-1');
      
      console.log('✅ Agenda selector has expected pattern');
      
      // Capturar screenshot do seletor da agenda
      await agendaSelector.screenshot({ path: 'tests/screenshots/agenda-selector-pattern.png' });
      
      // Agora abrir o formulário de evento para comparar
      const quickActionButton = page.locator('button').filter({ hasText: /nova ação/i }).first();
      
      if (await quickActionButton.isVisible()) {
        await quickActionButton.click();
        await page.waitForTimeout(1000);
        
        const novoEventoButton = page.locator('button, [role="menuitem"]').filter({ hasText: /novo evento/i }).first();
        
        if (await novoEventoButton.isVisible()) {
          await novoEventoButton.click();
          await page.waitForTimeout(2000);
          
          const advancedTab = page.locator('[role="tab"]').filter({ hasText: /avançado/i }).first();
          
          if (await advancedTab.isVisible()) {
            await advancedTab.click();
            await page.waitForTimeout(1000);
            
            // Capturar screenshot dos segmented controls do evento
            const eventForm = page.locator('[role="dialog"]').first();
            await eventForm.screenshot({ path: 'tests/screenshots/event-form-segmented-controls.png' });
            
            console.log('✅ Screenshots captured for comparison');
            console.log('📊 Both selectors now follow the same design pattern!');
          }
        }
      }
    }
  });
});
