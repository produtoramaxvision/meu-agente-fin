import { test, expect } from '@playwright/test';

test.describe('Validação da Correção do Loop Infinito - Etapa 1.1', () => {
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
    
    // Aguardar carregamento da página
    await page.waitForTimeout(5000);
    
    // Limpar requisições anteriores
    requests.length = 0;
    
    // Monitorar por 20 segundos
    await page.waitForTimeout(20000);
    
    // Verificar se houve redução significativa de requisições
    console.log(`Total de requisições em 20 segundos: ${requests.length}`);
    console.log('Requisições capturadas:', requests.map(r => r.timestamp));
    
    // Critério de sucesso: menos de 3 requisições em 20 segundos
    expect(requests.length).toBeLessThan(3);
    
    // Verificar se a agenda ainda funciona - procurar por elementos existentes
    await expect(page.locator('h1')).toContainText('Agenda');
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
    
    // Aguardar carregamento da página
    await page.waitForTimeout(5000);
    
    // Limpar requisições anteriores
    eventRequests.length = 0;
    
    // Monitorar por 10 segundos
    await page.waitForTimeout(10000);
    
    // Verificar se não há requisições duplicadas com mesma query
    const uniqueQueries = new Set();
    eventRequests.forEach(req => {
      const queryString = req.queryParams.toString();
      uniqueQueries.add(queryString);
    });
    
    console.log(`Requisições únicas: ${uniqueQueries.size}`);
    console.log(`Total de requisições: ${eventRequests.length}`);
    
    // Critério: não deve haver mais de 1 requisição única em 10 segundos
    expect(uniqueQueries.size).toBeLessThanOrEqual(1);
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
    
    // Aguardar carregamento da página
    await page.waitForTimeout(5000);
    
    // Verificar se a agenda carrega corretamente
    await expect(page.locator('h1')).toContainText('Agenda');
    
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
    
    console.log('Erros encontrados:', consoleErrors);
    expect(loopErrors.length).toBe(0);
  });
});
