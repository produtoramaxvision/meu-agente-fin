import { Page } from '@playwright/test';

export const TEST_USER = {
  phone: '5511949746110',
  password: '123456789'
};

export const BASE_URL = 'http://localhost:8080';

/**
 * Helper para realizar login multi-etapas no sistema
 * Etapa 1: Inserir telefone e submeter
 * Etapa 2: Inserir senha e submeter
 * Resultado: Redireciona para /dashboard
 */
export async function login(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/auth/login`);
  
  // Etapa 1: Preencher telefone
  await page.fill('#phone', TEST_USER.phone);
  await page.click('button[type="submit"]');
  
  // Aguardar etapa de senha aparecer
  await page.waitForSelector('#password', { timeout: 15000 });
  
  // Etapa 2: Preencher senha
  await page.fill('#password', TEST_USER.password);
  await page.click('button[type="submit"]');
  
  // Aguardar redirecionamento para dashboard
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 20000 });
}

