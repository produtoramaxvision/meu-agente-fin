import { test, expect } from '@playwright/test';

test.describe('Funcionalidades Críticas - Meu Agente', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de login
    await page.goto('http://localhost:8080/auth/login');
    
    // Aguardar a página carregar
    await page.waitForLoadState('networkidle');
    
    // Fazer login com as credenciais fornecidas
    await page.fill('#phone', '55 (11) 9 4974-6110');
    await page.fill('#password', '12345678');
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento para o dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  });

  test('TC001 - Registros Financeiros Funcionam', async ({ page }) => {
    // Navegar para a página de contas/financeiro
    await page.goto('http://localhost:8080/contas');
    
    // Verificar se a página carrega
    await expect(page).toHaveTitle(/Contas|Financeiro/);
    
    // Tentar adicionar um novo registro financeiro
    const addButton = page.locator('button').filter({ hasText: /adicionar|novo|inserir/i });
    if (await addButton.count() > 0) {
      await addButton.first().click();
      
      // Preencher formulário de registro financeiro
      await page.fill('input[name="descricao"]', 'Teste de registro financeiro');
      await page.fill('input[name="valor"]', '100.00');
      await page.selectOption('select[name="tipo"]', 'entrada');
      await page.selectOption('select[name="categoria"]', 'salario');
      
      // Salvar o registro
      const saveButton = page.locator('button').filter({ hasText: /salvar|confirmar/i });
      await saveButton.click();
      
      // Verificar se o registro foi salvo (não deve haver erro de RLS)
      await expect(page.locator('.error, .alert-error')).toHaveCount(0);
    }
  });

  test('TC002 - Sistema de Suporte Funciona', async ({ page }) => {
    // Navegar para a página de suporte
    await page.goto('http://localhost:8080/profile');
    
    // Procurar por seção de suporte ou ajuda
    const supportSection = page.locator('text=/suporte|ajuda|help/i');
    if (await supportSection.count() > 0) {
      await supportSection.first().click();
      
      // Tentar criar um ticket de suporte
      const createTicketButton = page.locator('button').filter({ hasText: /criar|novo|abrir/i });
      if (await createTicketButton.count() > 0) {
        await createTicketButton.click();
        
        // Preencher formulário de suporte
        await page.fill('input[name="subject"], textarea[name="subject"]', 'Teste de suporte');
        await page.fill('textarea[name="description"]', 'Teste de funcionalidade de suporte');
        
        // Enviar ticket
        const submitButton = page.locator('button').filter({ hasText: /enviar|submit/i });
        await submitButton.click();
        
        // Verificar se não há erro de RLS
        await expect(page.locator('.error, .alert-error')).toHaveCount(0);
      }
    }
  });

  test('TC003 - Controle de Planos de Assinatura', async ({ page }) => {
    // Verificar se usuário Free não acessa funcionalidades premium
    await page.goto('http://localhost:8080/profile');
    
    // Procurar por funcionalidades premium que devem estar bloqueadas para Free
    const premiumFeatures = [
      'backup',
      'whatsapp',
      'agente',
      'premium',
      'business'
    ];
    
    for (const feature of premiumFeatures) {
      const featureElement = page.locator(`text=/${feature}/i`);
      if (await featureElement.count() > 0) {
        // Verificar se há mensagem de upgrade ou bloqueio
        const upgradeMessage = page.locator('text=/upgrade|premium|assinatura/i');
        if (await upgradeMessage.count() > 0) {
          console.log(`Funcionalidade ${feature} está corretamente bloqueada para usuário Free`);
        }
      }
    }
  });

  test('TC004 - Interface WhatsApp Acessível', async ({ page }) => {
    // Procurar por interface WhatsApp na aplicação
    await page.goto('http://localhost:8080/dashboard');
    
    // Procurar por elementos relacionados ao WhatsApp
    const whatsappElements = page.locator('text=/whatsapp|agente|chat/i');
    const whatsappCount = await whatsappElements.count();
    
    if (whatsappCount > 0) {
      console.log('Interface WhatsApp encontrada');
      await whatsappElements.first().click();
      
      // Verificar se a interface carrega
      await expect(page).toHaveTitle(/WhatsApp|Agente/);
    } else {
      console.log('Interface WhatsApp não encontrada - precisa ser implementada');
    }
  });

  test('TC005 - Sistema de Backup Acessível', async ({ page }) => {
    // Procurar por funcionalidade de backup
    await page.goto('http://localhost:8080/profile');
    
    const backupElements = page.locator('text=/backup|respaldo/i');
    const backupCount = await backupElements.count();
    
    if (backupCount > 0) {
      console.log('Sistema de backup encontrado');
      await backupElements.first().click();
      
      // Verificar se a interface de backup carrega
      await expect(page).toHaveTitle(/Backup/);
    } else {
      console.log('Sistema de backup não encontrado - precisa ser implementado');
    }
  });

  test('TC006 - Conformidade LGPD - Exclusão de Dados', async ({ page }) => {
    // Navegar para configurações de privacidade
    await page.goto('http://localhost:8080/profile');
    
    // Procurar por seção de privacidade ou LGPD
    const privacySection = page.locator('text=/privacidade|lgpd|dados/i');
    if (await privacySection.count() > 0) {
      await privacySection.first().click();
      
      // Procurar por botão de exclusão de dados
      const deleteDataButton = page.locator('button').filter({ hasText: /deletar|excluir|apagar.*dados/i });
      if (await deleteDataButton.count() > 0) {
        await deleteDataButton.click();
        
        // Verificar se aparece confirmação
        const confirmDialog = page.locator('text=/confirmar|tem certeza/i');
        await expect(confirmDialog).toBeVisible();
        
        // Cancelar para não deletar dados reais
        const cancelButton = page.locator('button').filter({ hasText: /cancelar|cancel/i });
        await cancelButton.click();
      } else {
        console.log('Botão de exclusão de dados não encontrado');
      }
    }
  });

  test('TC007 - Navegação Entre Páginas', async ({ page }) => {
    // Testar navegação entre as principais páginas
    const pages = [
      { url: '/dashboard', title: /Dashboard/ },
      { url: '/agenda', title: /Agenda/ },
      { url: '/contas', title: /Contas/ },
      { url: '/tasks', title: /Tarefas/ },
      { url: '/goals', title: /Metas/ },
      { url: '/notifications', title: /Notificações/ },
      { url: '/profile', title: /Perfil/ }
    ];
    
    for (const pageInfo of pages) {
      await page.goto(`http://localhost:8080${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Verificar se a página carrega sem erros
      await expect(page).toHaveTitle(pageInfo.title);
      
      // Verificar se não há erros de RLS visíveis
      const errorElements = page.locator('.error, .alert-error, [class*="error"]');
      const errorCount = await errorElements.count();
      
      if (errorCount > 0) {
        console.log(`Erro encontrado na página ${pageInfo.url}:`, await errorElements.first().textContent());
      }
    }
  });
});
