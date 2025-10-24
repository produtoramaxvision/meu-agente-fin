import { Page } from '@playwright/test';
import { BASE_URL } from './login';

/**
 * Helper para navegação que funciona tanto em desktop quanto mobile
 * Em mobile, abre o menu hambúrguer antes de clicar no link
 */
export async function navigateToPage(page: Page, path: string): Promise<void> {
  const viewport = page.viewportSize();
  const isMobile = viewport ? viewport.width < 768 : false;

  if (isMobile) {
    // Em mobile, abrir menu hambúrguer primeiro
    const hamburgerButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button:has(svg.lucide-menu), button.mobile-menu-trigger');
    
    try {
      // Verificar se o menu hambúrguer existe e está visível
      await hamburgerButton.first().waitFor({ state: 'visible', timeout: 5000 });
      await hamburgerButton.first().click();
      
      // Aguardar o menu abrir
      await page.waitForTimeout(500);
    } catch (error) {
      console.log('⚠️  Menu hambúrguer não encontrado, tentando navegação direta...');
    }
  }

  // Clicar no link de navegação
  const link = page.locator(`a[href="${path}"]`).first();
  await link.waitFor({ state: 'visible', timeout: 10000 });
  await link.click();

  // Aguardar navegação completar
  await page.waitForURL(`${BASE_URL}${path}`, { timeout: 15000 });
  
  // Aguardar estado de rede idle
  await page.waitForLoadState('networkidle', { timeout: 10000 });
}

/**
 * Abre o menu hambúrguer em mobile (se existir)
 */
export async function openMobileMenu(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  const isMobile = viewport ? viewport.width < 768 : false;

  if (!isMobile) {
    return false;
  }

  try {
    const hamburgerButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button:has(svg.lucide-menu), button.mobile-menu-trigger');
    await hamburgerButton.first().waitFor({ state: 'visible', timeout: 5000 });
    await hamburgerButton.first().click();
    await page.waitForTimeout(500);
    return true;
  } catch (error) {
    console.log('⚠️  Menu hambúrguer não encontrado');
    return false;
  }
}

/**
 * Fecha o menu hambúrguer em mobile (se estiver aberto)
 */
export async function closeMobileMenu(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  const isMobile = viewport ? viewport.width < 768 : false;

  if (!isMobile) {
    return;
  }

  try {
    // Procurar botão de fechar (X ou Close)
    const closeButton = page.locator('button[aria-label*="close" i], button[aria-label*="fechar" i], button:has(svg.lucide-x)');
    
    const isVisible = await closeButton.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      await closeButton.first().click();
      await page.waitForTimeout(300);
    }
  } catch (error) {
    // Ignorar se não encontrar botão de fechar
  }
}

/**
 * Detecta se está em modo mobile
 */
export function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < 768 : false;
}

