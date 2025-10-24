import { test, expect, Page } from '@playwright/test';
import { login } from './helpers/login';

/**
 * TESTE DE DETECÇÃO DE LOOP INFINITO
 * 
 * Este teste monitora:
 * 1. Mensagens de console com "LOOP INFINITO"
 * 2. Número de requisições ao Supabase em 10 segundos
 * 3. Requisições duplicadas com timestamps muito próximos
 * 4. Performance geral da aplicação
 */

test.describe('🔍 Monitoramento de Loop Infinito', () => {
  let consoleMessages: string[] = [];
  let errorMessages: string[] = [];
  let warningMessages: string[] = [];
  let supabaseRequests: Array<{ url: string; timestamp: number }> = [];
  
  test.beforeEach(async ({ page }) => {
    consoleMessages = [];
    errorMessages = [];
    warningMessages = [];
    supabaseRequests = [];

    // Monitorar console logs
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
      
      if (msg.type() === 'error') {
        errorMessages.push(text);
      }
      
      if (msg.type() === 'warning') {
        warningMessages.push(text);
      }
      
      // Detectar mensagens específicas de loop
      if (text.includes('LOOP INFINITO') || text.includes('loop infinito')) {
        console.error('🚨 LOOP INFINITO DETECTADO:', text);
      }
    });

    // Monitorar requisições ao Supabase
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('supabase.co') || url.includes('/rest/v1/')) {
        supabaseRequests.push({
          url,
          timestamp: Date.now(),
        });
      }
    });

    // Fazer login
    await login(page);
  });

  test('✅ TC001 - Verificar ausência de loops infinitos na Dashboard', async ({ page }) => {
    console.log('\n🧪 Teste: Dashboard - Monitoramento de Loop Infinito\n');

    // Resetar contadores
    supabaseRequests = [];
    
    // Navegar para dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Esperar 10 segundos monitorando
    console.log('⏱️  Monitorando por 10 segundos...');
    await page.waitForTimeout(10000);

    // ANÁLISE 1: Verificar mensagens de loop no console
    const loopMessages = consoleMessages.filter(msg => 
      msg.includes('LOOP INFINITO') || 
      msg.includes('loop infinito') ||
      msg.includes('Requisição bloqueada')
    );
    
    console.log(`📊 Resultados Dashboard:`);
    console.log(`  - Total de logs: ${consoleMessages.length}`);
    console.log(`  - Erros: ${errorMessages.length}`);
    console.log(`  - Avisos: ${warningMessages.length}`);
    console.log(`  - Mensagens de loop: ${loopMessages.length}`);
    console.log(`  - Requisições Supabase: ${supabaseRequests.length}`);

    // Verificações
    expect(loopMessages.length, 'Não deve haver mensagens de loop infinito').toBe(0);
    expect(errorMessages.filter(e => e.includes('LOOP')).length, 'Não deve haver erros de loop').toBe(0);
    
    // Verificar se número de requisições é razoável (< 50 em 10 segundos)
    expect(supabaseRequests.length, 'Número de requisições deve ser razoável').toBeLessThan(50);

    if (loopMessages.length > 0) {
      console.error('🚨 Mensagens de loop detectadas:', loopMessages);
    }
  });

  test('✅ TC002 - Verificar ausência de loops infinitos na Agenda', async ({ page }) => {
    console.log('\n🧪 Teste: Agenda - Monitoramento de Loop Infinito\n');

    // Resetar contadores
    supabaseRequests = [];
    consoleMessages = [];
    errorMessages = [];
    
    // Navegar para agenda
    await page.goto('/agenda');
    await page.waitForLoadState('networkidle');
    
    // Esperar carregamento inicial
    await page.waitForTimeout(2000);
    
    // Contar requisições em intervalo de 5 segundos
    const requestsBefore = supabaseRequests.length;
    const timestamp1 = Date.now();
    
    console.log('⏱️  Monitorando por 5 segundos...');
    await page.waitForTimeout(5000);
    
    const timestamp2 = Date.now();
    const requestsAfter = supabaseRequests.length;
    const newRequests = requestsAfter - requestsBefore;
    const timeElapsed = (timestamp2 - timestamp1) / 1000;

    // ANÁLISE 2: Detectar requisições duplicadas/suspeitas
    const eventRequests = supabaseRequests.filter(r => r.url.includes('/events'));
    const duplicateDetection = analyzeDuplicateRequests(eventRequests);

    console.log(`📊 Resultados Agenda:`);
    console.log(`  - Total de logs: ${consoleMessages.length}`);
    console.log(`  - Erros: ${errorMessages.length}`);
    console.log(`  - Avisos: ${warningMessages.length}`);
    console.log(`  - Requisições totais: ${supabaseRequests.length}`);
    console.log(`  - Novas requisições em ${timeElapsed}s: ${newRequests}`);
    console.log(`  - Taxa: ${(newRequests / timeElapsed).toFixed(2)} req/s`);
    console.log(`  - Requisições de eventos: ${eventRequests.length}`);
    console.log(`  - Requisições suspeitas: ${duplicateDetection.suspiciousCount}`);

    // ANÁLISE 3: Verificar mensagens de loop
    const loopMessages = consoleMessages.filter(msg => 
      msg.includes('LOOP INFINITO') || 
      msg.includes('loop infinito') ||
      msg.includes('Requisição bloqueada')
    );

    // Verificações
    expect(loopMessages.length, 'Não deve haver mensagens de loop infinito').toBe(0);
    expect(errorMessages.filter(e => e.includes('LOOP')).length, 'Não deve haver erros de loop').toBe(0);
    
    // Verificar taxa de requisições (não deve passar de 5 req/s)
    const requestRate = newRequests / timeElapsed;
    expect(requestRate, 'Taxa de requisições deve ser razoável').toBeLessThan(5);
    
    // Verificar requisições duplicadas suspeitas (< 10% do total)
    const suspiciousPercentage = (duplicateDetection.suspiciousCount / eventRequests.length) * 100;
    expect(suspiciousPercentage, 'Percentual de requisições suspeitas deve ser baixo').toBeLessThan(10);

    if (loopMessages.length > 0) {
      console.error('🚨 Mensagens de loop detectadas:', loopMessages);
    }
    
    if (duplicateDetection.suspiciousCount > 0) {
      console.warn('⚠️  Requisições suspeitas detectadas:', duplicateDetection.examples);
    }
  });

  test('✅ TC003 - Estresse: Navegação rápida entre páginas', async ({ page }) => {
    console.log('\n🧪 Teste: Navegação Rápida - Detecção de Loop\n');

    const pages = ['/dashboard', '/agenda', '/contas', '/tarefas', '/relatorios'];
    const navigationRequests: Record<string, number> = {};

    for (const pagePath of pages) {
      supabaseRequests = [];
      
      await page.goto(pagePath);
      await page.waitForTimeout(2000);
      
      navigationRequests[pagePath] = supabaseRequests.length;
      console.log(`  ${pagePath}: ${supabaseRequests.length} requisições`);
    }

    // Verificar mensagens de loop após navegação intensa
    const loopMessages = consoleMessages.filter(msg => 
      msg.includes('LOOP INFINITO') || 
      msg.includes('Requisição bloqueada')
    );

    console.log(`\n📊 Resumo Navegação:`);
    console.log(`  - Páginas navegadas: ${pages.length}`);
    console.log(`  - Total de logs: ${consoleMessages.length}`);
    console.log(`  - Erros: ${errorMessages.length}`);
    console.log(`  - Mensagens de loop: ${loopMessages.length}`);

    // Verificações
    expect(loopMessages.length, 'Não deve haver loops durante navegação').toBe(0);
    expect(errorMessages.filter(e => e.includes('LOOP')).length).toBe(0);

    // Nenhuma página deve ter mais de 30 requisições em 2 segundos
    for (const [pagePath, count] of Object.entries(navigationRequests)) {
      expect(count, `${pagePath} deve ter requisições razoáveis`).toBeLessThan(30);
    }
  });

  test('✅ TC004 - Verificar logs do Supabase (usando MCP)', async ({ page }) => {
    console.log('\n🧪 Teste: Verificação de Logs do Supabase\n');

    // Navegar para agenda e fazer algumas ações
    await page.goto('/agenda');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Aqui faremos verificação dos logs via Supabase MCP
    console.log('📝 Logs coletados. Verificação via Supabase MCP será feita separadamente.');
    
    // Análise local de requisições
    const eventRequests = supabaseRequests.filter(r => r.url.includes('/events'));
    const calendarRequests = supabaseRequests.filter(r => r.url.includes('/calendars'));
    
    console.log(`\n📊 Análise de Requisições:`);
    console.log(`  - Eventos: ${eventRequests.length}`);
    console.log(`  - Calendários: ${calendarRequests.length}`);
    console.log(`  - Outras: ${supabaseRequests.length - eventRequests.length - calendarRequests.length}`);

    // Se houver mais de 20 requisições de eventos em 5 segundos, é suspeito
    expect(eventRequests.length, 'Requisições de eventos devem ser controladas').toBeLessThan(20);
  });
});

