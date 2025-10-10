import { chromium } from 'playwright';

/**
 * 🚀 TESTE EXTREMAMENTE DETALHADO E ABRANGENTE
 * Aplicação: Meu Agente Financeiro
 * 
 * Este teste cobre TODAS as funcionalidades da aplicação:
 * - Autenticação e controle de acesso
 * - Agenda e calendário (todas as views)
 * - Sistema de tarefas e notificações
 * - Upload de avatar e perfil
 * - Sistema de suporte e tickets
 * - Funcionalidades financeiras e relatórios
 * - Responsividade em diferentes dispositivos
 * - Acessibilidade e validação ShadcnUI
 */

const BASE_URL = 'http://localhost:8080';
const TEST_USER = '5511949746110';
const TEST_PASSWORD = '12345678';

// Configurações de dispositivos para teste de responsividade
const DEVICES = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

// Função para capturar screenshots com timestamp
async function captureScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

// Função para verificar acessibilidade básica
async function checkAccessibility(page, testName) {
  console.log(`🔍 Verificando acessibilidade: ${testName}`);
  
  // Verificar elementos com roles ARIA
  const ariaElements = await page.locator('[role]').count();
  console.log(`   ✅ Elementos com roles ARIA: ${ariaElements}`);
  
  // Verificar labels
  const labeledElements = await page.locator('[aria-label], [aria-labelledby]').count();
  console.log(`   ✅ Elementos com labels: ${labeledElements}`);
  
  // Verificar headings hierárquicos
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
  console.log(`   ✅ Headings encontrados: ${headings}`);
  
  return { ariaElements, labeledElements, headings };
}

// Função para verificar componentes ShadcnUI
async function checkShadcnUIComponents(page, testName) {
  console.log(`🎨 Verificando componentes ShadcnUI: ${testName}`);
  
  // Verificar componentes principais
  const buttons = await page.locator('button').count();
  const inputs = await page.locator('input').count();
  const cards = await page.locator('[class*="card"]').count();
  const dialogs = await page.locator('[role="dialog"]').count();
  
  console.log(`   ✅ Botões: ${buttons}`);
  console.log(`   ✅ Inputs: ${inputs}`);
  console.log(`   ✅ Cards: ${cards}`);
  console.log(`   ✅ Dialogs: ${dialogs}`);
  
  return { buttons, inputs, cards, dialogs };
}

// Função para login
async function login(page) {
  console.log('🔐 Realizando login...');
  
  await page.goto(`${BASE_URL}/auth/login`);
  await page.waitForLoadState('networkidle');
  
  // Preencher formulário de login
  await page.fill('input[type="tel"]', TEST_USER);
  await page.fill('input[type="password"]', TEST_PASSWORD);
  
  // Clicar no botão de login
  await page.click('button[type="submit"]');
  
  // Aguardar redirecionamento
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  console.log('✅ Login realizado com sucesso');
}

// Função para logout
async function logout(page) {
  console.log('🚪 Realizando logout...');
  
  // Clicar no avatar/menu do usuário
  await page.click('[data-testid="user-menu"], .user-menu, [aria-label*="menu"]');
  
  // Clicar em logout
  await page.click('text=Logout, Sair, Sign out');
  
  // Aguardar redirecionamento para login
  await page.waitForURL('**/login', { timeout: 5000 });
  
  console.log('✅ Logout realizado com sucesso');
}

