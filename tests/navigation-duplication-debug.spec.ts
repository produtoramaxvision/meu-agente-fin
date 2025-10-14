import { test, expect } from '@playwright/test';

test.describe('Navigation Duplication Debug', () => {
  test('should trace exact navigation sequence', async ({ page }) => {
    // Array para capturar todas as navegações com timestamp
    const navigationLog: Array<{timestamp: number, url: string, reason?: string}> = [];
    
    // Monitorar todas as navegações
    page.on('framenavigated', frame => {
      if (frame.url().includes('localhost:8080')) {
        navigationLog.push({
          timestamp: Date.now(),
          url: frame.url(),
          reason: 'framenavigated'
        });
        console.log(`🔄 Navigation: ${frame.url()}`);
      }
    });

    // Monitorar mudanças de URL via JavaScript
    await page.addInitScript(() => {
      let lastUrl = window.location.href;
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        console.log('📍 pushState called:', args[2]);
        originalPushState.apply(this, args);
        if (args[2] && args[2] !== lastUrl) {
          console.log('🔄 URL changed via pushState:', args[2]);
        }
      };
      
      history.replaceState = function(...args) {
        console.log('📍 replaceState called:', args[2]);
        originalReplaceState.apply(this, args);
        if (args[2] && args[2] !== lastUrl) {
          console.log('🔄 URL changed via replaceState:', args[2]);
        }
      };
    });

    // Monitorar console logs do React Router
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Navigate') || text.includes('redirect') || text.includes('Auth state changed')) {
        console.log('📝 Console:', text);
      }
    });

    // Monitorar requisições de rede
    const networkRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('supabase') || request.url().includes('auth')) {
        networkRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    console.log('🚀 Starting navigation trace...');
    
    // Navegar para login
    await page.goto('http://localhost:8080/auth/login');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Initial page loaded');
    console.log('Navigation log so far:', navigationLog);
    
    // Aguardar um pouco para capturar qualquer navegação inicial
    await page.waitForTimeout(1000);
    
    // Preencher formulário
    await page.fill('input[type="tel"]', '55 (11) 9 4974-6110');
    await page.fill('input[type="password"]', '12345678');
    
    console.log('✅ Form filled');
    
    // Clicar no botão de login
    console.log('🔄 Clicking login button...');
    await page.click('button[type="submit"]');
    
    // Aguardar mudança de estado do botão
    await page.waitForSelector('button[type="submit"]:has-text("Entrando...")');
    console.log('✅ Button state changed to "Entrando..."');
    
    // Aguardar redirecionamento para dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    console.log('✅ Redirected to dashboard');
    
    // Aguardar mais tempo para capturar todas as navegações
    await page.waitForTimeout(5000);
    
    // Analisar o log de navegações
    console.log('\n📊 NAVIGATION ANALYSIS:');
    console.log('Total navigations:', navigationLog.length);
    
    navigationLog.forEach((nav, index) => {
      const timeDiff = index > 0 ? nav.timestamp - navigationLog[index-1].timestamp : 0;
      console.log(`${index + 1}. ${nav.url} (${timeDiff}ms after previous)`);
    });
    
    // Verificar padrões
    const loginNavigations = navigationLog.filter(nav => nav.url.includes('/auth/login'));
    const dashboardNavigations = navigationLog.filter(nav => nav.url.includes('/dashboard'));
    
    console.log('\n🔍 PATTERN ANALYSIS:');
    console.log('Login navigations:', loginNavigations.length);
    console.log('Dashboard navigations:', dashboardNavigations.length);
    
    // Verificar se há navegações muito próximas (possível duplicação)
    const duplicatePatterns = [];
    for (let i = 1; i < navigationLog.length; i++) {
      const prev = navigationLog[i-1];
      const curr = navigationLog[i];
      const timeDiff = curr.timestamp - prev.timestamp;
      
      if (timeDiff < 100 && prev.url === curr.url) {
        duplicatePatterns.push({
          url: curr.url,
          timeDiff: timeDiff,
          index: i
        });
      }
    }
    
    if (duplicatePatterns.length > 0) {
      console.log('\n⚠️ DUPLICATE NAVIGATIONS DETECTED:');
      duplicatePatterns.forEach(dup => {
        console.log(`- ${dup.url} (${dup.timeDiff}ms apart at index ${dup.index})`);
      });
    }
    
    // Verificar se há navegações de volta para login após dashboard
    const backToLoginAfterDashboard = [];
    for (let i = 0; i < navigationLog.length - 1; i++) {
      const curr = navigationLog[i];
      const next = navigationLog[i + 1];
      
      if (curr.url.includes('/dashboard') && next.url.includes('/auth/login')) {
        backToLoginAfterDashboard.push({
          from: curr.url,
          to: next.url,
          timeDiff: next.timestamp - curr.timestamp
        });
      }
    }
    
    if (backToLoginAfterDashboard.length > 0) {
      console.log('\n🔄 BACK TO LOGIN AFTER DASHBOARD:');
      backToLoginAfterDashboard.forEach(back => {
        console.log(`- From ${back.from} to ${back.to} (${back.timeDiff}ms)`);
      });
    }
    
    // Log das requisições de rede
    console.log('\n🌐 NETWORK REQUESTS:');
    networkRequests.forEach(req => console.log(`- ${req}`));
    
    // Verificar se estamos no dashboard final
    const finalURL = page.url();
    console.log('\n🎯 FINAL RESULT:');
    console.log('Final URL:', finalURL);
    
    expect(finalURL).toContain('/dashboard');
    
    // Verificar se os elementos do dashboard estão visíveis
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    console.log('✅ Test completed successfully');
  });
});
