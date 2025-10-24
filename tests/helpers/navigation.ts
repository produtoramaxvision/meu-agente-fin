/**
 * Helper de Navegação para Testes
 * 
 * Funções auxiliares para navegação que consideram:
 * - Mobile: Menu hambúrguer que precisa ser aberto
 * - Desktop: Sidebar sempre visível
 */

import { Page } from '@playwright/test';

/**
 * Verifica se está em modo mobile baseado no viewport
 */
export function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < 768 : false;
}

/**
 * Abre o menu mobile (hambúrguer) se necessário
 */
export async function openMobileMenuIfNeeded(page: Page): Promise<void> {
  if (isMobileViewport(page)) {
    // Verificar se o menu já está aberto
    const menuOpen = await page.locator('[aria-label="Fechar menu"]').isVisible().catch(() => false);
    
    if (!menuOpen) {
      // Clicar no botão de menu hambúrguer
      await page.click('button[aria-label="Abrir menu"]');
      
      // Esperar o menu abrir (animação de slide)
      await page.waitForTimeout(400);
      
      // Verificar se a sidebar mobile está visível
      await page.waitForSelector('.fixed.left-0.top-0.h-full.w-64', { 
        state: 'visible',
        timeout: 5000 
      });
    }
  }
}

/**
 * Fecha o menu mobile se estiver aberto
 */
export async function closeMobileMenuIfNeeded(page: Page): Promise<void> {
  if (isMobileViewport(page)) {
    const menuOpen = await page.locator('button[aria-label="Fechar menu"]').isVisible().catch(() => false);
    
    if (menuOpen) {
      // Clicar no X para fechar
      await page.click('button[aria-label="Fechar menu"]');
      await page.waitForTimeout(400);
    }
  }
}

/**
 * Navega para uma página específica, lidando com mobile/desktop
 * 
 * @param page - Instância do Playwright Page
 * @param href - Caminho da rota (ex: '/contas', '/dashboard')
 * @param options - Opções adicionais
 */
export async function navigateToPage(
  page: Page, 
  href: string,
  options: {
    waitForLoad?: boolean;
    closeMenuAfter?: boolean;
  } = {}
): Promise<void> {
  const { waitForLoad = true, closeMenuAfter = true } = options;
  
  // 1. Abrir menu mobile se necessário
  await openMobileMenuIfNeeded(page);
  
  // 2. Esperar um pouco para garantir que o menu está pronto
  await page.waitForTimeout(200);
  
  // 3. Clicar no link de navegação usando selector engine 'visible=true'
  // Isso garante clicar apenas no link VISÍVEL (mobile OU desktop)
  const linkSelector = `a[href="${href}"]`;
  
  try {
    // ✅ CORREÇÃO DEFINITIVA: Usar seletor visible=true do Playwright
    // Isso automaticamente filtra apenas elementos visíveis
    await page.locator(`${linkSelector} >> visible=true`).first().click({ timeout: 10000 });
    
  } catch (error) {
    console.error(`Erro ao clicar no link ${href}:`, error);
    throw error;
  }
  
  // 4. Esperar navegação
  if (waitForLoad) {
    await page.waitForURL(`**${href}`, { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  }
  
  // 5. Fechar menu mobile se solicitado (default: sim)
  if (closeMenuAfter && isMobileViewport(page)) {
    await page.waitForTimeout(300);
    // O menu geralmente fecha automaticamente após clicar, mas podemos forçar
  }
}

/**
 * Navega para o Dashboard
 */
export async function goToDashboard(page: Page): Promise<void> {
  await navigateToPage(page, '/dashboard');
}

/**
 * Navega para Contas (Financeiro)
 */
export async function goToContas(page: Page): Promise<void> {
  await navigateToPage(page, '/contas');
}

/**
 * Navega para Tarefas
 */
export async function goToTarefas(page: Page): Promise<void> {
  await navigateToPage(page, '/tarefas');
}

/**
 * Navega para Agenda
 */
export async function goToAgenda(page: Page): Promise<void> {
  await navigateToPage(page, '/agenda');
}

/**
 * Navega para Metas
 */
export async function goToMetas(page: Page): Promise<void> {
  await navigateToPage(page, '/metas');
}

/**
 * Navega para Relatórios
 */
export async function goToRelatorios(page: Page): Promise<void> {
  await navigateToPage(page, '/relatorios');
}

/**
 * Navega para Perfil
 */
export async function goToPerfil(page: Page): Promise<void> {
  await navigateToPage(page, '/perfil');
}

/**
 * Clica em um botão ou elemento considerando mobile/desktop
 */
export async function clickElement(
  page: Page,
  selector: string,
  options: {
    role?: 'button' | 'link';
    name?: string | RegExp;
    exact?: boolean;
  } = {}
): Promise<void> {
  const { role, name, exact = false } = options;
  
  let element;
  
  if (role && name) {
    // Usar getByRole (mais semântico e acessível)
    element = page.getByRole(role, { name, exact });
  } else {
    element = page.locator(selector);
  }
  
  // Esperar elemento estar visível e clicável
  await element.waitFor({ state: 'visible', timeout: 10000 });
  await element.click();
}

/**
 * Busca por texto na página de forma robusta
 */
export async function findTextOnPage(
  page: Page,
  text: string | RegExp,
  options: {
    exact?: boolean;
    timeout?: number;
  } = {}
): Promise<boolean> {
  const { exact = false, timeout = 5000 } = options;
  
  try {
    if (typeof text === 'string') {
      const selector = exact 
        ? `text="${text}"`
        : `text=${text}`;
      await page.waitForSelector(selector, { timeout });
    } else {
      await page.getByText(text).waitFor({ state: 'visible', timeout });
    }
    return true;
  } catch {
    return false;
  }
}

