import { Page, Locator } from '@playwright/test';

/**
 * Helpers para interagir com componentes Shadcn UI
 */

/**
 * Seleciona uma opção de um Select do Shadcn UI
 * @param page - Página do Playwright
 * @param triggerSelector - Seletor do trigger button
 * @param valueToSelect - Valor ou texto da opção a selecionar
 */
export async function selectShadcnOption(page: Page, triggerSelector: string, valueToSelect: string) {
  // Clicar no trigger para abrir o select
  await page.click(triggerSelector);
  
  // Aguardar o content aparecer
  await page.waitForSelector('[data-slot="select-content"]', { timeout: 5000 });
  
  // Clicar na opção desejada (por texto ou valor)
  await page.click(`[data-slot="select-item"]:has-text("${valueToSelect}")`);
}

/**
 * Seleciona uma opção de um SegmentedControl
 * @param page - Página do Playwright
 * @param label - Label da opção a selecionar
 */
export async function selectSegmentedControl(page: Page, label: string) {
  // SegmentedControl usa botões para as opções
  await page.click(`button:has-text("${label}")`);
}

/**
 * Preenche um CurrencyInput
 * @param page - Página do Playwright
 * @param selector - Seletor do input
 * @param value - Valor a preencher (pode ser número ou string)
 */
export async function fillCurrencyInput(page: Page, selector: string, value: string | number) {
  const valueStr = typeof value === 'number' ? value.toString() : value;
  await page.fill(selector, valueStr);
}

/**
 * Aguarda e clica em um elemento, tratando erros comuns
 * @param page - Página do Playwright
 * @param selector - Seletor do elemento
 * @param options - Opções de timeout e strict
 */
export async function clickSafe(page: Page, selector: string, options?: { timeout?: number, strict?: boolean }) {
  try {
    await page.click(selector, { timeout: options?.timeout || 5000 });
  } catch (error) {
    // Se falhar, tentar com .first()
    await page.locator(selector).first().click({ timeout: options?.timeout || 5000 });
  }
}

/**
 * Verifica se um tema está aplicado (dark/light)
 * Tenta body, html, ou qualquer elemento raiz
 */
export async function getTheme(page: Page): Promise<string | null> {
  // Tentar body primeiro
  let theme = await page.locator('body').getAttribute('class');
  if (theme && (theme.includes('dark') || theme.includes('light'))) {
    return theme;
  }
  
  // Tentar html
  theme = await page.locator('html').getAttribute('class');
  if (theme && (theme.includes('dark') || theme.includes('light'))) {
    return theme;
  }
  
  // Tentar data-theme
  theme = await page.locator('html').getAttribute('data-theme');
  if (theme) {
    return theme;
  }
  
  theme = await page.locator('body').getAttribute('data-theme');
  return theme;
}

