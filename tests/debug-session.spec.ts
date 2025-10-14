import { test, expect } from '@playwright/test';

test.describe('Debug Session Persistence', () => {
  test('debug localStorage and session state', async ({ page }) => {
    // Navegar para a página de login
    await page.goto('http://localhost:8080/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Preencher e fazer login
    await page.fill('input[type="tel"]', '55 (11) 9 4974-6110');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento
    await page.waitForURL('**/dashboard');
    
    // Debug: Verificar localStorage
    const localStorageKeys = await page.evaluate(() => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      return keys;
    });
    
    console.log('LocalStorage keys after login:', localStorageKeys);
    
    // Debug: Verificar sessionStorage
    const sessionStorageKeys = await page.evaluate(() => {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        keys.push(sessionStorage.key(i));
      }
      return keys;
    });
    
    console.log('SessionStorage keys after login:', sessionStorageKeys);
    
    // Debug: Verificar conteúdo do localStorage do Supabase
    const supabaseData = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('supabase') || key.includes('sb-')) {
          data[key] = localStorage.getItem(key);
        }
      }
      return data;
    });
    
    console.log('Supabase localStorage data:', supabaseData);
    
    // Aguardar um pouco
    await page.waitForTimeout(3000);
    
    // Recarregar a página
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Debug: Verificar localStorage após reload
    const localStorageKeysAfterReload = await page.evaluate(() => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      return keys;
    });
    
    console.log('LocalStorage keys after reload:', localStorageKeysAfterReload);
    
    // Debug: Verificar URL atual
    const currentURL = page.url();
    console.log('Current URL after reload:', currentURL);
    
    // Debug: Verificar se há elementos de loading
    const loadingElements = await page.locator('[class*="loading"], [class*="spinner"], .animate-spin').count();
    console.log('Loading elements found:', loadingElements);
    
    // Debug: Verificar console logs
    page.on('console', msg => {
      if (msg.text().includes('Auth state changed') || msg.text().includes('Error')) {
        console.log('Console log:', msg.text());
      }
    });
    
    // Aguardar mais um pouco para ver se há mudanças
    await page.waitForTimeout(5000);
    
    const finalURL = page.url();
    console.log('Final URL after waiting:', finalURL);
    
    // Verificar se ainda estamos no dashboard
    if (finalURL.includes('/dashboard')) {
      console.log('✅ SUCCESS: Session persisted after reload');
    } else {
      console.log('❌ FAILED: Session lost after reload, redirected to:', finalURL);
    }
  });
});