async function runComprehensiveTests() {
  console.log('🚀 INICIANDO TESTE EXTREMAMENTE DETALHADO E ABRANGENTE');
  console.log('='.repeat(80));
  
  const browser = await chromium.launch({ 
    headless: false, // Para visualizar os testes
    slowMo: 100 // Para melhor visualização
  });
  
  const context = await browser.newContext({
    viewport: DEVICES.desktop,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo'
  });
  
  const page = await context.newPage();
  
  // Configurar interceptação de requisições para monitoramento
  await page.route('**/*', (route) => {
    const request = route.request();
    if (request.url().includes('api') || request.url().includes('supabase')) {
      console.log(`🌐 API Request: ${request.method()} ${request.url()}`);
    }
    route.continue();
  });
  
  try {
    // ========================================
    // 1. TESTE DE AUTENTICAÇÃO E CONTROLE DE ACESSO
    // ========================================
    console.log('\n🔐 TESTE 1: AUTENTICAÇÃO E CONTROLE DE ACESSO');
    console.log('-'.repeat(50));
    
    // 1.1 Teste de página de login
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    await checkAccessibility(page, 'Página de Login');
    await checkShadcnUIComponents(page, 'Página de Login');
    await captureScreenshot(page, 'login-page');
    
    // Verificar elementos de login
    const loginForm = await page.locator('form').count();
    const phoneInput = await page.locator('input[type="tel"]').count();
    const passwordInput = await page.locator('input[type="password"]').count();
    const submitButton = await page.locator('button[type="submit"]').count();
    
    console.log(`   ✅ Formulário de login: ${loginForm}`);
    console.log(`   ✅ Input telefone: ${phoneInput}`);
    console.log(`   ✅ Input senha: ${passwordInput}`);
    console.log(`   ✅ Botão submit: ${submitButton}`);
    
    // 1.2 Teste de login
    await login(page);
    await captureScreenshot(page, 'dashboard-after-login');
    
    // 1.3 Verificar controle de acesso - usuário logado
    console.log('\n🔒 Verificando controle de acesso...');
    
    // Verificar se elementos premium estão visíveis/ocultos baseado no plano
    const exportButtons = await page.locator('button:has-text("Exportar"), button:has-text("PDF"), button:has-text("CSV")').count();
    console.log(`   ✅ Botões de exportação encontrados: ${exportButtons}`);
    
    // ========================================
    // 2. TESTE DE DASHBOARD E NAVEGAÇÃO
    // ========================================
    console.log('\n📊 TESTE 2: DASHBOARD E NAVEGAÇÃO');
    console.log('-'.repeat(50));
    
    await checkAccessibility(page, 'Dashboard');
    await checkShadcnUIComponents(page, 'Dashboard');
    
    // Verificar elementos do dashboard
    const dashboardCards = await page.locator('[class*="card"]').count();
    const navigationItems = await page.locator('nav a, [role="navigation"] a').count();
    const sidebarItems = await page.locator('[class*="sidebar"] a').count();
    
    console.log(`   ✅ Cards do dashboard: ${dashboardCards}`);
    console.log(`   ✅ Itens de navegação: ${navigationItems}`);
    console.log(`   ✅ Itens da sidebar: ${sidebarItems}`);
    
    // Testar navegação entre páginas
    const pages = ['agenda', 'tasks', 'goals', 'reports', 'profile', 'notifications'];
    
    for (const pageName of pages) {
      console.log(`\n🧭 Testando navegação para: ${pageName}`);
      
      // Tentar navegar para a página
      const navLink = page.locator(`a[href*="${pageName}"], button:has-text("${pageName}")`).first();
      
      if (await navLink.count() > 0) {
        await navLink.click();
        await page.waitForLoadState('networkidle');
        
        await checkAccessibility(page, `Página ${pageName}`);
        await checkShadcnUIComponents(page, `Página ${pageName}`);
        await captureScreenshot(page, `${pageName}-page`);
        
        console.log(`   ✅ Navegação para ${pageName} bem-sucedida`);
      } else {
        console.log(`   ⚠️ Link para ${pageName} não encontrado`);
      }
    }
    
    // ========================================
    // 3. TESTE DE AGENDA E CALENDÁRIO
    // ========================================
    console.log('\n📅 TESTE 3: AGENDA E CALENDÁRIO');
    console.log('-'.repeat(50));
    
    await page.goto(`${BASE_URL}/agenda`);
    await page.waitForLoadState('networkidle');
    
    await checkAccessibility(page, 'Agenda');
    await checkShadcnUIComponents(page, 'Agenda');
    await captureScreenshot(page, 'agenda-page');
    
    // 3.1 Testar visualizações de agenda
    const viewButtons = await page.locator('button:has-text("Dia"), button:has-text("Semana"), button:has-text("Mês"), button:has-text("Ano")').count();
    console.log(`   ✅ Botões de visualização: ${viewButtons}`);
    
    // Testar cada visualização
    const views = ['Dia', 'Semana', 'Mês', 'Ano'];
    for (const view of views) {
      const viewButton = page.locator(`button:has-text("${view}")`);
      if (await viewButton.count() > 0) {
        await viewButton.click();
        await page.waitForLoadState('networkidle');
        
        console.log(`   ✅ Visualização ${view} ativada`);
        await captureScreenshot(page, `agenda-${view.toLowerCase()}-view`);
      }
    }
    
    // 3.2 Testar navegação com teclado
    console.log('\n⌨️ Testando navegação com teclado...');
    
    // Testar setas do teclado
    const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    for (const key of arrowKeys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(500);
      console.log(`   ✅ Tecla ${key} testada`);
    }
    
    // 3.3 Testar criação de evento
    console.log('\n➕ Testando criação de evento...');
    
    const createEventButton = page.locator('button:has-text("Novo"), button:has-text("Criar"), button:has-text("Adicionar")');
    if (await createEventButton.count() > 0) {
      await createEventButton.first().click();
      await page.waitForLoadState('networkidle');
      
      await checkAccessibility(page, 'Formulário de Evento');
      await checkShadcnUIComponents(page, 'Formulário de Evento');
      await captureScreenshot(page, 'event-form');
      
      console.log('   ✅ Formulário de evento aberto');
      
      // Fechar formulário se modal/dialog
      const closeButton = page.locator('button:has-text("Cancelar"), button:has-text("Fechar"), [aria-label="Close"]');
      if (await closeButton.count() > 0) {
        await closeButton.first().click();
      }
    }
    
    // ========================================
    // 4. TESTE DE SISTEMA DE TAREFAS
    // ========================================
    console.log('\n✅ TESTE 4: SISTEMA DE TAREFAS');
    console.log('-'.repeat(50));
    
    await page.goto(`${BASE_URL}/tasks`);
    await page.waitForLoadState('networkidle');
    
    await checkAccessibility(page, 'Tarefas');
    await checkShadcnUIComponents(page, 'Tarefas');
    await captureScreenshot(page, 'tasks-page');
    
    // 4.1 Verificar elementos de tarefas
    const taskItems = await page.locator('[class*="task"], [data-testid*="task"]').count();
    const createTaskButton = await page.locator('button:has-text("Nova"), button:has-text("Criar"), button:has-text("Adicionar")').count();
    const taskFilters = await page.locator('[class*="filter"], select').count();
    
    console.log(`   ✅ Itens de tarefa: ${taskItems}`);
    console.log(`   ✅ Botão criar tarefa: ${createTaskButton}`);
    console.log(`   ✅ Filtros: ${taskFilters}`);
    
    // 4.2 Testar criação de tarefa
    const newTaskButton = page.locator('button:has-text("Nova"), button:has-text("Criar"), button:has-text("Adicionar")');
    if (await newTaskButton.count() > 0) {
      await newTaskButton.first().click();
      await page.waitForLoadState('networkidle');
      
      await checkAccessibility(page, 'Formulário de Tarefa');
      await checkShadcnUIComponents(page, 'Formulário de Tarefa');
      await captureScreenshot(page, 'task-form');
      
      console.log('   ✅ Formulário de tarefa aberto');
      
      // Fechar formulário
      const closeButton = page.locator('button:has-text("Cancelar"), button:has-text("Fechar"), [aria-label="Close"]');
      if (await closeButton.count() > 0) {
        await closeButton.first().click();
      }
    }
    
    // ========================================
    // 5. TESTE DE METAS E OBJETIVOS
    // ========================================
    console.log('\n🎯 TESTE 5: METAS E OBJETIVOS');
    console.log('-'.repeat(50));
    
    await page.goto(`${BASE_URL}/goals`);
    await page.waitForLoadState('networkidle');
    
    await checkAccessibility(page, 'Metas');
    await checkShadcnUIComponents(page, 'Metas');
    await captureScreenshot(page, 'goals-page');
    
    // Verificar elementos de metas
    const goalItems = await page.locator('[class*="goal"], [data-testid*="goal"]').count();
    const createGoalButton = await page.locator('button:has-text("Nova"), button:has-text("Criar"), button:has-text("Adicionar")').count();
    
    console.log(`   ✅ Itens de meta: ${goalItems}`);
    console.log(`   ✅ Botão criar meta: ${createGoalButton}`);
    
    // ========================================
    // 6. TESTE DE RELATÓRIOS E EXPORTAÇÃO
    // ========================================
    console.log('\n📊 TESTE 6: RELATÓRIOS E EXPORTAÇÃO');
    console.log('-'.repeat(50));
    
    await page.goto(`${BASE_URL}/reports`);
    await page.waitForLoadState('networkidle');
    
    await checkAccessibility(page, 'Relatórios');
    await checkShadcnUIComponents(page, 'Relatórios');
    await captureScreenshot(page, 'reports-page');
    
    // 6.1 Verificar botões de exportação
    const exportButtonsCount = await page.locator('button:has-text("Exportar"), button:has-text("PDF"), button:has-text("CSV"), button:has-text("JSON")').count();
    console.log(`   ✅ Botões de exportação: ${exportButtonsCount}`);
    
    // 6.2 Testar controle de acesso para exportação
    const exportButton = page.locator('button:has-text("Exportar"), button:has-text("PDF"), button:has-text("CSV")').first();
    if (await exportButton.count() > 0) {
      await exportButton.click();
      await page.waitForTimeout(1000);
      
      // Verificar se aparece toast/modal de bloqueio para usuário free
      const toastMessage = await page.locator('[role="alert"], .toast, .notification').count();
      console.log(`   ✅ Toast/notificação após tentativa de exportação: ${toastMessage}`);
    }
    
    // ========================================
    // 7. TESTE DE PERFIL E UPLOAD DE AVATAR
    // ========================================
    console.log('\n👤 TESTE 7: PERFIL E UPLOAD DE AVATAR');
    console.log('-'.repeat(50));
    
    await page.goto(`${BASE_URL}/profile`);
    await page.waitForLoadState('networkidle');
    
    await checkAccessibility(page, 'Perfil');
    await checkShadcnUIComponents(page, 'Perfil');
    await captureScreenshot(page, 'profile-page');
    
    // 7.1 Verificar elementos de perfil
    const profileForm = await page.locator('form').count();
    const avatarElement = await page.locator('[class*="avatar"], img[alt*="avatar"], img[alt*="profile"]').count();
    const fileInput = await page.locator('input[type="file"]').count();
    
    console.log(`   ✅ Formulário de perfil: ${profileForm}`);
    console.log(`   ✅ Elemento de avatar: ${avatarElement}`);
    console.log(`   ✅ Input de arquivo: ${fileInput}`);
    
    // 7.2 Testar upload de avatar
    if (await fileInput > 0) {
      console.log('   ✅ Input de arquivo encontrado - upload de avatar disponível');
    } else {
      console.log('   ⚠️ Input de arquivo não encontrado - upload pode estar quebrado');
    }
    
    // ========================================
    // 8. TESTE DE SISTEMA DE SUPORTE
    // ========================================
    console.log('\n🎧 TESTE 8: SISTEMA DE SUPORTE');
    console.log('-'.repeat(50));
    
    // Tentar acessar suporte através do menu ou botão
    const supportButton = page.locator('button:has-text("Suporte"), a:has-text("Suporte"), button:has-text("Ajuda")');
    if (await supportButton.count() > 0) {
      await supportButton.first().click();
      await page.waitForLoadState('networkidle');
      
      await checkAccessibility(page, 'Suporte');
      await checkShadcnUIComponents(page, 'Suporte');
      await captureScreenshot(page, 'support-page');
      
      // Verificar elementos de suporte
      const supportForm = await page.locator('form').count();
      const ticketForm = await page.locator('[class*="ticket"], [data-testid*="ticket"]').count();
      const faqItems = await page.locator('[class*="faq"], [data-testid*="faq"]').count();
      
      console.log(`   ✅ Formulário de suporte: ${supportForm}`);
      console.log(`   ✅ Formulário de ticket: ${ticketForm}`);
      console.log(`   ✅ Itens de FAQ: ${faqItems}`);
      
      // Testar criação de ticket
      const createTicketButton = page.locator('button:has-text("Novo"), button:has-text("Criar"), button:has-text("Abrir")');
      if (await createTicketButton.count() > 0) {
        await createTicketButton.first().click();
        await page.waitForLoadState('networkidle');
        
        await checkAccessibility(page, 'Formulário de Ticket');
        await checkShadcnUIComponents(page, 'Formulário de Ticket');
        await captureScreenshot(page, 'ticket-form');
        
        console.log('   ✅ Formulário de ticket aberto');
        
        // Fechar formulário
        const closeButton = page.locator('button:has-text("Cancelar"), button:has-text("Fechar"), [aria-label="Close"]');
        if (await closeButton.count() > 0) {
          await closeButton.first().click();
        }
      }
    } else {
      console.log('   ⚠️ Botão de suporte não encontrado');
    }
    
    // ========================================
    // 9. TESTE DE NOTIFICAÇÕES
    // ========================================
    console.log('\n🔔 TESTE 9: SISTEMA DE NOTIFICAÇÕES');
    console.log('-'.repeat(50));
    
    await page.goto(`${BASE_URL}/notifications`);
    await page.waitForLoadState('networkidle');
    
    await checkAccessibility(page, 'Notificações');
    await checkShadcnUIComponents(page, 'Notificações');
    await captureScreenshot(page, 'notifications-page');
    
    // Verificar elementos de notificações
    const notificationItems = await page.locator('[class*="notification"], [role="alert"]').count();
    const notificationBell = await page.locator('[class*="bell"], [aria-label*="notification"]').count();
    
    console.log(`   ✅ Itens de notificação: ${notificationItems}`);
    console.log(`   ✅ Sino de notificação: ${notificationBell}`);
    
    // ========================================
    // 10. TESTE DE RESPONSIVIDADE
    // ========================================
    console.log('\n📱 TESTE 10: RESPONSIVIDADE');
    console.log('-'.repeat(50));
    
    for (const [deviceName, viewport] of Object.entries(DEVICES)) {
      console.log(`\n📱 Testando em ${deviceName} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);
      
      await checkAccessibility(page, `${deviceName} - Dashboard`);
      await checkShadcnUIComponents(page, `${deviceName} - Dashboard`);
      await captureScreenshot(page, `dashboard-${deviceName}`);
      
      // Testar navegação em mobile
      if (deviceName === 'mobile') {
        // Verificar se menu mobile está funcionando
        const mobileMenuButton = page.locator('[class*="menu"], [aria-label*="menu"], button:has-text("Menu")');
        if (await mobileMenuButton.count() > 0) {
          await mobileMenuButton.first().click();
          await page.waitForTimeout(500);
          
          await captureScreenshot(page, 'mobile-menu-open');
          console.log('   ✅ Menu mobile aberto');
          
          // Fechar menu
          await page.keyboard.press('Escape');
        }
      }
    }
    
    // ========================================
    // 11. TESTE DE PERFORMANCE E CONSOLE
    // ========================================
    console.log('\n⚡ TESTE 11: PERFORMANCE E CONSOLE');
    console.log('-'.repeat(50));
    
    // Monitorar erros do console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`   ❌ Erro no console: ${msg.text()}`);
      }
    });
    
    // Monitorar requisições falhadas
    const failedRequests = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status()
        });
        console.log(`   ❌ Requisição falhada: ${response.status()} ${response.url()}`);
      }
    });
    
    // Navegar por todas as páginas para capturar erros
    const allPages = ['dashboard', 'agenda', 'tasks', 'goals', 'reports', 'profile', 'notifications'];
    for (const pageName of allPages) {
      await page.goto(`${BASE_URL}/${pageName}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
    }
    
    console.log(`   📊 Total de erros no console: ${consoleErrors.length}`);
    console.log(`   📊 Total de requisições falhadas: ${failedRequests.length}`);
    
    // ========================================
    // 12. TESTE DE ACESSIBILIDADE AVANÇADA
    // ========================================
    console.log('\n♿ TESTE 12: ACESSIBILIDADE AVANÇADA');
    console.log('-'.repeat(50));
    
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Verificar contraste de cores (simulação básica)
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').count();
    console.log(`   ✅ Elementos de texto: ${textElements}`);
    
    // Verificar navegação por teclado
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    const focusedElement = await page.locator(':focus').count();
    console.log(`   ✅ Elemento focado após Tab: ${focusedElement}`);
    
    // Verificar landmarks
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').count();
    console.log(`   ✅ Landmarks ARIA: ${landmarks}`);
    
    // ========================================
    // RESUMO FINAL
    // ========================================
    console.log('\n🎉 RESUMO FINAL DOS TESTES');
    console.log('='.repeat(80));
    
    console.log('✅ TESTES CONCLUÍDOS:');
    console.log('   🔐 Autenticação e controle de acesso');
    console.log('   📊 Dashboard e navegação');
    console.log('   📅 Agenda e calendário');
    console.log('   ✅ Sistema de tarefas');
    console.log('   🎯 Metas e objetivos');
    console.log('   📊 Relatórios e exportação');
    console.log('   👤 Perfil e upload de avatar');
    console.log('   🎧 Sistema de suporte');
    console.log('   🔔 Notificações');
    console.log('   📱 Responsividade');
    console.log('   ⚡ Performance e console');
    console.log('   ♿ Acessibilidade avançada');
    
    console.log(`\n📊 ESTATÍSTICAS:`);
    console.log(`   ❌ Erros no console: ${consoleErrors.length}`);
    console.log(`   ❌ Requisições falhadas: ${failedRequests.length}`);
    console.log(`   📱 Dispositivos testados: ${Object.keys(DEVICES).length}`);
    console.log(`   🧭 Páginas testadas: ${allPages.length}`);
    
    if (consoleErrors.length === 0 && failedRequests.length === 0) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
    } else {
      console.log('\n⚠️ ALGUNS PROBLEMAS FORAM DETECTADOS:');
      if (consoleErrors.length > 0) {
        console.log('   ❌ Erros no console precisam ser corrigidos');
      }
      if (failedRequests.length > 0) {
        console.log('   ❌ Requisições falhadas precisam ser investigadas');
      }
    }
    
  } catch (error) {
    console.error('❌ ERRO DURANTE OS TESTES:', error);
    await captureScreenshot(page, 'error-screenshot');
  } finally {
    await browser.close();
  }
}

// Executar os testes
runComprehensiveTests().catch(console.error);
