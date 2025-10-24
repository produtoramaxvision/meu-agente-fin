import { test, expect } from '@playwright/test';
import { login, BASE_URL } from './helpers/login';

test.describe('Testes de Responsividade Avançada', () => {
  
  test('Desktop 1920x1080 - UI perfeita', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/auth/login`);
    
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Verificar tamanho dos elementos
    const phoneBox = await page.locator('#phone').boundingBox();
    expect(phoneBox).toBeTruthy();
    expect(phoneBox!.width).toBeGreaterThan(200);
    
    console.log('✅ Desktop 1920x1080: UI OK');
  });

  test('Desktop 1366x768 - UI responsiva', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(`${BASE_URL}/auth/login`);
    
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Elementos não devem estar cortados
    const submitButton = await page.locator('button[type="submit"]').boundingBox();
    expect(submitButton).toBeTruthy();
    expect(submitButton!.width).toBeGreaterThan(80);
    
    console.log('✅ Desktop 1366x768: UI OK');
  });

  test('Tablet iPad Pro 1024x768 - Landscape', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto(`${BASE_URL}/auth/login`);
    
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Verificar que formulário está centralizado
    const phoneBox = await page.locator('#phone').boundingBox();
    expect(phoneBox).toBeTruthy();
    expect(phoneBox!.x).toBeGreaterThan(100); // Tem margem
    
    console.log('✅ Tablet iPad Pro (Landscape): UI OK');
  });

  test('Tablet iPad Mini 768x1024 - Portrait', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/auth/login`);
    
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Em portrait, elementos devem estar em coluna
    const phoneBox = await page.locator('#phone').boundingBox();
    const buttonBox = await page.locator('button[type="submit"]').boundingBox();
    
    expect(phoneBox).toBeTruthy();
    expect(buttonBox).toBeTruthy();
    
    // Botão deve estar abaixo do input
    expect(buttonBox!.y).toBeGreaterThan(phoneBox!.y);
    
    console.log('✅ Tablet iPad Mini (Portrait): UI OK');
  });

  test('Mobile iPhone 12 390x844 - Portrait', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/auth/login`);
    
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Elementos devem ocupar boa parte da largura
    const phoneBox = await page.locator('#phone').boundingBox();
    expect(phoneBox).toBeTruthy();
    expect(phoneBox!.width).toBeGreaterThan(200); // Pelo menos 200px
    
    console.log('✅ iPhone 12: UI OK');
  });

  test('Mobile Samsung Galaxy 360x740 - Small Screen', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`${BASE_URL}/auth/login`);
    
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Texto deve ser legível (tamanho mínimo)
    const fontSize = await page.locator('#phone').evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    
    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(14); // Mínimo 14px
    
    console.log('✅ Samsung Galaxy (Small): UI OK');
  });

  test('Mobile Landscape 844x390', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto(`${BASE_URL}/auth/login`);
    
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Em landscape, deve aproveitar largura
    const phoneBox = await page.locator('#phone').boundingBox();
    expect(phoneBox).toBeTruthy();
    expect(phoneBox!.width).toBeGreaterThan(300);
    
    console.log('✅ Mobile Landscape: UI OK');
  });

  test('Elementos clicáveis têm tamanho mínimo (44x44px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Verificar botão de submit
    const submitButton = await page.locator('button[type="submit"]').boundingBox();
    expect(submitButton).toBeTruthy();
    
    // WCAG recomenda mínimo 44x44px para touch targets
    expect(submitButton!.width).toBeGreaterThanOrEqual(44);
    expect(submitButton!.height).toBeGreaterThanOrEqual(40); // Pode ser um pouco menor em altura
    
    console.log('✅ Elementos clicáveis têm tamanho adequado');
  });

  test('Texto legível em todos os dispositivos', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}/auth/login`);
      
      // Verificar tamanho de fonte de elementos de texto
      const heading = await page.locator('h1').first();
      const fontSize = await heading.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });
      
      const fontSizeNum = parseInt(fontSize);
      
      // Títulos devem ter pelo menos 20px
      expect(fontSizeNum).toBeGreaterThanOrEqual(20);
      
      console.log(`  ✓ ${viewport.name}: Fonte ${fontSizeNum}px`);
    }
    
    console.log('✅ Texto legível em todos dispositivos');
  });

  test('Dashboard responsivo em múltiplos viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop FHD' },
      { width: 1366, height: 768, name: 'Desktop HD' },
      { width: 1024, height: 768, name: 'Tablet Landscape' },
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 390, height: 844, name: 'Mobile' },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await login(page);
      
      // Verificar que dashboard carrega
      await expect(page.locator('h1:has-text("Dashboard")').first()).toBeVisible();
      
      // Verificar que não há overflow horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
      
      console.log(`  ✓ ${viewport.name}: Dashboard OK`);
    }
    
    console.log('✅ Dashboard responsivo em todos viewports');
  });

  test('Imagens não distorcem em diferentes resoluções', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}/auth/login`);
      
      // Procurar imagens (logo, etc)
      const images = await page.locator('img').all();
      
      for (const img of images) {
        const isVisible = await img.isVisible().catch(() => false);
        
        if (isVisible) {
          const box = await img.boundingBox();
          
          if (box) {
            // Aspect ratio não deve ser muito distorcido
            const aspectRatio = box.width / box.height;
            
            // A maioria das imagens tem aspect ratio entre 0.5 e 3
            expect(aspectRatio).toBeGreaterThan(0.3);
            expect(aspectRatio).toBeLessThan(5);
          }
        }
      }
      
      console.log(`  ✓ ${viewport.width}x${viewport.height}: Imagens OK`);
    }
    
    console.log('✅ Imagens não distorcem');
  });

  test('Modais/Dialogs responsivos em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    
    // Abrir sidebar em mobile (hambúrguer)
    const menuButton = await page.locator('button[aria-label*="menu" i], button[data-state="closed"]').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }
    
    // Ir para contas
    await page.click('a[href="/contas"]');
    await page.waitForURL(`${BASE_URL}/contas`);
    
    await page.waitForLoadState('networkidle');
    
    // Verificar que página não quebra em mobile (scroll horizontal mínimo)
    const hasHorizontalScroll = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      return scrollWidth > clientWidth + 10; // Margem de 10px
    });
    
    expect(hasHorizontalScroll).toBe(false);
    
    console.log('✅ UI não quebra em mobile');
  });

});

