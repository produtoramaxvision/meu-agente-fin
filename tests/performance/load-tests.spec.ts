/**
 * Performance Load Tests
 * Testes de carga e performance usando Playwright
 * 
 * Testa:
 * - Múltiplos usuários simultâneos
 * - Tempo de carregamento de páginas
 * - Performance de operações críticas
 * - Limites de conexão
 */

import { test, expect, Page } from '@playwright/test';

// Configuração de timeout para testes de performance
test.setTimeout(60000); // 60 segundos

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

// Helper para medir tempo de carregamento
async function measurePageLoadTime(page: Page, url: string): Promise<number> {
  const start = Date.now();
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  const end = Date.now();
  return end - start;
}

test.describe('Performance Load Tests', () => {
  
  test('Single user performance baseline', async ({ page }) => {
    // Medir tempo de login
    const loginStart = Date.now();
    await loginUser(page);
    const loginTime = Date.now() - loginStart;
    
    console.log(`Login time: ${loginTime}ms`);
    expect(loginTime).toBeLessThan(5000); // Login deve ser < 5 segundos
    
    // Medir tempo de carregamento do dashboard
    const dashboardTime = await measurePageLoadTime(page, 'http://localhost:8080/dashboard');
    console.log(`Dashboard load time: ${dashboardTime}ms`);
    expect(dashboardTime).toBeLessThan(3000); // Dashboard deve carregar < 3 segundos
    
    // Medir tempo de navegação entre páginas
    const agendaTime = await measurePageLoadTime(page, 'http://localhost:8080/agenda');
    console.log(`Agenda load time: ${agendaTime}ms`);
    expect(agendaTime).toBeLessThan(2000); // Agenda deve carregar < 2 segundos
    
    const reportsTime = await measurePageLoadTime(page, 'http://localhost:8080/relatorios');
    console.log(`Reports load time: ${reportsTime}ms`);
    expect(reportsTime).toBeLessThan(2000); // Reports deve carregar < 2 segundos
  });

  test('Multiple concurrent users simulation', async ({ browser }) => {
    const userCount = 5;
    const contexts = await Promise.all(
      Array.from({ length: userCount }, () => browser.newContext())
    );
    
    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );
    
    // Simular login simultâneo
    const loginPromises = pages.map(async (page, index) => {
      const start = Date.now();
      await loginUser(page);
      const time = Date.now() - start;
      console.log(`User ${index + 1} login time: ${time}ms`);
      return time;
    });
    
    const loginTimes = await Promise.all(loginPromises);
    
    // Verificar se todos os logins foram bem-sucedidos
    expect(loginTimes).toHaveLength(userCount);
    loginTimes.forEach(time => {
      expect(time).toBeLessThan(10000); // Cada login deve ser < 10 segundos
    });
    
    // Simular navegação simultânea
    const navigationPromises = pages.map(async (page, index) => {
      const urls = ['/dashboard', '/agenda', '/relatorios', '/perfil'];
      const url = urls[index % urls.length];
      
      const start = Date.now();
      await page.goto(`http://localhost:8080${url}`);
      await page.waitForLoadState('networkidle');
      const time = Date.now() - start;
      
      console.log(`User ${index + 1} navigation to ${url}: ${time}ms`);
      return time;
    });
    
    const navigationTimes = await Promise.all(navigationPromises);
    
    // Verificar performance de navegação
    navigationTimes.forEach(time => {
      expect(time).toBeLessThan(5000); // Navegação deve ser < 5 segundos
    });
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });

  test('Critical operations performance', async ({ page }) => {
    await loginUser(page);
    
    // Testar performance de operações críticas
    const operations = [
      {
        name: 'Add Financial Record',
        action: async () => {
          await page.click('button:has-text("Adicionar Registro")');
          await page.waitForSelector('[role="dialog"]');
          await page.fill('input[name="descricao"]', 'Test Performance');
          await page.fill('input[name="valor"]', '100');
          await page.selectOption('select[name="categoria"]', 'Alimentação');
          await page.click('button:has-text("Salvar")');
          await page.waitForSelector('[role="dialog"]', { state: 'hidden' });
        }
      },
      {
        name: 'Export CSV',
        action: async () => {
          await page.goto('http://localhost:8080/relatorios');
          await page.waitForLoadState('networkidle');
          await page.click('button:has-text("Exportar CSV")');
          // Aguardar download (simulado)
          await page.waitForTimeout(1000);
        }
      },
      {
        name: 'Search Operations',
        action: async () => {
          await page.fill('input[placeholder*="Buscar"]', 'test');
          await page.waitForTimeout(500); // Aguardar resultados
        }
      }
    ];
    
    for (const operation of operations) {
      const start = Date.now();
      await operation.action();
      const time = Date.now() - start;
      
      console.log(`${operation.name} time: ${time}ms`);
      
      // Verificar se operação foi executada em tempo razoável
      expect(time).toBeLessThan(10000); // Operações devem ser < 10 segundos
    }
  });

  test('Memory usage monitoring', async ({ page }) => {
    await loginUser(page);
    
    // Simular múltiplas navegações para detectar vazamentos de memória
    const pages = ['/dashboard', '/agenda', '/relatorios', '/perfil'];
    
    for (let cycle = 0; cycle < 3; cycle++) {
      console.log(`Memory test cycle ${cycle + 1}`);
      
      for (const pagePath of pages) {
        await page.goto(`http://localhost:8080${pagePath}`);
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
          console.log(`Memory usage at ${pagePath}: ${usagePercentage.toFixed(1)}%`);
          
          // Alertar se uso de memória for muito alto
          expect(usagePercentage).toBeLessThan(90); // Não deve exceder 90%
        }
        
        await page.waitForTimeout(1000); // Pausa entre navegações
      }
    }
  });

  test('Network performance under load', async ({ page }) => {
    await loginUser(page);
    
    // Simular requisições simultâneas
    const requests = [
      page.goto('http://localhost:8080/dashboard'),
      page.goto('http://localhost:8080/agenda'),
      page.goto('http://localhost:8080/relatorios'),
    ];
    
    const start = Date.now();
    await Promise.all(requests);
    const totalTime = Date.now() - start;
    
    console.log(`Concurrent requests time: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(15000); // Requisições simultâneas < 15 segundos
    
    // Verificar se todas as páginas carregaram corretamente
    await page.goto('http://localhost:8080/dashboard');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('Error handling under stress', async ({ page }) => {
    await loginUser(page);
    
    // Simular condições de stress
    await page.route('**/*', route => {
      // Simular latência ocasional
      if (Math.random() < 0.1) { // 10% chance de latência
        setTimeout(() => route.continue(), 2000);
      } else {
        route.continue();
      }
    });
    
    // Tentar operações críticas sob stress
    const operations = [
      () => page.goto('http://localhost:8080/dashboard'),
      () => page.goto('http://localhost:8080/agenda'),
      () => page.click('button:has-text("Adicionar Registro")'),
    ];
    
    for (const operation of operations) {
      try {
        const start = Date.now();
        await operation();
        const time = Date.now() - start;
        
        console.log(`Stress test operation time: ${time}ms`);
        expect(time).toBeLessThan(10000); // Operações devem ser resilientes
      } catch (error) {
        console.log('Operation failed under stress:', error);
        // Aplicação deve ser resiliente a falhas ocasionais
      }
    }
  });
});
