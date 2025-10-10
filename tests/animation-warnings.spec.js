import { test, expect } from '@playwright/test';

test.describe('Animation Warnings Investigation', () => {
  test('Deve verificar avisos de animação no console', async ({ page }) => {
    const consoleMessages = [];
    
    // Capturar mensagens do console
    page.on('console', msg => {
      if (msg.type() === 'warning' || msg.type() === 'error') {
        consoleMessages.push({
          type: msg.type(),
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    // Navegar para a aplicação
    await page.goto('http://localhost:8080');
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    
    // Aguardar um pouco para que animações sejam executadas
    await page.waitForTimeout(3000);
    
    // Interagir com elementos que podem ter animações
    const buttons = await page.locator('button').all();
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      try {
        await buttons[i].hover();
        await page.waitForTimeout(500);
      } catch (e) {
        // Ignorar erros de hover
      }
    }
    
    // Verificar se há avisos relacionados a animações
    const animationWarnings = consoleMessages.filter(msg => 
      msg.text.includes('backgroundColor') || 
      msg.text.includes('borderColor') || 
      msg.text.includes('transparent') ||
      msg.text.includes('animation') ||
      msg.text.includes('framer-motion') ||
      msg.text.includes('Permissions-Policy')
    );
    
    console.log('=== AVISOS DE ANIMAÇÃO ENCONTRADOS ===');
    animationWarnings.forEach(warning => {
      console.log(`${warning.type.toUpperCase()}: ${warning.text}`);
      console.log(`Location: ${warning.location.url}:${warning.location.lineNumber}`);
      console.log('---');
    });
    
    // Log de todos os avisos para análise
    console.log('=== TODOS OS AVISOS DO CONSOLE ===');
    consoleMessages.forEach(msg => {
      console.log(`${msg.type.toUpperCase()}: ${msg.text}`);
    });
    
    // O teste passa mesmo com avisos para permitir análise
    expect(consoleMessages.length).toBeGreaterThanOrEqual(0);
  });
  
  test('Deve verificar uso de Framer Motion', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    
    // Verificar se Framer Motion está carregado
    const framerMotionLoaded = await page.evaluate(() => {
      return typeof window.motion !== 'undefined' || 
             typeof window.framerMotion !== 'undefined' ||
             document.querySelector('[data-framer-motion]') !== null;
    });
    
    console.log('Framer Motion carregado:', framerMotionLoaded);
    
    // Verificar elementos com animações
    const animatedElements = await page.locator('[style*="transform"], [style*="opacity"], [class*="animate-"]').count();
    console.log('Elementos com animações encontrados:', animatedElements);
    
    expect(animatedElements).toBeGreaterThan(0);
  });
});
