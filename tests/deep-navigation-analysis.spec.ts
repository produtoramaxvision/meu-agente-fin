import { test, expect } from '@playwright/test';

test.describe('Deep Navigation Analysis', () => {
  test('should capture exact timing of duplicate navigation', async ({ page }) => {
    // Array para capturar todas as navegações com contexto detalhado
    const detailedNavigationLog: Array<{
      timestamp: number, 
      url: string, 
      reason: string,
      stackTrace?: string
    }> = [];
    
    // Monitorar todas as navegações com stack trace
    page.on('framenavigated', frame => {
      if (frame.url().includes('localhost:8080')) {
        detailedNavigationLog.push({
          timestamp: Date.now(),
          url: frame.url(),
          reason: 'framenavigated'
        });
        console.log(`🔄 Navigation: ${frame.url()}`);
      }
    });

    // Monitorar mudanças de URL via JavaScript com stack trace
    await page.addInitScript(() => {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      const logNavigation = (method: string, url: string) => {
        console.log(`📍 ${method} called:`, url);
        console.log('Stack trace:', new Error().stack);
      };
      
      history.pushState = function(...args) {
        logNavigation('pushState', args[2] || 'undefined');
        originalPushState.apply(this, args);
      };
      
      history.replaceState = function(...args) {
        logNavigation('replaceState', args[2] || 'undefined');
        originalReplaceState.apply(this, args);
      };
    });

    // Monitorar console logs do React Router e AuthContext
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Navigate') || 
          text.includes('redirect') || 
          text.includes('Auth state changed') ||
          text.includes('pushState') ||
          text.includes('replaceState')) {
        console.log('📝 Console:', text);
      }
    });

    // Monitorar requisições de rede para identificar quando acontece a segunda navegação
    const networkTimeline: Array<{timestamp: number, request: string}> = [];
    page.on('request', request => {
      if (request.url().includes('localhost:8080')) {
        networkTimeline.push({
          timestamp: Date.now(),
          request: `${request.method()} ${request.url()}`
        });
      }
    });

    console.log('🚀 Starting detailed navigation analysis...');
    
    // Navegar para login
    await page.goto('http://localhost:8080/auth/login');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Initial page loaded');
    console.log('Navigation log so far:', detailedNavigationLog);
    
    // Aguardar um pouco para capturar qualquer navegação inicial
    await page.waitForTimeout(2000);
    
    console.log('Navigation log after 2s wait:', detailedNavigationLog);
    
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
    await page.waitForTimeout(3000);
    
    // Analisar o log detalhado
    console.log('\n📊 DETAILED NAVIGATION ANALYSIS:');
    console.log('Total navigations:', detailedNavigationLog.length);
    
    detailedNavigationLog.forEach((nav, index) => {
      const timeDiff = index > 0 ? nav.timestamp - detailedNavigationLog[index-1].timestamp : 0;
      console.log(`${index + 1}. ${nav.url} (${timeDiff}ms after previous) - ${nav.reason}`);
    });
    
    // Analisar timeline de rede
    console.log('\n🌐 NETWORK TIMELINE:');
    networkTimeline.forEach((req, index) => {
      const timeDiff = index > 0 ? req.timestamp - networkTimeline[index-1].timestamp : 0;
      console.log(`${index + 1}. ${req.request} (${timeDiff}ms after previous)`);
    });
    
    // Verificar se há navegações muito próximas
    const duplicatePatterns = [];
    for (let i = 1; i < detailedNavigationLog.length; i++) {
      const prev = detailedNavigationLog[i-1];
      const curr = detailedNavigationLog[i];
      const timeDiff = curr.timestamp - prev.timestamp;
      
      if (timeDiff < 500 && prev.url === curr.url) {
        duplicatePatterns.push({
          url: curr.url,
          timeDiff: timeDiff,
          index: i,
          prevReason: prev.reason,
          currReason: curr.reason
        });
      }
    }
    
    if (duplicatePatterns.length > 0) {
      console.log('\n⚠️ DUPLICATE NAVIGATIONS DETECTED:');
      duplicatePatterns.forEach(dup => {
        console.log(`- ${dup.url} (${dup.timeDiff}ms apart at index ${dup.index})`);
        console.log(`  Previous: ${dup.prevReason}, Current: ${dup.currReason}`);
      });
    }
    
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
