import { test, expect } from '@playwright/test';
import { login, BASE_URL } from './helpers/login';
import { goToAgenda } from './helpers/navigation';

test.describe('Monitoramento Agenda - Loop Infinito e Performance', () => {
  
  test('TC001: Verificar se há loop infinito na página Agenda', async ({ page }) => {
    // Arrays para monitorar atividade
    const consoleLogs: string[] = [];
    const consoleWarnings: string[] = [];
    const consoleErrors: string[] = [];
    const networkRequests: Map<string, number> = new Map();
    
    // Monitorar console
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      
      if (type === 'log') consoleLogs.push(text);
      if (type === 'warning') consoleWarnings.push(text);
      if (type === 'error') consoleErrors.push(text);
    });
    
    // Monitorar requisições de rede
    page.on('request', request => {
      const url = request.url();
      
      // Contar requisições Supabase
      if (url.includes('supabase.co')) {
        const endpoint = url.split('?')[0]; // Remover query params
        const count = networkRequests.get(endpoint) || 0;
        networkRequests.set(endpoint, count + 1);
      }
    });
    
    // Fazer login e navegar para Agenda
    await login(page);
    
    console.log('\n🔍 NAVEGANDO PARA AGENDA...\n');
    await goToAgenda(page);
    
    // Aguardar 10 segundos para monitorar comportamento
    console.log('⏱️ Monitorando por 10 segundos...\n');
    await page.waitForTimeout(10000);
    
    // ANÁLISE 1: Verificar console errors
    console.log('📋 === CONSOLE ERRORS ===');
    if (consoleErrors.length === 0) {
      console.log('✅ Nenhum erro no console');
    } else {
      console.log(`❌ ${consoleErrors.length} erros encontrados:`);
      consoleErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
      });
    }
    
    // ANÁLISE 2: Verificar warnings
    console.log('\n⚠️ === CONSOLE WARNINGS ===');
    if (consoleWarnings.length === 0) {
      console.log('✅ Nenhum warning no console');
    } else {
      console.log(`⚠️ ${consoleWarnings.length} warnings encontrados:`);
      consoleWarnings.slice(0, 10).forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn}`);
      });
    }
    
    // ANÁLISE 3: Verificar requisições excessivas (possível loop)
    console.log('\n🌐 === REQUISIÇÕES SUPABASE ===');
    let hasExcessiveRequests = false;
    
    networkRequests.forEach((count, endpoint) => {
      const shortEndpoint = endpoint.split('/').slice(-2).join('/');
      console.log(`  ${shortEndpoint}: ${count}x`);
      
      // ⚠️ ALERTA: Mais de 5 requisições para o mesmo endpoint em 10s = possível loop
      if (count > 5) {
        console.log(`    ⚠️ ATENÇÃO: ${count} requisições para mesmo endpoint!`);
        hasExcessiveRequests = true;
      }
    });
    
    // ANÁLISE 4: Verificar total de requisições
    const totalRequests = Array.from(networkRequests.values()).reduce((a, b) => a + b, 0);
    console.log(`\n📊 Total de requisições Supabase: ${totalRequests}`);
    
    if (totalRequests > 50) {
      console.log(`  ⚠️ ATENÇÃO: ${totalRequests} requisições em 10s = ${totalRequests / 10}/s`);
      console.log(`  💡 Possível loop infinito ou refetch excessivo`);
    } else {
      console.log(`  ✅ Número de requisições aceitável (${totalRequests / 10}/s)`);
    }
    
    // ANÁLISE 5: Verificar logs relacionados a refetch/query
    console.log('\n🔄 === LOGS DE REFETCH/QUERY ===');
    const refetchLogs = consoleLogs.filter(log => 
      log.includes('refetch') || 
      log.includes('query') || 
      log.includes('invalidate') ||
      log.includes('stale')
    );
    
    if (refetchLogs.length > 0) {
      console.log(`  ${refetchLogs.length} logs de refetch/query:`);
      refetchLogs.slice(0, 10).forEach((log, i) => {
        console.log(`    ${i + 1}. ${log.substring(0, 100)}`);
      });
    } else {
      console.log('  ℹ️ Nenhum log de refetch detectado');
    }
    
    // ANÁLISE 6: Verificar se página carregou corretamente
    console.log('\n✅ === VALIDAÇÃO DA PÁGINA ===');
    
    // Verificar se título "Agenda" está presente
    const hasAgendaHeading = await page.getByRole('heading', { name: /agenda/i }).isVisible();
    console.log(`  Título "Agenda": ${hasAgendaHeading ? '✅ Visível' : '❌ Não encontrado'}`);
    
    // Verificar se calendário está carregado
    const hasCalendar = await page.locator('[class*="rbc-calendar"]').isVisible().catch(() => false);
    console.log(`  Calendário: ${hasCalendar ? '✅ Carregado' : '❌ Não carregado'}`);
    
    // RESULTADO FINAL
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTADO FINAL');
    console.log('='.repeat(60));
    
    const issues: string[] = [];
    
    if (consoleErrors.length > 0) {
      issues.push(`${consoleErrors.length} erros no console`);
    }
    
    if (hasExcessiveRequests) {
      issues.push('Requisições excessivas detectadas');
    }
    
    if (totalRequests > 50) {
      issues.push(`${totalRequests} requisições em 10s (>${totalRequests / 10}/s)`);
    }
    
    if (!hasAgendaHeading || !hasCalendar) {
      issues.push('Página não carregou corretamente');
    }
    
    if (issues.length === 0) {
      console.log('✅ TUDO OK! Nenhum problema detectado.');
      console.log('✅ Sem loop infinito');
      console.log('✅ Performance aceitável');
      console.log('✅ Página carregada corretamente');
    } else {
      console.log('❌ PROBLEMAS DETECTADOS:');
      issues.forEach(issue => {
        console.log(`  ❌ ${issue}`);
      });
    }
    console.log('='.repeat(60) + '\n');
    
    // ASSERTIONS
    expect(consoleErrors.length).toBeLessThan(5); // Aceitar até 4 erros
    expect(totalRequests).toBeLessThan(100); // Máximo 100 requisições em 10s
    expect(hasAgendaHeading).toBeTruthy();
  });
  
  test('TC002: Verificar logs Supabase-MCP durante uso da Agenda', async ({ page }) => {
    console.log('\n🔍 === TESTE SUPABASE-MCP LOGS ===\n');
    
    const supabaseQueries: Array<{ endpoint: string; method: string; time: number }> = [];
    let startTime = Date.now();
    
    // Interceptar requisições Supabase
    page.on('request', request => {
      const url = request.url();
      if (url.includes('supabase.co')) {
        supabaseQueries.push({
          endpoint: url.split('/').slice(-2).join('/').split('?')[0],
          method: request.method(),
          time: Date.now() - startTime
        });
      }
    });
    
    await login(page);
    startTime = Date.now(); // Reset timer
    
    console.log('⏱️ Navegando para Agenda...');
    await goToAgenda(page);
    
    console.log('⏱️ Aguardando carregamento inicial (5s)...');
    await page.waitForTimeout(5000);
    
    console.log('⏱️ Interagindo com calendário (mudando vista)...');
    // Tentar mudar para vista mensal (se existir botão)
    const monthButton = page.locator('button').filter({ hasText: /mês|month/i }).first();
    if (await monthButton.isVisible().catch(() => false)) {
      await monthButton.click();
      await page.waitForTimeout(2000);
    }
    
    console.log('\n📊 === ANÁLISE DE QUERIES SUPABASE ===\n');
    
    // Agrupar por endpoint
    const queryGroups = supabaseQueries.reduce((acc, query) => {
      const key = `${query.method} ${query.endpoint}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(query.time);
      return acc;
    }, {} as Record<string, number[]>);
    
    console.log(`Total de queries: ${supabaseQueries.length}\n`);
    
    Object.entries(queryGroups).forEach(([key, times]) => {
      console.log(`${key}:`);
      console.log(`  Quantidade: ${times.length}x`);
      console.log(`  Tempos: ${times.join('ms, ')}ms`);
      
      if (times.length > 3) {
        console.log(`  ⚠️ ATENÇÃO: Query repetida ${times.length} vezes!`);
      }
    });
    
    // Verificar se há padrão de loop (mesma query repetida rapidamente)
    const rapidQueries = Object.entries(queryGroups).filter(([_, times]) => {
      if (times.length < 3) return false;
      // Verificar se houve 3+ queries em menos de 1 segundo
      const sortedTimes = times.sort((a, b) => a - b);
      return sortedTimes[2] - sortedTimes[0] < 1000;
    });
    
    if (rapidQueries.length > 0) {
      console.log('\n⚠️ LOOP DETECTADO:');
      rapidQueries.forEach(([key, times]) => {
        console.log(`  ${key}: ${times.length} queries em ${Math.max(...times) - Math.min(...times)}ms`);
      });
    } else {
      console.log('\n✅ Nenhum loop infinito detectado!');
    }
    
    expect(rapidQueries.length).toBe(0); // Não deve haver loops
  });
});

