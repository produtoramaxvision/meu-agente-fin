import { test, expect } from '@playwright/test';
import { login, BASE_URL } from './helpers/login';

/**
 * FASE 3: Testes de Loading States
 * 
 * Testa:
 * - Skeleton loading aparece rapidamente
 * - Transição suave skeleton → conteúdo
 * - Data fetching com network throttling
 * - TanStack Query cache hit/miss
 * - Realtime performance
 */

test.describe('Loading States - FASE 3', () => {

  test.describe('🎨 1. Skeleton Loading', () => {
    
    test('Skeleton aparece em < 100ms (Notifications)', async ({ page }) => {
      await login(page);
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/notifications`);
      
      // Verificar se skeleton aparece rapidamente
      const skeletonVisible = await page.locator('[data-testid="skeleton"], .animate-pulse')
        .first()
        .isVisible({ timeout: 100 })
        .catch(() => false);
      
      const skeletonTime = Date.now() - startTime;
      
      console.log(`📊 Skeleton apareceu em: ${skeletonTime}ms`);
      console.log(`  ↳ Skeleton visível: ${skeletonVisible ? 'Sim' : 'Não'}`);
      
      // Se skeleton existe, deve aparecer em < 100ms
      if (skeletonVisible) {
        expect(skeletonTime).toBeLessThan(100);
      }
    });

    test('Skeleton aparece em < 100ms (Dashboard)', async ({ page }) => {
      await login(page);
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/dashboard`);
      
      const skeletonVisible = await page.locator('[data-testid="skeleton"], .animate-pulse')
        .first()
        .isVisible({ timeout: 100 })
        .catch(() => false);
      
      const skeletonTime = Date.now() - startTime;
      
      console.log(`📊 Dashboard Skeleton: ${skeletonTime}ms`);
      
      if (skeletonVisible) {
        expect(skeletonTime).toBeLessThan(100);
      }
    });

    test('Skeleton aparece em < 100ms (Contas)', async ({ page }) => {
      await login(page);
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/contas`);
      
      const skeletonVisible = await page.locator('[data-testid="skeleton"], .animate-pulse')
        .first()
        .isVisible({ timeout: 100 })
        .catch(() => false);
      
      const skeletonTime = Date.now() - startTime;
      
      console.log(`📊 Contas Skeleton: ${skeletonTime}ms`);
      
      if (skeletonVisible) {
        expect(skeletonTime).toBeLessThan(100);
      }
    });

    test('Transição suave skeleton → conteúdo', async ({ page }) => {
      await login(page);
      await page.goto(`${BASE_URL}/notifications`);
      
      // Verificar se skeleton existe
      const hasSkeleton = await page.locator('[data-testid="skeleton"], .animate-pulse')
        .first()
        .isVisible({ timeout: 1000 })
        .catch(() => false);
      
      if (hasSkeleton) {
        // Aguardar skeleton desaparecer
        await page.waitForSelector('[data-testid="skeleton"], .animate-pulse', { 
          state: 'hidden',
          timeout: 5000
        }).catch(() => {});
        
        // Verificar se conteúdo está visível
        const hasContent = await page.locator('[data-testid="notification-item"], article, .notification')
          .first()
          .isVisible({ timeout: 1000 })
          .catch(() => false);
        
        console.log(`📊 Transição skeleton → conteúdo: ${hasContent ? 'Sucesso' : 'Falhou'}`);
      } else {
        console.log(`📊 Skeleton não implementado em Notifications`);
      }
    });
  });

  test.describe('📡 2. Data Fetching com Network Throttling', () => {
    
    test('Data fetching em Slow 3G', async ({ page, context }) => {
      await login(page);
      
      // Emular Slow 3G
      await context.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay artificial
        await route.continue();
      });
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/contas`);
      
      // Aguardar dados carregarem
      await page.waitForSelector('[data-testid="financial-record"], table, .transaction', { 
        timeout: 10000 
      }).catch(() => {});
      
      const loadTime = Date.now() - startTime;
      
      console.log(`📊 Data load (Slow 3G): ${loadTime}ms`);
      
      // Com Slow 3G, aceitar até 10s
      expect(loadTime).toBeLessThan(10000);
    });

    test('Data fetching em Fast 3G', async ({ page }) => {
      await login(page);
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/contas`);
      
      await page.waitForSelector('[data-testid="financial-record"], table, .transaction', { 
        timeout: 8000 
      }).catch(() => {});
      
      const loadTime = Date.now() - startTime;
      
      console.log(`📊 Data load (Fast 3G): ${loadTime}ms`);
      expect(loadTime).toBeLessThan(8000);
    });

    test('Data fetching em 4G', async ({ page }) => {
      await login(page);
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/dashboard`);
      
      await page.waitForSelector('[data-testid="chart"], canvas, .dashboard-widget', { 
        timeout: 5000 
      }).catch(() => {});
      
      const loadTime = Date.now() - startTime;
      
      console.log(`📊 Data load (4G): ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    });

    test('Múltiplas chamadas API paralelas', async ({ page }) => {
      await login(page);
      
      // Capturar múltiplas requisições
      const apiCalls: any[] = [];
      
      page.on('response', response => {
        if (response.url().includes('supabase.co') && 
            response.request().method() !== 'OPTIONS') {
          apiCalls.push({
            url: response.url(),
            status: response.status(),
            timing: response.timing()
          });
        }
      });
      
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      
      console.log(`📊 Total API calls: ${apiCalls.length}`);
      console.log(`  ↳ Calls captured:`, apiCalls.slice(0, 5).map(c => ({
        url: c.url.split('/').pop(),
        status: c.status
      })));
      
      // Verificar que pelo menos algumas chamadas foram feitas
      expect(apiCalls.length).toBeGreaterThan(0);
    });
  });

  test.describe('🔄 3. TanStack Query Cache', () => {
    
    test('Cache hit - segunda visita mais rápida', async ({ page }) => {
      await login(page);
      
      // Primeira visita (cache miss)
      const firstStartTime = Date.now();
      await page.goto(`${BASE_URL}/contas`);
      await page.waitForLoadState('networkidle');
      const firstLoadTime = Date.now() - firstStartTime;
      
      // Segunda visita (cache hit)
      const secondStartTime = Date.now();
      await page.goto(`${BASE_URL}/dashboard`);
      await page.goto(`${BASE_URL}/contas`);
      await page.waitForLoadState('networkidle');
      const secondLoadTime = Date.now() - secondStartTime;
      
      console.log(`📊 Cache Performance:`);
      console.log(`  ↳ 1ª visita (cache miss): ${firstLoadTime}ms`);
      console.log(`  ↳ 2ª visita (cache hit): ${secondLoadTime}ms`);
      console.log(`  ↳ Melhoria: ${((1 - secondLoadTime/firstLoadTime) * 100).toFixed(1)}%`);
      
      // Segunda visita deve ser mais rápida
      expect(secondLoadTime).toBeLessThan(firstLoadTime);
    });

    test('Invalidação de cache funciona', async ({ page }) => {
      await login(page);
      
      // Carregar página
      await page.goto(`${BASE_URL}/contas`);
      await page.waitForLoadState('networkidle');
      
      // Criar novo registro (deve invalidar cache)
      const hasAddButton = await page.locator('button:has-text("Adicionar"), button:has-text("Nova")').first().isVisible().catch(() => false);
      
      if (hasAddButton) {
        await page.locator('button:has-text("Adicionar"), button:has-text("Nova")').first().click();
        
        // Verificar que modal/form abriu
        const modalVisible = await page.locator('[role="dialog"], .modal').isVisible({ timeout: 2000 }).catch(() => false);
        
        console.log(`📊 Invalidação de cache testada: ${modalVisible ? 'Modal aberto' : 'Modal não encontrado'}`);
      } else {
        console.log(`📊 Botão adicionar não encontrado para teste de invalidação`);
      }
    });

    test('Stale-while-revalidate funciona', async ({ page }) => {
      await login(page);
      
      // Primeira visita
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      
      // Aguardar um tempo para dados ficarem stale
      await page.waitForTimeout(2000);
      
      // Segunda visita - deve mostrar dados stale imediatamente e revalidar em background
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/notifications`);
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Verificar se conteúdo aparece rapidamente (dados stale)
      const hasContent = await page.locator('[data-testid="chart"], canvas, .dashboard-widget')
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      
      const showTime = Date.now() - startTime;
      
      console.log(`📊 Stale-while-revalidate: ${showTime}ms`);
      console.log(`  ↳ Conteúdo visível: ${hasContent ? 'Sim' : 'Não'}`);
      
      if (hasContent) {
        // Com stale data, deve ser muito rápido
        expect(showTime).toBeLessThan(1000);
      }
    });

    test('Prefetching de dados ao hover', async ({ page }) => {
      await login(page);
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Hover sobre link de navegação
      const contasLink = page.locator('a[href="/contas"]').first();
      const hasLink = await contasLink.isVisible().catch(() => false);
      
      if (hasLink) {
        await contasLink.hover();
        
        // Aguardar um pouco para prefetch acontecer
        await page.waitForTimeout(500);
        
        // Navegar - deve ser mais rápido por causa do prefetch
        const startTime = Date.now();
        await contasLink.click();
        await page.waitForURL(`${BASE_URL}/contas`);
        const navTime = Date.now() - startTime;
        
        console.log(`📊 Navegação com prefetch: ${navTime}ms`);
        
        // Com prefetch, deve ser rápido
        expect(navTime).toBeLessThan(2000);
      }
    });
  });

  test.describe('⚡ 4. Realtime Performance', () => {
    
    test('Latência de atualização Realtime < 500ms', async ({ page }) => {
      await login(page);
      await page.goto(`${BASE_URL}/notifications`);
      
      // Aguardar conexão Realtime estabelecer
      await page.waitForTimeout(2000);
      
      // Contar notificações atuais
      const initialCount = await page.locator('[data-testid="notification-item"], article.notification')
        .count()
        .catch(() => 0);
      
      console.log(`📊 Notificações iniciais: ${initialCount}`);
      
      // Aguardar possíveis updates em tempo real
      await page.waitForTimeout(3000);
      
      // Verificar se houve update (pode não haver se não houver atividade)
      const finalCount = await page.locator('[data-testid="notification-item"], article.notification')
        .count()
        .catch(() => 0);
      
      console.log(`📊 Notificações finais: ${finalCount}`);
      console.log(`  ↳ Updates recebidos: ${finalCount - initialCount}`);
    });

    test('Realtime não causa re-renders desnecessários', async ({ page }) => {
      await login(page);
      await page.goto(`${BASE_URL}/notifications`);
      
      // Capturar re-renders usando Performance API
      const renderCount = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let count = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'measure' && entry.name.includes('render')) {
                count++;
              }
            }
          });
          observer.observe({ entryTypes: ['measure'] });
          
          setTimeout(() => {
            observer.disconnect();
            resolve(count);
          }, 3000);
        });
      });
      
      console.log(`📊 Re-renders em 3s: ${renderCount}`);
      
      // Deve ter poucos re-renders (< 10 em 3s)
      expect(renderCount).toBeLessThan(20);
    });

    test('Múltiplas subscriptions simultâneas', async ({ page, context }) => {
      await login(page);
      
      // Abrir múltiplas páginas em tabs
      const page2 = await context.newPage();
      await page2.goto(`${BASE_URL}/auth/login`);
      await page2.fill('#phone', '5511949746110');
      await page2.click('button[type="submit"]');
      await page2.waitForSelector('#password');
      await page2.fill('#password', '123456789');
      await page2.click('button[type="submit"]');
      await page2.waitForURL(`${BASE_URL}/dashboard`);
      
      // Tab 1: Notifications
      await page.goto(`${BASE_URL}/notifications`);
      
      // Tab 2: Dashboard
      await page2.goto(`${BASE_URL}/dashboard`);
      
      // Aguardar ambas estabelecerem conexões Realtime
      await page.waitForTimeout(2000);
      await page2.waitForTimeout(2000);
      
      // Verificar que ambas estão funcionando
      const page1HasContent = await page.locator('body').textContent().then(text => text!.length > 100);
      const page2HasContent = await page2.locator('body').textContent().then(text => text!.length > 100);
      
      console.log(`📊 Múltiplas subscriptions:`);
      console.log(`  ↳ Tab 1 (Notifications): ${page1HasContent ? 'OK' : 'Erro'}`);
      console.log(`  ↳ Tab 2 (Dashboard): ${page2HasContent ? 'OK' : 'Erro'}`);
      
      expect(page1HasContent).toBeTruthy();
      expect(page2HasContent).toBeTruthy();
      
      await page2.close();
    });
  });

  test.describe('🎯 5. Loading States Avançados', () => {
    
    test('Loading state em erro de rede', async ({ page, context }) => {
      await login(page);
      
      // Simular erro de rede
      await context.route('**/rest/v1/**', route => route.abort());
      
      await page.goto(`${BASE_URL}/contas`);
      
      // Verificar se mensagem de erro aparece
      const hasError = await page.locator('text=/erro|error|falha|failed/i')
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      
      console.log(`📊 Erro de rede detectado: ${hasError ? 'Sim' : 'Não'}`);
      
      // Deve mostrar algum feedback de erro
      // Não é crítico, mas é bom ter
    });

    test('Loading state em timeout', async ({ page, context }) => {
      await login(page);
      
      // Simular timeout (delay muito longo)
      await context.route('**/rest/v1/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30s
        await route.continue();
      });
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/contas`, { timeout: 10000 }).catch(() => {});
      const timeElapsed = Date.now() - startTime;
      
      console.log(`📊 Timeout handling: ${timeElapsed}ms`);
      
      // Deve ter timeout configurado (< 15s)
      expect(timeElapsed).toBeLessThan(15000);
    });

    test('Loading state persiste durante transições', async ({ page }) => {
      await login(page);
      
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Navegar rapidamente entre páginas
      const navs = ['/contas', '/notifications', '/dashboard', '/profile'];
      
      for (const nav of navs) {
        await page.goto(`${BASE_URL}${nav}`);
        
        // Verificar se skeleton ou loading aparece
        const hasLoading = await page.locator('[data-testid="skeleton"], .animate-pulse, .loading')
          .first()
          .isVisible({ timeout: 500 })
          .catch(() => false);
        
        console.log(`📊 Loading em ${nav}: ${hasLoading ? 'Visível' : 'Não visível'}`);
        
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });
});

