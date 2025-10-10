import { chromium } from 'playwright';

/**
 * 🔍 TESTE ESPECÍFICO PARA IDENTIFICAR A CAUSA DO LOOP INFINITO
 * 
 * Este teste foca especificamente em identificar:
 * - Qual componente está causando o loop
 * - Qual hook está fazendo requisições excessivas
 * - Qual estado está sendo atualizado constantemente
 */

const BASE_URL = 'http://localhost:8080';
const TEST_USER = '5511949746110';
const TEST_PASSWORD = '12345678';

async function identifyLoopCause() {
  console.log('🔍 IDENTIFICAÇÃO DA CAUSA DO LOOP INFINITO');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'pt-BR'
  });
  
  const page = await context.newPage();
  
  // Monitorar requisições específicas
  const eventRequests = [];
  const calendarRequests = [];
  const otherRequests = [];
  
  page.on('request', request => {
    const url = request.url();
    const timestamp = new Date().toISOString();
    
    if (url.includes('/events')) {
      eventRequests.push({
        url,
        timestamp,
        method: request.method(),
        headers: request.headers()
      });
    } else if (url.includes('/calendars')) {
      calendarRequests.push({
        url,
        timestamp,
        method: request.method(),
        headers: request.headers()
      });
    } else {
      otherRequests.push({
        url,
        timestamp,
        method: request.method(),
        headers: request.headers()
      });
    }
  });
  
  try {
    console.log('🔐 Fazendo login...');
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="tel"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    console.log('✅ Login realizado com sucesso');
    
    // Aguardar um pouco para estabilizar
    await page.waitForTimeout(2000);
    
    console.log('📅 Navegando para a agenda...');
    await page.click('a[href="/agenda"]');
    await page.waitForURL('**/agenda');
    
    console.log('⏱️ Monitorando requisições por 10 segundos...');
    
    // Monitorar por 10 segundos
    const startTime = Date.now();
    while (Date.now() - startTime < 10000) {
      await page.waitForTimeout(100);
    }
    
    console.log('\n📊 ANÁLISE DAS REQUISIÇÕES:');
    console.log('='.repeat(40));
    
    console.log(`\n📅 REQUISIÇÕES DE EVENTOS: ${eventRequests.length}`);
    if (eventRequests.length > 0) {
      console.log('Primeiras 5 requisições:');
      eventRequests.slice(0, 5).forEach((req, i) => {
        console.log(`  ${i + 1}. ${req.timestamp} - ${req.method} ${req.url}`);
      });
      
      if (eventRequests.length > 5) {
        console.log(`  ... e mais ${eventRequests.length - 5} requisições`);
      }
      
      // Analisar padrão de timestamps
      const timestamps = eventRequests.map(r => new Date(r.timestamp).getTime());
      const intervals = [];
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i-1]);
      }
      
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      console.log(`\n📈 Intervalo médio entre requisições: ${avgInterval.toFixed(2)}ms`);
      
      if (avgInterval < 100) {
        console.log('🚨 ALERTA: Intervalo muito baixo! Possível loop infinito.');
      }
    }
    
    console.log(`\n📅 REQUISIÇÕES DE CALENDÁRIOS: ${calendarRequests.length}`);
    if (calendarRequests.length > 0) {
      console.log('Primeiras 3 requisições:');
      calendarRequests.slice(0, 3).forEach((req, i) => {
        console.log(`  ${i + 1}. ${req.timestamp} - ${req.method} ${req.url}`);
      });
    }
    
    console.log(`\n🌐 OUTRAS REQUISIÇÕES: ${otherRequests.length}`);
    if (otherRequests.length > 0) {
      console.log('Primeiras 3 requisições:');
      otherRequests.slice(0, 3).forEach((req, i) => {
        console.log(`  ${i + 1}. ${req.timestamp} - ${req.method} ${req.url}`);
      });
    }
    
    // Verificar se há erros no console
    console.log('\n🔍 Verificando erros no console...');
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (consoleMessages.length > 0) {
      console.log(`\n❌ ERROS ENCONTRADOS: ${consoleMessages.length}`);
      consoleMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. ${msg.timestamp} - ${msg.text}`);
      });
    } else {
      console.log('✅ Nenhum erro encontrado no console');
    }
    
    // Verificar estado da página
    console.log('\n📄 Verificando estado da página...');
    const pageTitle = await page.title();
    const currentUrl = page.url();
    const isLoading = await page.locator('[data-testid="loading"], .loading, .spinner').count() > 0;
    
    console.log(`  Título: ${pageTitle}`);
    console.log(`  URL: ${currentUrl}`);
    console.log(`  Carregando: ${isLoading ? 'Sim' : 'Não'}`);
    
    // Verificar se há elementos da agenda visíveis
    const agendaElements = await page.locator('[data-testid*="agenda"], .agenda, [class*="agenda"]').count();
    const calendarElements = await page.locator('[data-testid*="calendar"], .calendar, [class*="calendar"]').count();
    const eventElements = await page.locator('[data-testid*="event"], .event, [class*="event"]').count();
    
    console.log(`  Elementos da agenda: ${agendaElements}`);
    console.log(`  Elementos do calendário: ${calendarElements}`);
    console.log(`  Elementos de eventos: ${eventElements}`);
    
    // Capturar screenshot final
    await page.screenshot({ 
      path: 'agenda_loop_analysis.png',
      fullPage: true 
    });
    console.log('\n📸 Screenshot salvo: agenda_loop_analysis.png');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎯 CONCLUSÕES:');
  console.log('='.repeat(40));
  
  if (eventRequests.length > 50) {
    console.log('🚨 CONFIRMADO: Loop infinito de requisições de eventos');
    console.log('🔍 CAUSA PROVÁVEL: Hook useAgendaData com dependências incorretas');
    console.log('💡 SOLUÇÃO: Revisar useEffect e dependências no hook');
  } else if (eventRequests.length > 10) {
    console.log('⚠️ ALERTA: Muitas requisições de eventos');
    console.log('🔍 CAUSA PROVÁVEL: Re-renderização excessiva');
    console.log('💡 SOLUÇÃO: Otimizar re-renderizações');
  } else {
    console.log('✅ REQUISIÇÕES NORMALS: Número de requisições dentro do esperado');
  }
  
  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('1. Analisar o hook useAgendaData.ts');
  console.log('2. Verificar dependências dos useEffect');
  console.log('3. Implementar debounce se necessário');
  console.log('4. Adicionar cache para evitar requisições desnecessárias');
}

// Executar o teste
identifyLoopCause().catch(console.error);
