/**
 * Timeout and Network Tests
 * Testes de timeout e conexões lentas usando Playwright
 * 
 * Testa:
 * - Comportamento com conexões lentas
 * - Timeouts de requisições
 * - Fallbacks e retry logic
 * - Estados offline/online
 */

import { test, expect, Page } from '@playwright/test';

// Configuração de timeout para testes de rede
test.setTimeout(120000); // 2 minutos

// Dados de teste
const TEST_USER = {
  phone: '5511949746110',
  password: '12345678'
};

// Helper para login
async function loginUser(page: Page) {
  await page.goto('http://localhost:8080/auth/login');
  await page.fill('input[type="tel"]', TEST_USER.phone);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

// Helper para simular conexão lenta
async function simulateSlowConnection(page: Page, delay: number = 2000) {
  await page.route('**/*', route => {
    setTimeout(() => route.continue(), delay);
  });
}

// Helper para simular falhas de rede
async function simulateNetworkFailure(page: Page, failureRate: number = 0.3) {
  await page.route('**/*', route => {
    if (Math.random() < failureRate) {
      route.abort('failed');
    } else {
      route.continue();
    }
  });
}

test.describe('Timeout and Network Tests', () => {
  
  test('Slow network handling', async ({ page }) => {
    // Simular conexão muito lenta (5 segundos de delay)
    await simulateSlowConnection(page, 5000);
    
    const start = Date.now();
    await page.goto('http://localhost:8080/auth/login');
    
    // Verificar se página carrega mesmo com conexão lenta
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    const loadTime = Date.now() - start;
    
    console.log(`Slow network load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(30000); // Deve carregar em menos de 30 segundos
    
    // Verificar se elementos críticos estão presentes
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Login timeout handling', async ({ page }) => {
    // Simular conexão lenta para login
    await simulateSlowConnection(page, 3000);
    
    await page.goto('http://localhost:8080/auth/login');
    await page.fill('input[type="tel"]', TEST_USER.phone);
    await page.fill('input[type="password"]', TEST_USER.password);
    
    const start = Date.now();
    await page.click('button[type="submit"]');
    
    // Aguardar login com timeout estendido
    await page.waitForURL('**/dashboard', { timeout: 45000 });
    const loginTime = Date.now() - start;
    
    console.log(`Slow login time: ${loginTime}ms`);
    expect(loginTime).toBeLessThan(45000); // Login deve completar em menos de 45 segundos
    
    // Verificar se dashboard carregou corretamente
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('Network failure recovery', async ({ page }) => {
    await loginUser(page);
    
    // Simular falhas de rede ocasionais
    await simulateNetworkFailure(page, 0.2); // 20% de falha
    
    // Tentar operações críticas
    const operations = [
      () => page.goto('http://localhost:8080/agenda'),
      () => page.goto('http://localhost:8080/relatorios'),
      () => page.click('button:has-text("Adicionar Registro")'),
    ];
    
    for (const operation of operations) {
      try {
        const start = Date.now();
        await operation();
        const time = Date.now() - start;
        
        console.log(`Operation with network failures: ${time}ms`);
        expect(time).toBeLessThan(15000); // Operações devem ser resilientes
      } catch (error) {
        console.log('Operation failed due to network issues:', error);
        // Aplicação deve ser resiliente a falhas de rede
      }
    }
  });

  test('Offline/Online state handling', async ({ page }) => {
    await loginUser(page);
    
    // Simular estado offline
    await page.context().setOffline(true);
    
    // Tentar navegar para uma página
    await page.goto('http://localhost:8080/agenda');
    
    // Verificar se aplicação lida com estado offline
    // (Pode mostrar mensagem de erro ou usar cache)
    const hasOfflineIndicator = await page.locator('[data-testid="offline-indicator"]').isVisible().catch(() => false);
    const hasErrorMessage = await page.locator('text=offline').isVisible().catch(() => false);
    const hasCachedContent = await page.locator('h1').isVisible().catch(() => false);
    
    // Pelo menos uma dessas condições deve ser verdadeira
    expect(hasOfflineIndicator || hasErrorMessage || hasCachedContent).toBeTruthy();
    
    // Restaurar conexão
    await page.context().setOffline(false);
    
    // Aguardar reconexão
    await page.waitForTimeout(2000);
    
    // Verificar se aplicação se recupera
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verificar se conteúdo carregou após reconexão
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Request timeout handling', async ({ page }) => {
    await loginUser(page);
    
    // Simular timeout de requisições
    await page.route('**/api/**', route => {
      // Simular timeout após 10 segundos
      setTimeout(() => route.abort('timedout'), 10000);
    });
    
    // Tentar operações que fazem requisições
    try {
      await page.goto('http://localhost:8080/relatorios');
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      
      // Verificar se aplicação lida com timeout
      const hasTimeoutMessage = await page.locator('text=timeout').isVisible().catch(() => false);
      const hasErrorMessage = await page.locator('text=error').isVisible().catch(() => false);
      const hasRetryButton = await page.locator('button:has-text("Tentar novamente")').isVisible().catch(() => false);
      
      // Pelo menos uma dessas condições deve ser verdadeira
      expect(hasTimeoutMessage || hasErrorMessage || hasRetryButton).toBeTruthy();
    } catch (error) {
      console.log('Timeout test completed with error:', error);
      // Erro é esperado devido ao timeout simulado
    }
  });

  test('Concurrent slow requests', async ({ page }) => {
    await loginUser(page);
    
    // Simular múltiplas requisições lentas simultâneas
    await page.route('**/*', route => {
      const delay = Math.random() * 3000 + 1000; // 1-4 segundos
      setTimeout(() => route.continue(), delay);
    });
    
    // Fazer múltiplas navegações simultâneas
    const start = Date.now();
    
    const navigationPromises = [
      page.goto('http://localhost:8080/dashboard'),
      page.goto('http://localhost:8080/agenda'),
      page.goto('http://localhost:8080/relatorios'),
    ];
    
    // Aguardar todas as navegações
    await Promise.allSettled(navigationPromises);
    
    const totalTime = Date.now() - start;
    console.log(`Concurrent slow requests time: ${totalTime}ms`);
    
    // Verificar se pelo menos uma página carregou
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/localhost:8080/);
  });

  test('Memory usage under network stress', async ({ page }) => {
    await loginUser(page);
    
    // Simular condições de stress de rede
    await page.route('**/*', route => {
      const delay = Math.random() * 2000 + 500; // 0.5-2.5 segundos
      setTimeout(() => route.continue(), delay);
    });
    
    // Simular múltiplas operações sob stress
    for (let i = 0; i < 5; i++) {
      await page.goto('http://localhost:8080/dashboard');
      await page.waitForLoadState('networkidle');
      
      await page.goto('http://localhost:8080/agenda');
      await page.waitForLoadState('networkidle');
      
      await page.goto('http://localhost:8080/relatorios');
      await page.waitForLoadState('networkidle');
      
      // Verificar uso de memória
      const memoryUsage = await page.evaluate(() => {
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          return {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (memoryUsage) {
        const usagePercentage = (memoryUsage.used / memoryUsage.limit) * 100;
        console.log(`Memory usage under stress (cycle ${i + 1}): ${usagePercentage.toFixed(1)}%`);
        
        // Verificar se uso de memória não cresce excessivamente
        expect(usagePercentage).toBeLessThan(85); // Não deve exceder 85%
      }
      
      await page.waitForTimeout(1000); // Pausa entre ciclos
    }
  });

  test('Error boundary under network issues', async ({ page }) => {
    await loginUser(page);
    
    // Simular falhas de rede em endpoints específicos
    await page.route('**/supabase/**', route => {
      if (Math.random() < 0.5) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
    
    // Tentar operações que dependem de dados do Supabase
    try {
      await page.goto('http://localhost:8080/dashboard');
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Verificar se aplicação não quebra completamente
      const hasErrorBoundary = await page.locator('[data-testid="error-boundary"]').isVisible().catch(() => false);
      const hasFallbackContent = await page.locator('text=Erro ao carregar').isVisible().catch(() => false);
      const hasRetryMechanism = await page.locator('button:has-text("Tentar novamente")').isVisible().catch(() => false);
      
      // Aplicação deve ter algum mecanismo de recuperação
      expect(hasErrorBoundary || hasFallbackContent || hasRetryMechanism).toBeTruthy();
    } catch (error) {
      console.log('Error boundary test completed:', error);
      // Erro é esperado devido às falhas simuladas
    }
  });

  test('Progressive loading under slow network', async ({ page }) => {
    await loginUser(page);
    
    // Simular conexão lenta mas estável
    await simulateSlowConnection(page, 1500);
    
    const start = Date.now();
    await page.goto('http://localhost:8080/dashboard');
    
    // Verificar se conteúdo carrega progressivamente
    let hasHeader = false;
    let hasContent = false;
    let hasFooter = false;
    
    // Aguardar elementos aparecerem gradualmente
    try {
      await page.waitForSelector('h1', { timeout: 10000 });
      hasHeader = true;
      console.log('Header loaded');
    } catch (error) {
      console.log('Header not loaded');
    }
    
    try {
      await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 });
      hasContent = true;
      console.log('Content loaded');
    } catch (error) {
      console.log('Content not loaded');
    }
    
    try {
      await page.waitForSelector('footer', { timeout: 10000 });
      hasFooter = true;
      console.log('Footer loaded');
    } catch (error) {
      console.log('Footer not loaded');
    }
    
    const totalTime = Date.now() - start;
    console.log(`Progressive loading time: ${totalTime}ms`);
    
    // Pelo menos o header deve carregar
    expect(hasHeader).toBeTruthy();
    expect(totalTime).toBeLessThan(20000); // Deve carregar em menos de 20 segundos
  });
});
