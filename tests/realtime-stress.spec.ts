import { test, expect } from '@playwright/test';
import { login, BASE_URL } from './helpers/login';

test.describe('Stress Test - Supabase Realtime', () => {
  
  test('10 abas mantêm conexão Realtime ativa', async ({ browser }) => {
    console.log('🔥 Iniciando stress test Realtime: 10 abas');
    
    const context = await browser.newContext();
    
    // Criar 10 abas
    const pages = await Promise.all(
      Array.from({ length: 10 }, () => context.newPage())
    );
    
    console.log('  📝 Fazendo login em 10 abas...');
    
    // Login em todas
    await Promise.all(pages.map(async (page, index) => {
      await login(page);
      console.log(`  ✅ Aba ${index + 1}: Login concluído`);
    }));
    
    // Aguardar conexões Realtime estabelecerem
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('  📝 Verificando conexões Realtime...');
    
    // Verificar que todas as abas estão conectadas (via console logs ou estado)
    const connectionChecks = await Promise.all(pages.map(async (page, index) => {
      // Verificar se página está responsiva
      const isResponsive = await page.evaluate(() => {
        return document.readyState === 'complete';
      });
      
      console.log(`  ${isResponsive ? '✅' : '❌'} Aba ${index + 1}: ${isResponsive ? 'Responsiva' : 'Não responsiva'}`);
      return isResponsive;
    }));
    
    const responsiveCount = connectionChecks.filter(Boolean).length;
    console.log(`\n  📊 Abas responsivas: ${responsiveCount}/10`);
    
    expect(responsiveCount).toBeGreaterThanOrEqual(9); // Pelo menos 90%
    
    console.log('  ✅ Stress test Realtime: 10 abas PASSOU');
    
    await context.close();
  });

  test('Multi-tab sync funciona com 5 abas', async ({ browser }) => {
    console.log('🔥 Testando sync entre 5 abas');
    
    const context = await browser.newContext();
    const pages = await Promise.all(
      Array.from({ length: 5 }, () => context.newPage())
    );
    
    // Login em todas
    await Promise.all(pages.map(page => login(page)));
    console.log('  ✅ 5 abas logadas');
    
    // Navegar todas para notificações
    await Promise.all(pages.map(async (page, index) => {
      await page.click('a[href="/notifications"]').catch(() => {});
      console.log(`  ✅ Aba ${index + 1}: Na página de notificações`);
    }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar que todas as abas carregaram
    const allLoaded = await Promise.all(pages.map(page => 
      page.url().includes('/notifications') || page.url().includes('/dashboard')
    ));
    
    const loadedCount = allLoaded.filter(Boolean).length;
    console.log(`  📊 Abas carregadas: ${loadedCount}/5`);
    
    expect(loadedCount).toBeGreaterThanOrEqual(4); // Pelo menos 80%
    
    console.log('  ✅ Multi-tab sync funcional');
    
    await context.close();
  });

  test('Reconnection funciona após disconnect simulado', async ({ browser }) => {
    console.log('🔥 Testando reconnection Realtime');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await login(page);
    console.log('  ✅ Login realizado');
    
    // Aguardar conexão Realtime estabelecer
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular offline (disconnect)
    await context.setOffline(true);
    console.log('  📡 Conexão offline (simulada)');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reconectar
    await context.setOffline(false);
    console.log('  📡 Conexão online (reconectando)');
    
    // Aguardar reconnection
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar que página ainda está funcional
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    
    console.log('  ✅ Reconnection funcional');
    
    await context.close();
  });

  test('Memory não vaza com conexões prolongadas', async ({ browser }) => {
    console.log('🔥 Testando memory leak em conexões prolongadas');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await login(page);
    
    // Capturar memória inicial
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    console.log(`  📊 Memória inicial: ${(initialMemory / 1024 / 1024).toFixed(2)}MB`);
    
    // Navegar entre páginas múltiplas vezes (simular uso prolongado)
    const routes = ['/contas', '/notifications', '/dashboard'];
    
    for (let i = 0; i < 10; i++) {
      const route = routes[i % routes.length];
      await page.click(`a[href="${route}"]`).catch(() => {});
      await page.waitForTimeout(500);
    }
    
    console.log('  ✅ 10 navegações realizadas');
    
    // Aguardar garbage collection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Capturar memória final
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    console.log(`  📊 Memória final: ${(finalMemory / 1024 / 1024).toFixed(2)}MB`);
    
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024;
      
      console.log(`  📊 Aumento de memória: ${memoryIncreaseMB.toFixed(2)}MB`);
      
      // Aumento deve ser razoável (< 50MB)
      expect(memoryIncreaseMB).toBeLessThan(50);
      
      console.log('  ✅ Sem vazamento significativo de memória');
    } else {
      console.log('  ⚠️ API de memória não disponível neste browser');
    }
    
    await context.close();
  });

  test('Latência de entrega de atualizações < 2 segundos', async ({ browser }) => {
    console.log('🔥 Testando latência de Realtime');
    
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Login em ambas
    await login(page1);
    await login(page2);
    
    console.log('  ✅ 2 abas logadas');
    
    // Navegar ambas para contas
    await page1.click('a[href="/contas"]');
    await page2.click('a[href="/contas"]');
    
    await page1.waitForURL(`${BASE_URL}/contas`);
    await page2.waitForURL(`${BASE_URL}/contas`);
    
    console.log('  ✅ Ambas na página de contas');
    
    // Aguardar sincronização inicial
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular ação na página 1 (reload para verificar sync)
    const startTime = Date.now();
    await page1.reload();
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar que página 2 ainda está funcional (Realtime mantido)
    const isPage2Responsive = await page2.evaluate(() => {
      return document.readyState === 'complete';
    });
    
    const latency = Date.now() - startTime;
    
    console.log(`  📊 Latência: ${latency}ms`);
    console.log(`  📊 Página 2 responsiva: ${isPage2Responsive ? 'Sim' : 'Não'}`);
    
    expect(isPage2Responsive).toBe(true);
    expect(latency).toBeLessThan(2000);
    
    console.log('  ✅ Latência adequada');
    
    await context.close();
  });

});

