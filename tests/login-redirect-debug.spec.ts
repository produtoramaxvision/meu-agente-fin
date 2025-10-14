import { test, expect } from '@playwright/test';

test.describe('Login Redirect Debug', () => {
  test('should debug login redirect behavior', async ({ page }) => {
    // Monitorar console logs
    page.on('console', msg => {
      if (msg.text().includes('Auth state changed') || 
          msg.text().includes('Login') || 
          msg.text().includes('Error') ||
          msg.text().includes('navigate')) {
        console.log('Console:', msg.text());
      }
    });

    // Monitorar mudanças de URL
    page.on('framenavigated', frame => {
      if (frame.url().includes('localhost:8080')) {
        console.log('Navigation to:', frame.url());
      }
    });

    // Navegar para login
    await page.goto('http://localhost:8080/auth/login');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Initial page loaded:', page.url());
    
    // Preencher formulário
    await page.fill('input[type="tel"]', '55 (11) 9 4974-6110');
    await page.fill('input[type="password"]', '12345678');
    
    console.log('✅ Form filled');
    
    // Monitorar requisições de rede
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('supabase') || request.url().includes('auth')) {
        requests.push(`${request.method()} ${request.url()}`);
      }
    });

    const responses: string[] = [];
    page.on('response', response => {
      if (response.url().includes('supabase') || response.url().includes('auth')) {
        responses.push(`${response.status()} ${response.url()}`);
      }
    });

    // Clicar no botão de login
    console.log('🔄 Clicking login button...');
    await page.click('button[type="submit"]');
    
    // Aguardar mudança de estado do botão
    await page.waitForSelector('button[type="submit"]:has-text("Entrando...")');
    console.log('✅ Button state changed to "Entrando..."');
    
    // Aguardar um pouco para ver o que acontece
    await page.waitForTimeout(2000);
    
    // Verificar se há reload da página
    const currentURL = page.url();
    console.log('Current URL after 2s:', currentURL);
    
    // Aguardar mais tempo para ver se há redirecionamento
    await page.waitForTimeout(3000);
    
    const finalURL = page.url();
    console.log('Final URL after 5s:', finalURL);
    
    // Verificar se há elementos de loading
    const loadingElements = await page.locator('[class*="loading"], [class*="spinner"], .animate-spin').count();
    console.log('Loading elements found:', loadingElements);
    
    // Verificar estado do botão
    const buttonText = await page.locator('button[type="submit"]').textContent();
    console.log('Button text:', buttonText);
    
    // Verificar se há erros na página
    const errorElements = await page.locator('.error, .alert-error, [class*="error"]').count();
    console.log('Error elements found:', errorElements);
    
    // Log das requisições
    console.log('Network requests:', requests);
    console.log('Network responses:', responses);
    
    // Verificar localStorage
    const localStorageData = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          data[key] = localStorage.getItem(key);
        }
      }
      return data;
    });
    
    console.log('LocalStorage Supabase data:', Object.keys(localStorageData));
    
    // Aguardar mais tempo para ver se há mudanças
    await page.waitForTimeout(5000);
    
    const veryFinalURL = page.url();
    console.log('Very final URL after 10s:', veryFinalURL);
    
    if (veryFinalURL.includes('/dashboard')) {
      console.log('✅ SUCCESS: Redirected to dashboard');
    } else if (veryFinalURL.includes('/auth/login')) {
      console.log('❌ FAILED: Still on login page');
    } else {
      console.log('⚠️ UNKNOWN: Unexpected URL:', veryFinalURL);
    }
  });
});
