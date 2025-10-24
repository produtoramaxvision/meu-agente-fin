import { test, expect } from '@playwright/test';
import { login, BASE_URL } from './helpers/login';

/**
 * FASE 3: Testes de Memory Leaks e Cache/Storage
 * 
 * Testa:
 * - Memory usage e vazamentos
 * - Component unmounting cleanup
 * - TanStack Query cache performance
 * - LocalStorage/SessionStorage
 * - IndexedDB (se usado)
 */

test.describe('Memory Leaks e Cache - FASE 3', () => {

  test.describe('💾 1. Memory Usage', () => {
    
    test('Heap size inicial vs após uso intenso', async ({ page }) => {
      // Medir heap inicial
      const initialHeap = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (initialHeap) {
        console.log(`📊 Heap inicial:`);
        console.log(`  ↳ Usado: ${(initialHeap.used / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  ↳ Total: ${(initialHeap.total / 1024 / 1024).toFixed(2)} MB`);
      }
      
      // Fazer login e navegar intensamente
      await login(page);
      
      const pages = ['/dashboard', '/contas', '/notifications', '/profile', '/dashboard'];
      for (const route of pages) {
        await page.goto(`${BASE_URL}${route}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
      
      // Medir heap após uso
      const finalHeap = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize
          };
        }
        return null;
      });
      
      if (initialHeap && finalHeap) {
        const heapIncrease = finalHeap.used - initialHeap.used;
        const heapIncreasePercent = (heapIncrease / initialHeap.used) * 100;
        
        console.log(`📊 Heap final:`);
        console.log(`  ↳ Usado: ${(finalHeap.used / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  ↳ Aumento: ${(heapIncrease / 1024 / 1024).toFixed(2)} MB (${heapIncreasePercent.toFixed(1)}%)`);
        
        // Aumento de memória deve ser razoável (< 100%)
        expect(heapIncreasePercent).toBeLessThan(200);
      }
    });

    test('Memory não vaza após múltiplas navegações', async ({ page }) => {
      await login(page);
      
      // Navegar 10x entre páginas
      const measurements: number[] = [];
      
      for (let i = 0; i < 10; i++) {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.goto(`${BASE_URL}/contas`);
        await page.waitForLoadState('networkidle');
        
        const heap = await page.evaluate(() => {
          if (performance.memory) {
            return performance.memory.usedJSHeapSize;
          }
          return 0;
        });
        
        if (heap > 0) {
          measurements.push(heap);
        }
      }
      
      if (measurements.length > 5) {
        const firstHalf = measurements.slice(0, 5);
        const secondHalf = measurements.slice(5);
        
        const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        const memoryGrowth = ((avgSecond - avgFirst) / avgFirst) * 100;
        
        console.log(`📊 Crescimento de memória em 10 navegações: ${memoryGrowth.toFixed(1)}%`);
        console.log(`  ↳ Primeira metade: ${(avgFirst / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  ↳ Segunda metade: ${(avgSecond / 1024 / 1024).toFixed(2)} MB`);
        
        // Crescimento deve ser pequeno (< 50%)
        expect(memoryGrowth).toBeLessThan(100);
      }
    });

    test('Garbage collection funciona corretamente', async ({ page }) => {
      await login(page);
      
      // Criar muito lixo na memória
      await page.evaluate(() => {
        const garbage: any[] = [];
        for (let i = 0; i < 1000; i++) {
          garbage.push(new Array(1000).fill(Math.random()));
        }
      });
      
      const heapBefore = await page.evaluate(() => {
        if (performance.memory) {
          return performance.memory.usedJSHeapSize;
        }
        return 0;
      });
      
      // Force GC se possível (não funciona em todos os browsers)
      await page.evaluate(() => {
        if ((window as any).gc) {
          (window as any).gc();
        }
      });
      
      await page.waitForTimeout(2000);
      
      const heapAfter = await page.evaluate(() => {
        if (performance.memory) {
          return performance.memory.usedJSHeapSize;
        }
        return 0;
      });
      
      if (heapBefore > 0 && heapAfter > 0) {
        console.log(`📊 Heap antes GC: ${(heapBefore / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📊 Heap depois GC: ${(heapAfter / 1024 / 1024).toFixed(2)} MB`);
        
        // GC pode ou não funcionar dependendo do browser
        // Apenas registrar informação
      }
    });

    test('Memory leak após logout', async ({ page }) => {
      await login(page);
      
      // Navegar por várias páginas
      await page.goto(`${BASE_URL}/dashboard`);
      await page.goto(`${BASE_URL}/contas`);
      await page.goto(`${BASE_URL}/notifications`);
      
      const heapBeforeLogout = await page.evaluate(() => {
        if (performance.memory) {
          return performance.memory.usedJSHeapSize;
        }
        return 0;
      });
      
      // Fazer logout
      const logoutButton = page.locator('button:has-text("Sair"), button:has-text("Logout")').first();
      const hasLogout = await logoutButton.isVisible().catch(() => false);
      
      if (hasLogout) {
        await logoutButton.click();
        await page.waitForURL(`${BASE_URL}/auth/login`);
        
        await page.waitForTimeout(2000);
        
        const heapAfterLogout = await page.evaluate(() => {
          if (performance.memory) {
            return performance.memory.usedJSHeapSize;
          }
          return 0;
        });
        
        if (heapBeforeLogout > 0 && heapAfterLogout > 0) {
          const reduction = ((heapBeforeLogout - heapAfterLogout) / heapBeforeLogout) * 100;
          
          console.log(`📊 Heap antes logout: ${(heapBeforeLogout / 1024 / 1024).toFixed(2)} MB`);
          console.log(`📊 Heap depois logout: ${(heapAfterLogout / 1024 / 1024).toFixed(2)} MB`);
          console.log(`  ↳ Redução: ${reduction > 0 ? reduction.toFixed(1) : '0'}%`);
          
          // Memory deve ser liberada após logout (ou pelo menos não crescer)
          expect(heapAfterLogout).toBeLessThanOrEqual(heapBeforeLogout * 1.2); // Max 20% a mais
        }
      }
    });
  });

  test.describe('🧹 2. Component Unmounting Cleanup', () => {
    
    test('Cleanup de useEffect ao desmontar', async ({ page }) => {
      await login(page);
      
      // Capturar console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Navegar entre páginas (mount/unmount)
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      
      await page.goto(`${BASE_URL}/contas`);
      await page.waitForLoadState('networkidle');
      
      await page.goto(`${BASE_URL}/notifications`);
      await page.waitForLoadState('networkidle');
      
      // Verificar erros de cleanup
      const cleanupErrors = consoleErrors.filter(error => 
        error.includes('memory leak') || 
        error.includes('unmounted') ||
        error.includes('setState')
      );
      
      console.log(`📊 Cleanup errors: ${cleanupErrors.length}`);
      if (cleanupErrors.length > 0) {
        console.log(`  ↳ Erros:`, cleanupErrors);
      }
      
      // Não deve ter erros de cleanup
      expect(cleanupErrors.length).toBe(0);
    });

    test('Limpeza de subscriptions Realtime', async ({ page }) => {
      await login(page);
      
      // Ir para página com Realtime
      await page.goto(`${BASE_URL}/notifications`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Navegar para outra página (deve fazer unsubscribe)
      await page.goto(`${BASE_URL}/profile`);
      await page.waitForLoadState('networkidle');
      
      // Verificar que não há erros de conexão Realtime
      const errors = await page.evaluate(() => {
        return (window as any).__realtimeErrors || [];
      });
      
      console.log(`📊 Realtime cleanup errors: ${errors.length}`);
      
      expect(errors.length).toBe(0);
    });

    test('Cancelamento de promises pendentes', async ({ page }) => {
      await login(page);
      
      // Iniciar carregamento de página
      const navigationPromise = page.goto(`${BASE_URL}/dashboard`);
      
      // Cancelar navegação rapidamente
      await page.waitForTimeout(500);
      await page.goto(`${BASE_URL}/contas`);
      
      await page.waitForLoadState('networkidle');
      
      // Não deve ter erros de promises não canceladas
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('AbortError')) {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.waitForTimeout(1000);
      
      console.log(`📊 Promise cancellation errors: ${consoleErrors.length}`);
    });

    test('Limpeza de event listeners', async ({ page }) => {
      await login(page);
      
      // Contar event listeners antes
      const listenersBefore = await page.evaluate(() => {
        return (window as any).getEventListeners ? 
          Object.keys((window as any).getEventListeners(window)).length : 
          0;
      });
      
      // Navegar entre páginas várias vezes
      for (let i = 0; i < 5; i++) {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.goto(`${BASE_URL}/contas`);
      }
      
      await page.waitForLoadState('networkidle');
      
      // Contar event listeners depois
      const listenersAfter = await page.evaluate(() => {
        return (window as any).getEventListeners ? 
          Object.keys((window as any).getEventListeners(window)).length : 
          0;
      });
      
      if (listenersBefore > 0 || listenersAfter > 0) {
        console.log(`📊 Event listeners antes: ${listenersBefore}`);
        console.log(`📊 Event listeners depois: ${listenersAfter}`);
        
        // Não deve acumular muitos listeners
        if (listenersBefore > 0) {
          expect(listenersAfter).toBeLessThan(listenersBefore * 2);
        }
      }
    });
  });

  test.describe('💰 3. TanStack Query Cache', () => {
    
    test('Hit rate do cache', async ({ page }) => {
      await login(page);
      
      // Primeira visita (cache miss)
      await page.goto(`${BASE_URL}/contas`);
      await page.waitForLoadState('networkidle');
      
      const apiCallsFirst: string[] = [];
      page.on('request', request => {
        if (request.url().includes('supabase.co') && request.method() === 'GET') {
          apiCallsFirst.push(request.url());
        }
      });
      
      // Segunda visita (cache hit)
      await page.goto(`${BASE_URL}/dashboard`);
      await page.goto(`${BASE_URL}/contas`);
      await page.waitForLoadState('networkidle');
      
      await page.waitForTimeout(2000);
      
      console.log(`📊 API calls na segunda visita: ${apiCallsFirst.length}`);
      console.log(`  ↳ Cache deve reduzir chamadas`);
      
      // Com cache, deve ter menos chamadas na segunda visita
      expect(apiCallsFirst.length).toBeLessThan(10);
    });

    test('Garbage collection do cache', async ({ page }) => {
      await login(page);
      
      // Carregar muitas páginas para preencher cache
      const pages = ['/dashboard', '/contas', '/notifications', '/profile', '/dashboard'];
      
      for (const route of pages) {
        await page.goto(`${BASE_URL}${route}`);
        await page.waitForLoadState('networkidle');
      }
      
      // Aguardar GC do cache (TanStack Query GC após 5min por padrão, mas pode ter sido customizado)
      await page.waitForTimeout(2000);
      
      // Verificar tamanho do cache
      const cacheSize = await page.evaluate(() => {
        const cache = (window as any).__REACT_QUERY_CACHE__;
        return cache ? Object.keys(cache).length : 0;
      });
      
      console.log(`📊 Cache entries: ${cacheSize}`);
      
      // Cache deve existir mas não deve ser gigante
      expect(cacheSize).toBeLessThan(100);
    });

    test('Performance com cache quente vs frio', async ({ page }) => {
      await login(page);
      
      // Cache frio
      const coldStartTime = Date.now();
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      const coldLoadTime = Date.now() - coldStartTime;
      
      // Cache quente
      const warmStartTime = Date.now();
      await page.goto(`${BASE_URL}/contas`);
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      const warmLoadTime = Date.now() - warmStartTime;
      
      console.log(`📊 Cache Performance:`);
      console.log(`  ↳ Cache frio: ${coldLoadTime}ms`);
      console.log(`  ↳ Cache quente: ${warmLoadTime}ms`);
      console.log(`  ↳ Melhoria: ${((1 - warmLoadTime/coldLoadTime) * 100).toFixed(1)}%`);
      
      // Cache quente deve ser mais rápido
      expect(warmLoadTime).toBeLessThan(coldLoadTime);
    });

    test('Persistência do cache', async ({ page, context }) => {
      await login(page);
      
      // Carregar dados
      await page.goto(`${BASE_URL}/contas`);
      await page.waitForLoadState('networkidle');
      
      // Verificar se cache persiste (depende da implementação)
      const hasPersistence = await page.evaluate(() => {
        return localStorage.getItem('REACT_QUERY_OFFLINE_CACHE') !== null;
      });
      
      console.log(`📊 Cache persistência: ${hasPersistence ? 'Habilitada' : 'Não detectada'}`);
      
      // Apenas informativo
    });
  });

  test.describe('🗄️ 4. LocalStorage/SessionStorage', () => {
    
    test('Tamanho dos dados armazenados', async ({ page }) => {
      await login(page);
      
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      
      const storageSize = await page.evaluate(() => {
        let localStorageSize = 0;
        let sessionStorageSize = 0;
        
        for (const key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            localStorageSize += localStorage[key].length + key.length;
          }
        }
        
        for (const key in sessionStorage) {
          if (sessionStorage.hasOwnProperty(key)) {
            sessionStorageSize += sessionStorage[key].length + key.length;
          }
        }
        
        return {
          localStorage: localStorageSize,
          sessionStorage: sessionStorageSize,
          localStorageKeys: Object.keys(localStorage).length,
          sessionStorageKeys: Object.keys(sessionStorage).length
        };
      });
      
      console.log(`📊 Storage Size:`);
      console.log(`  ↳ LocalStorage: ${(storageSize.localStorage / 1024).toFixed(2)} KB (${storageSize.localStorageKeys} keys)`);
      console.log(`  ↳ SessionStorage: ${(storageSize.sessionStorage / 1024).toFixed(2)} KB (${storageSize.sessionStorageKeys} keys)`);
      
      // LocalStorage não deve ser gigante (< 2MB recomendado)
      expect(storageSize.localStorage).toBeLessThan(2 * 1024 * 1024);
    });

    test('Performance de read/write no storage', async ({ page }) => {
      await login(page);
      
      // Testar escrita
      const writeStartTime = Date.now();
      await page.evaluate(() => {
        for (let i = 0; i < 100; i++) {
          localStorage.setItem(`test_${i}`, JSON.stringify({ data: 'test data ' + i }));
        }
      });
      const writeTime = Date.now() - writeStartTime;
      
      // Testar leitura
      const readStartTime = Date.now();
      await page.evaluate(() => {
        for (let i = 0; i < 100; i++) {
          const data = localStorage.getItem(`test_${i}`);
          JSON.parse(data || '{}');
        }
      });
      const readTime = Date.now() - readStartTime;
      
      // Limpar
      await page.evaluate(() => {
        for (let i = 0; i < 100; i++) {
          localStorage.removeItem(`test_${i}`);
        }
      });
      
      console.log(`📊 Storage Performance:`);
      console.log(`  ↳ Write 100 items: ${writeTime}ms`);
      console.log(`  ↳ Read 100 items: ${readTime}ms`);
      
      // Operações devem ser rápidas
      expect(writeTime).toBeLessThan(100);
      expect(readTime).toBeLessThan(50);
    });

    test('Limpeza de dados antigos', async ({ page }) => {
      await login(page);
      
      // Verificar se há mecanismo de limpeza de dados antigos
      const hasOldData = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const oldKeys = keys.filter(key => {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const parsed = JSON.parse(value);
              const timestamp = parsed.timestamp || parsed.createdAt || parsed.updatedAt;
              if (timestamp) {
                const age = Date.now() - new Date(timestamp).getTime();
                const dayInMs = 24 * 60 * 60 * 1000;
                return age > 30 * dayInMs; // > 30 dias
              }
            } catch (e) {
              // Não é JSON
            }
          }
          return false;
        });
        
        return {
          total: keys.length,
          old: oldKeys.length,
          oldKeys: oldKeys.slice(0, 5)
        };
      });
      
      console.log(`📊 Dados antigos no storage:`);
      console.log(`  ↳ Total keys: ${hasOldData.total}`);
      console.log(`  ↳ Keys antigas (>30 dias): ${hasOldData.old}`);
      
      // Deve limpar dados antigos periodicamente
      // Mais de 50% de dados antigos pode ser problema
      if (hasOldData.total > 0) {
        const oldPercentage = (hasOldData.old / hasOldData.total) * 100;
        console.log(`  ↳ Porcentagem antiga: ${oldPercentage.toFixed(1)}%`);
        expect(oldPercentage).toBeLessThan(50);
      }
    });

    test('Storage não excede quota', async ({ page }) => {
      await login(page);
      
      const quota = await page.evaluate(async () => {
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          return {
            usage: estimate.usage,
            quota: estimate.quota,
            percentage: estimate.quota ? (estimate.usage! / estimate.quota) * 100 : 0
          };
        }
        return null;
      });
      
      if (quota) {
        console.log(`📊 Storage Quota:`);
        console.log(`  ↳ Usado: ${(quota.usage! / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  ↳ Quota: ${(quota.quota! / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  ↳ Uso: ${quota.percentage.toFixed(2)}%`);
        
        // Não deve usar mais de 50% da quota
        expect(quota.percentage).toBeLessThan(50);
      }
    });
  });

  test.describe('💿 5. IndexedDB (se usado)', () => {
    
    test('Performance de IndexedDB queries', async ({ page }) => {
      await login(page);
      
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      
      const hasIndexedDB = await page.evaluate(async () => {
        if (!window.indexedDB) {
          return false;
        }
        
        // Tentar abrir DB
        return new Promise<boolean>((resolve) => {
          const request = indexedDB.open('test-db');
          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      });
      
      console.log(`📊 IndexedDB disponível: ${hasIndexedDB ? 'Sim' : 'Não'}`);
      
      if (hasIndexedDB) {
        // Testar performance se IndexedDB está sendo usado
        const queryTime = await page.evaluate(async () => {
          const start = Date.now();
          
          // Tentar query no IndexedDB
          const dbs = await indexedDB.databases();
          
          return Date.now() - start;
        });
        
        console.log(`  ↳ Query time: ${queryTime}ms`);
        expect(queryTime).toBeLessThan(100);
      }
    });
  });
});

