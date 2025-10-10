import { test, expect } from '@playwright/test';

test.describe('Validação da Correção do Loop Infinito', () => {
  test('deve verificar redução de requisições na agenda', async ({ page }) => {
    // Monitorar requisições de rede
    const requests = [];
    
    page.on('request', request => {
      if (request.url().includes('/events') && request.url().includes('select=*')) {
        requests.push({
          url: request.url(),
          timestamp: new Date().toISOString(),
          method: request.method()
        });
      }
    });

    // Login
    await page.goto('http://localhost:8080');
    await page.fill('input[type="tel"]', '5511949746110');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    // Aguardar login
    await page.waitForURL('**/dashboard');
    
    // Navegar para agenda
    await page.click('a[href="/agenda"]');
    await page.waitForLoadState('networkidle');
    
    // Aguardar carregamento inicial
    await page.waitForSelector('[data-testid="agenda-container"]', { timeout: 10000 });
    
    // Limpar requisições anteriores
    requests.length = 0;
    
    // Monitorar por 30 segundos
    await page.waitForTimeout(30000);
    
    // Verificar se houve redução significativa de requisições
    console.log(`Total de requisições em 30 segundos: ${requests.length}`);
    console.log('Requisições capturadas:', requests.map(r => r.timestamp));
    
    // Critério de sucesso: menos de 5 requisições em 30 segundos
    expect(requests.length).toBeLessThan(5);
    
    // Verificar se a agenda ainda funciona
    await expect(page.locator('[data-testid="agenda-container"]')).toBeVisible();
    
    // Testar navegação entre datas
    await page.click('[data-testid="prev-day"]');
    await page.waitForTimeout(2000);
    
    await page.click('[data-testid="next-day"]');
    await page.waitForTimeout(2000);
    
    // Verificar se não há regressões funcionais
    await expect(page.locator('[data-testid="agenda-container"]')).toBeVisible();
  });

  test('deve verificar estabilidade da query key', async ({ page }) => {
    // Monitorar requisições específicas
    const eventRequests = [];
    
    page.on('request', request => {
      if (request.url().includes('/events') && request.url().includes('select=*')) {
        eventRequests.push({
          url: request.url(),
          timestamp: Date.now(),
          queryParams: new URL(request.url()).searchParams
        });
      }
    });

    // Login
    await page.goto('http://localhost:8080');
    await page.fill('input[type="tel"]', '5511949746110');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    // Aguardar login
    await page.waitForURL('**/dashboard');
    
    // Navegar para agenda
    await page.click('a[href="/agenda"]');
    await page.waitForLoadState('networkidle');
    
    // Aguardar carregamento inicial
    await page.waitForSelector('[data-testid="agenda-container"]', { timeout: 10000 });
    
    // Limpar requisições anteriores
    eventRequests.length = 0;
    
    // Monitorar por 15 segundos
    await page.waitForTimeout(15000);
    
    // Verificar se não há requisições duplicadas com mesma query
    const uniqueQueries = new Set();
    eventRequests.forEach(req => {
      const queryString = req.queryParams.toString();
      uniqueQueries.add(queryString);
    });
    
    console.log(`Requisições únicas: ${uniqueQueries.size}`);
    console.log(`Total de requisições: ${eventRequests.length}`);
    
    // Critério: não deve haver mais de 2 requisições únicas em 15 segundos
    expect(uniqueQueries.size).toBeLessThanOrEqual(2);
  });

  test('deve verificar funcionalidade da agenda após correção', async ({ page }) => {
    // Login
    await page.goto('http://localhost:8080');
    await page.fill('input[type="tel"]', '5511949746110');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    // Aguardar login
    await page.waitForURL('**/dashboard');
    
    // Navegar para agenda
    await page.click('a[href="/agenda"]');
    await page.waitForLoadState('networkidle');
    
    // Aguardar carregamento inicial
    await page.waitForSelector('[data-testid="agenda-container"]', { timeout: 10000 });
    
    // Verificar se a agenda carrega corretamente
    await expect(page.locator('[data-testid="agenda-container"]')).toBeVisible();
    
    // Testar mudança de view
    await page.click('[data-testid="view-week"]');
    await page.waitForTimeout(2000);
    
    await page.click('[data-testid="view-month"]');
    await page.waitForTimeout(2000);
    
    // Verificar se não há erros no console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Aguardar um pouco mais para capturar erros
    await page.waitForTimeout(5000);
    
    // Não deve haver erros relacionados ao loop infinito
    const loopErrors = consoleErrors.filter(error => 
      error.includes('Maximum update depth') || 
      error.includes('infinite loop') ||
      error.includes('too many re-renders')
    );
    
    expect(loopErrors.length).toBe(0);
  });
});
