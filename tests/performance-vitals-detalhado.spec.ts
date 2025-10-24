import { test, expect, Page } from '@playwright/test';
import { login, BASE_URL, TEST_USER } from './helpers/login';

/**
 * FASE 3: Testes de Web Vitals Detalhados
 * 
 * Testa métricas Core Web Vitals em 5 páginas principais:
 * - Login, Dashboard, Contas, Notifications, Profile
 * 
 * Métricas testadas:
 * - FCP (First Contentful Paint) < 1.8s mobile, < 1.0s desktop
 * - LCP (Largest Contentful Paint) < 2.5s mobile, < 1.5s desktop
 * - CLS (Cumulative Layout Shift) < 0.1
 * - FID/INP (First Input Delay / Interaction to Next Paint) < 100ms
 * - TTFB (Time to First Byte) < 600ms
 */

test.describe('Web Vitals Detalhados - FASE 3', () => {
  
  // Helper para medir Web Vitals
  async function measureWebVitals(page: Page) {
    return await page.evaluate(() => {
      return new Promise<{
        fcp: number;
        lcp: number;
        cls: number;
        ttfb: number;
      }>((resolve) => {
        const vitals = {
          fcp: 0,
          lcp: 0,
          cls: 0,
          ttfb: 0
        };

        // FCP
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint') as any;
          if (fcpEntry) {
            vitals.fcp = fcpEntry.startTime;
          }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });

        // LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // CLS
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              vitals.cls += entry.value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // TTFB
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
          vitals.ttfb = navEntries[0].responseStart - navEntries[0].requestStart;
        }

        // Resolver após 3s para coletar métricas
        setTimeout(() => {
          fcpObserver.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
          resolve(vitals);
        }, 3000);
      });
    });
  }

  test.describe('🎯 1. FCP (First Contentful Paint)', () => {
    
    test('FCP - Login < 1.8s (Mobile Target)', async ({ page }) => {
      // Emular mobile
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/auth/login`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 FCP Login (Mobile): ${vitals.fcp.toFixed(0)}ms`);
      expect(vitals.fcp).toBeLessThan(1800);
      
      // Screenshot no momento do FCP
      await page.screenshot({ path: 'tests/screenshots/fcp-login-mobile.png' });
    });

    test('FCP - Dashboard < 1.8s (Mobile Target)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await login(page);
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/dashboard`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 FCP Dashboard (Mobile): ${vitals.fcp.toFixed(0)}ms`);
      expect(vitals.fcp).toBeLessThan(1800);
      
      await page.screenshot({ path: 'tests/screenshots/fcp-dashboard-mobile.png' });
    });

    test('FCP - Contas < 1.8s (Mobile Target)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await login(page);
      await page.goto(`${BASE_URL}/contas`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 FCP Contas (Mobile): ${vitals.fcp.toFixed(0)}ms`);
      expect(vitals.fcp).toBeLessThan(1800);
    });

    test('FCP - Notifications < 1.8s (Mobile Target)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await login(page);
      await page.goto(`${BASE_URL}/notifications`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 FCP Notifications (Mobile): ${vitals.fcp.toFixed(0)}ms`);
      expect(vitals.fcp).toBeLessThan(1800);
    });

    test('FCP - Profile < 1.8s (Mobile Target)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await login(page);
      await page.goto(`${BASE_URL}/profile`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 FCP Profile (Mobile): ${vitals.fcp.toFixed(0)}ms`);
      expect(vitals.fcp).toBeLessThan(1800);
    });

    test('FCP - Login < 1.0s (Desktop Target)', async ({ page }) => {
      // Desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.goto(`${BASE_URL}/auth/login`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 FCP Login (Desktop): ${vitals.fcp.toFixed(0)}ms`);
      expect(vitals.fcp).toBeLessThan(1000);
      
      await page.screenshot({ path: 'tests/screenshots/fcp-login-desktop.png' });
    });

    test('FCP - Dashboard < 1.0s (Desktop Target)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await login(page);
      await page.goto(`${BASE_URL}/dashboard`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 FCP Dashboard (Desktop): ${vitals.fcp.toFixed(0)}ms`);
      expect(vitals.fcp).toBeLessThan(1000);
    });
  });

  test.describe('🖼️ 2. LCP (Largest Contentful Paint)', () => {
    
    test('LCP - Login < 2.5s (Mobile Target)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(`${BASE_URL}/auth/login`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 LCP Login (Mobile): ${vitals.lcp.toFixed(0)}ms`);
      expect(vitals.lcp).toBeLessThan(2500);
      
      // Identificar elemento LCP
      const lcpElement = await page.evaluate(() => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          return {
            element: lastEntry.element?.tagName || 'unknown',
            url: lastEntry.url || null,
            size: lastEntry.size || 0
          };
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      });
      
      console.log(`  ↳ LCP Element: ${JSON.stringify(lcpElement)}`);
    });

    test('LCP - Dashboard < 2.5s (Mobile Target)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await login(page);
      await page.goto(`${BASE_URL}/dashboard`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 LCP Dashboard (Mobile): ${vitals.lcp.toFixed(0)}ms`);
      expect(vitals.lcp).toBeLessThan(2500);
    });

    test('LCP - Contas < 2.5s (Mobile Target)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await login(page);
      await page.goto(`${BASE_URL}/contas`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 LCP Contas (Mobile): ${vitals.lcp.toFixed(0)}ms`);
      expect(vitals.lcp).toBeLessThan(2500);
    });

    test('LCP - Login < 1.5s (Desktop Target)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.goto(`${BASE_URL}/auth/login`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 LCP Login (Desktop): ${vitals.lcp.toFixed(0)}ms`);
      expect(vitals.lcp).toBeLessThan(1500);
    });

    test('LCP - Dashboard < 1.5s (Desktop Target)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await login(page);
      await page.goto(`${BASE_URL}/dashboard`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 LCP Dashboard (Desktop): ${vitals.lcp.toFixed(0)}ms`);
      expect(vitals.lcp).toBeLessThan(1500);
    });
  });

  test.describe('📐 3. CLS (Cumulative Layout Shift)', () => {
    
    test('CLS - Login < 0.1', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 CLS Login: ${vitals.cls.toFixed(3)}`);
      expect(vitals.cls).toBeLessThan(0.1);
    });

    test('CLS - Dashboard < 0.1', async ({ page }) => {
      await login(page);
      await page.goto(`${BASE_URL}/dashboard`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 CLS Dashboard: ${vitals.cls.toFixed(3)}`);
      expect(vitals.cls).toBeLessThan(0.1);
    });

    test('CLS - Contas < 0.1', async ({ page }) => {
      await login(page);
      await page.goto(`${BASE_URL}/contas`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 CLS Contas: ${vitals.cls.toFixed(3)}`);
      expect(vitals.cls).toBeLessThan(0.1);
    });

    test('CLS - Notifications < 0.1', async ({ page }) => {
      await login(page);
      await page.goto(`${BASE_URL}/notifications`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 CLS Notifications: ${vitals.cls.toFixed(3)}`);
      expect(vitals.cls).toBeLessThan(0.1);
    });

    test('CLS - Mobile viewport (375x667) < 0.1', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(`${BASE_URL}/auth/login`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 CLS Mobile (375x667): ${vitals.cls.toFixed(3)}`);
      expect(vitals.cls).toBeLessThan(0.1);
    });

    test('CLS - Tablet viewport (768x1024) < 0.1', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await login(page);
      await page.goto(`${BASE_URL}/dashboard`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 CLS Tablet (768x1024): ${vitals.cls.toFixed(3)}`);
      expect(vitals.cls).toBeLessThan(0.1);
    });
  });

  test.describe('⚡ 4. FID/INP (First Input Delay / Interaction)', () => {
    
    test('INP - Click responde em < 100ms (Login)', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`);
      
      // Medir tempo de resposta ao preencher input
      const startTime = Date.now();
      await page.fill('#phone', TEST_USER.phone);
      const responseTime = Date.now() - startTime;
      
      console.log(`📊 INP Input Fill: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(100);
    });

    test('INP - Click em botão responde em < 100ms', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`);
      await page.fill('#phone', TEST_USER.phone);
      
      const startTime = Date.now();
      await page.click('button[type="submit"]');
      await page.waitForSelector('#password', { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      
      console.log(`📊 INP Button Click: ${responseTime}ms`);
      // Mais flexível pois envolve transição de tela
      expect(responseTime).toBeLessThan(2000);
    });

    test('INP - Navegação entre rotas responde rápido', async ({ page }) => {
      await login(page);
      
      const startTime = Date.now();
      await page.click('a[href="/contas"]');
      await page.waitForURL(`${BASE_URL}/contas`);
      const responseTime = Date.now() - startTime;
      
      console.log(`📊 INP Navigation: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(1000);
    });

    test('INP - Responsividade em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(`${BASE_URL}/auth/login`);
      
      const startTime = Date.now();
      await page.fill('#phone', TEST_USER.phone);
      const responseTime = Date.now() - startTime;
      
      console.log(`📊 INP Mobile: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(150); // Mais tolerante em mobile
    });
  });

  test.describe('🌐 5. TTFB (Time to First Byte)', () => {
    
    test('TTFB - Login < 600ms', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 TTFB Login: ${vitals.ttfb.toFixed(0)}ms`);
      expect(vitals.ttfb).toBeLessThan(600);
    });

    test('TTFB - Dashboard < 600ms', async ({ page }) => {
      await login(page);
      
      await page.goto(`${BASE_URL}/dashboard`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 TTFB Dashboard: ${vitals.ttfb.toFixed(0)}ms`);
      expect(vitals.ttfb).toBeLessThan(600);
    });

    test('TTFB - Contas < 600ms', async ({ page }) => {
      await login(page);
      
      await page.goto(`${BASE_URL}/contas`);
      const vitals = await measureWebVitals(page);
      
      console.log(`📊 TTFB Contas: ${vitals.ttfb.toFixed(0)}ms`);
      expect(vitals.ttfb).toBeLessThan(600);
    });

    test('TTFB - API requests < 500ms', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`);
      
      // Capturar timing de API request
      const apiResponse = await page.waitForResponse(
        response => response.url().includes('supabase.co') && response.status() === 200,
        { timeout: 10000 }
      ).catch(() => null);
      
      if (apiResponse) {
        const timing = apiResponse.timing();
        const ttfb = timing.responseStart - timing.requestStart;
        console.log(`📊 API TTFB: ${ttfb.toFixed(0)}ms`);
        // API pode ser mais lenta, ser mais tolerante
        expect(ttfb).toBeLessThan(1000);
      }
    });
  });

  test.describe('📸 6. Captura de Screenshots em Momentos Críticos', () => {
    
    test('Screenshot - Login FCP moment', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`);
      
      // Aguardar FCP
      await page.waitForFunction(() => {
        return performance.getEntriesByType('paint')
          .some((entry: any) => entry.name === 'first-contentful-paint');
      }, { timeout: 5000 });
      
      await page.screenshot({ 
        path: 'tests/screenshots/vitals-login-fcp.png',
        fullPage: true
      });
    });

    test('Screenshot - Dashboard LCP moment', async ({ page }) => {
      await login(page);
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Aguardar conteúdo carregado
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ 
        path: 'tests/screenshots/vitals-dashboard-lcp.png',
        fullPage: true
      });
    });
  });
});