/**
 * Analisa requisições para detectar duplicatas suspeitas
 */
function analyzeDuplicateRequests(requests: Array<{ url: string; timestamp: number }>) {
  const suspicious: Array<{ url: string; count: number; timeWindow: number }> = [];
  let suspiciousCount = 0;

  // Agrupar requisições por URL
  const grouped = requests.reduce((acc, req) => {
    if (!acc[req.url]) acc[req.url] = [];
    acc[req.url].push(req.timestamp);
    return acc;
  }, {} as Record<string, number[]>);

  // Verificar cada grupo
  for (const [url, timestamps] of Object.entries(grouped)) {
    if (timestamps.length < 2) continue;

    // Ordenar timestamps
    timestamps.sort((a, b) => a - b);

    // Verificar janelas de tempo
    for (let i = 1; i < timestamps.length; i++) {
      const timeDiff = timestamps[i] - timestamps[i - 1];
      
      // Requisições idênticas em menos de 500ms são suspeitas
      if (timeDiff < 500) {
        suspiciousCount++;
        
        if (suspicious.length < 5) { // Apenas primeiros 5 exemplos
          suspicious.push({
            url: url.substring(0, 100), // Truncar URL
            count: 2,
            timeWindow: timeDiff,
          });
        }
      }
    }
  }

  return {
    suspiciousCount,
    examples: suspicious,
  };
}

