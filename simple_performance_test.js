import { chromium } from 'playwright';

/**
 * 🔍 TESTE SIMPLES PARA IDENTIFICAR PROBLEMAS DE PERFORMANCE
 * 
 * Este teste acessa diretamente a página de agenda sem login
 * para identificar problemas de carregamento e requisições
 */

const BASE_URL = 'http://localhost:8080';

async function simplePerformanceTest() {
  console.log('🔍 TESTE SIMPLES DE PERFORMANCE');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 50
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'pt-BR'
  });
  
  const page = await context.newPage();
  
  // Monitorar todas as requisições
  const allRequests = [];
  
  page.on('request', request => {
    const url = request.url();
    const timestamp = new Date().toISOString();
    
    allRequests.push({
      url,
      timestamp,
      method: request.method(),
      resourceType: request.resourceType()
    });
  });
  
  try {
    console.log('🌐 Acessando página inicial...');
    await page.goto(BASE_URL);
    
    // Aguardar carregamento inicial
    await page.waitForTimeout(3000);
    
    console.log('📊 ANÁLISE INICIAL:');
    console.log(`Total de requisições: ${allRequests.length}`);
    
    // Filtrar requisições por tipo
    const supabaseRequests = allRequests.filter(r => r.url.includes('supabase'));
    const eventRequests = allRequests.filter(r => r.url.includes('/events'));
    const calendarRequests = allRequests.filter(r => r.url.includes('/calendars'));
    
    console.log(`Requisições Supabase: ${supabaseRequests.length}`);
    console.log(`Requisições de eventos: ${eventRequests.length}`);
    console.log(`Requisições de calendários: ${calendarRequests.length}`);
    
    // Verificar se há requisições repetitivas
    if (eventRequests.length > 5) {
      console.log('\n🚨 ALERTA: Muitas requisições de eventos detectadas!');
      console.log('Primeiras 5 requisições:');
      eventRequests.slice(0, 5).forEach((req, i) => {
        console.log(`  ${i + 1}. ${req.timestamp} - ${req.url}`);
      });
    }
    
    // Verificar erros no console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Aguardar mais um pouco para capturar erros
    await page.waitForTimeout(2000);
    
    if (consoleErrors.length > 0) {
      console.log(`\n❌ ERROS NO CONSOLE: ${consoleErrors.length}`);
      consoleErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error.text}`);
      });
    } else {
      console.log('\n✅ Nenhum erro encontrado no console');
    }
    
    // Verificar estado da página
    const pageTitle = await page.title();
    const currentUrl = page.url();
    
    console.log(`\n📄 Estado da página:`);
    console.log(`  Título: ${pageTitle}`);
    console.log(`  URL: ${currentUrl}`);
    
    // Verificar se há elementos de loading
    const loadingElements = await page.locator('.loading, .spinner, [data-testid="loading"]').count();
    console.log(`  Elementos de loading: ${loadingElements}`);
    
    // Verificar se há elementos da agenda
    const agendaElements = await page.locator('[class*="agenda"], [data-testid*="agenda"]').count();
    console.log(`  Elementos da agenda: ${agendaElements}`);
    
    // Capturar screenshot
    await page.screenshot({ 
      path: 'initial_page_analysis.png',
      fullPage: true 
    });
    console.log('\n📸 Screenshot salvo: initial_page_analysis.png');
    
    // Tentar navegar para a agenda se possível
    console.log('\n📅 Tentando navegar para a agenda...');
    try {
      const agendaLink = page.locator('a[href="/agenda"], a[href*="agenda"]').first();
      if (await agendaLink.count() > 0) {
        await agendaLink.click();
        await page.waitForTimeout(3000);
        
        console.log('✅ Navegação para agenda realizada');
        
        // Verificar requisições após navegação
        const newRequests = allRequests.length;
        console.log(`Novas requisições após navegação: ${newRequests}`);
        
        // Capturar screenshot da agenda
        await page.screenshot({ 
          path: 'agenda_page_analysis.png',
          fullPage: true 
        });
        console.log('📸 Screenshot da agenda salvo: agenda_page_analysis.png');
        
      } else {
        console.log('⚠️ Link para agenda não encontrado');
      }
    } catch (error) {
      console.log(`⚠️ Erro ao navegar para agenda: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎯 RESUMO DO TESTE:');
  console.log('='.repeat(40));
  console.log(`Total de requisições: ${allRequests.length}`);
  console.log(`Requisições Supabase: ${allRequests.filter(r => r.url.includes('supabase')).length}`);
  console.log(`Requisições de eventos: ${allRequests.filter(r => r.url.includes('/events')).length}`);
  
  if (allRequests.filter(r => r.url.includes('/events')).length > 10) {
    console.log('\n🚨 PROBLEMA IDENTIFICADO: Muitas requisições de eventos');
    console.log('💡 RECOMENDAÇÃO: Verificar hook useAgendaData.ts');
  } else {
    console.log('\n✅ REQUISIÇÕES DENTRO DO NORMAL');
  }
}

// Executar o teste
simplePerformanceTest().catch(console.error);
