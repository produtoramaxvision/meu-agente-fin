import { chromium } from 'playwright';

/**
 * 🔧 TESTE ESPECÍFICO PARA CORREÇÃO DE PERFORMANCE DA AGENDA
 * 
 * Este teste foca especificamente no problema identificado:
 * - Loop infinito de requisições
 * - Timeout na página de agenda
 * - Performance crítica
 */

const BASE_URL = 'http://localhost:8080';
const TEST_USER = '5511949746110';
const TEST_PASSWORD = '12345678';

async function diagnoseAgendaPerformance() {
  console.log('🔧 DIAGNÓSTICO DE PERFORMANCE DA AGENDA');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 50 // Mais lento para observar melhor
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'pt-BR'
  });
  
  const page = await context.newPage();
  
  // Monitorar requisições específicas
  const requests = [];
  const responses = [];
  
  page.on('request', request => {
    if (request.url().includes('/events')) {
      requests.push({
        url: request.url(),
        timestamp: Date.now(),
        method: request.method()
      });
      console.log(`📤 REQUEST: ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/events')) {
      responses.push({
        url: response.url(),
        timestamp: Date.now(),
        status: response.status(),
        duration: Date.now()
      });
      console.log(`📥 RESPONSE: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    // 1. Login
    console.log('\n🔐 Realizando login...');
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="tel"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('✅ Login realizado');
    
    // 2. Aguardar dashboard carregar
    console.log('\n📊 Aguardando dashboard...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 3. Navegar para agenda
    console.log('\n📅 Navegando para agenda...');
    await page.goto(`${BASE_URL}/agenda`);
    
    // 4. Monitorar por 10 segundos
    console.log('\n⏱️ Monitorando requisições por 10 segundos...');
    const startTime = Date.now();
    
    while (Date.now() - startTime < 10000) {
      await page.waitForTimeout(100);
      
      // Verificar se há elementos de loading
      const loadingElements = await page.locator('[class*="loading"], [class*="spinner"], [aria-label*="loading"]').count();
      if (loadingElements > 0) {
        console.log(`🔄 Loading elements found: ${loadingElements}`);
      }
      
      // Verificar se há erros no console
      const consoleMessages = await page.evaluate(() => {
        return window.consoleMessages || [];
      });
      
      if (consoleMessages.length > 0) {
        console.log(`📝 Console messages: ${consoleMessages.length}`);
      }
    }
    
    // 5. Análise dos resultados
    console.log('\n📊 ANÁLISE DOS RESULTADOS:');
    console.log(`Total de requisições: ${requests.length}`);
    console.log(`Total de respostas: ${responses.length}`);
    
    // Calcular frequência de requisições
    if (requests.length > 1) {
      const timeSpan = requests[requests.length - 1].timestamp - requests[0].timestamp;
      const frequency = requests.length / (timeSpan / 1000);
      console.log(`Frequência: ${frequency.toFixed(2)} requisições/segundo`);
      
      if (frequency > 5) {
        console.log('🚨 ALERTA: Frequência muito alta! Possível loop infinito.');
      }
    }
    
    // Verificar padrões de requisição
    const uniqueUrls = [...new Set(requests.map(r => r.url()))];
    console.log(`URLs únicas: ${uniqueUrls.length}`);
    
    if (uniqueUrls.length === 1 && requests.length > 10) {
      console.log('🚨 ALERTA: Mesma URL sendo chamada repetidamente!');
    }
    
    // 6. Verificar elementos da página
    console.log('\n🔍 Verificando elementos da página...');
    
    const agendaElements = await page.locator('[class*="agenda"], [class*="calendar"], [class*="event"]').count();
    console.log(`Elementos de agenda: ${agendaElements}`);
    
    const loadingStates = await page.locator('[class*="loading"], [class*="spinner"]').count();
    console.log(`Estados de loading: ${loadingStates}`);
    
    const errorElements = await page.locator('[class*="error"], [role="alert"]').count();
    console.log(`Elementos de erro: ${errorElements}`);
    
    // 7. Capturar screenshot final
    await page.screenshot({ 
      path: 'test-results/agenda-performance-diagnosis.png',
      fullPage: true 
    });
    
    // 8. Verificar se a página carregou completamente
    const pageTitle = await page.title();
    console.log(`Título da página: ${pageTitle}`);
    
    const url = page.url();
    console.log(`URL atual: ${url}`);
    
    // 9. Testar interações básicas
    console.log('\n🖱️ Testando interações básicas...');
    
    try {
      // Tentar clicar em um botão se existir
      const buttons = await page.locator('button').count();
      console.log(`Botões encontrados: ${buttons}`);
      
      if (buttons > 0) {
        await page.locator('button').first().click();
        await page.waitForTimeout(1000);
        console.log('✅ Clique em botão funcionou');
      }
      
      // Tentar navegação com teclado
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);
      console.log('✅ Navegação por teclado funcionou');
      
    } catch (error) {
      console.log(`⚠️ Erro em interações: ${error.message}`);
    }
    
    // 10. Relatório final
    console.log('\n📋 RELATÓRIO FINAL:');
    console.log('='.repeat(40));
    
    if (requests.length > 50) {
      console.log('🚨 PROBLEMA CRÍTICO: Muitas requisições');
      console.log('   Solução: Implementar debounce e cache');
    } else if (requests.length > 20) {
      console.log('⚠️ PROBLEMA MÉDIO: Requisições excessivas');
      console.log('   Solução: Otimizar queries');
    } else {
      console.log('✅ PERFORMANCE OK: Requisições dentro do normal');
    }
    
    if (loadingStates > 0) {
      console.log('🔄 Loading states ativos - página ainda carregando');
    }
    
    if (errorElements > 0) {
      console.log('❌ Elementos de erro encontrados');
    }
    
    console.log('\n🎯 RECOMENDAÇÕES:');
    console.log('1. Implementar debounce nas queries de eventos');
    console.log('2. Adicionar cache para dados de agenda');
    console.log('3. Implementar loading states visuais');
    console.log('4. Adicionar error boundaries');
    console.log('5. Otimizar re-renders do React');
    
  } catch (error) {
    console.error('❌ ERRO DURANTE O DIAGNÓSTICO:', error);
    
    // Capturar screenshot de erro
    await page.screenshot({ 
      path: 'test-results/agenda-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Executar diagnóstico
diagnoseAgendaPerformance().catch(console.error);
