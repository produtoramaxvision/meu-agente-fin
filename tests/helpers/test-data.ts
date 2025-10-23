import { Page } from '@playwright/test';

export const BASE_URL = 'http://localhost:8080';

export const TEST_USER = {
  phone: '5511949746110',
  password: '123456789',
  name: 'Usuário Teste',
  email: 'teste@meuagente.com.br'
};

// Helper: Login multi-etapas com MÁXIMA precisão
export async function loginUser(page: Page, phone: string = TEST_USER.phone, password: string = TEST_USER.password) {
  await page.goto(`${BASE_URL}/auth/login`);
  
  // Etapa 1: Telefone
  await page.getByRole('textbox', { name: /telefone/i }).fill(phone);
  await page.getByRole('button', { name: /continuar/i }).click();
  
  // Aguardar etapa de senha
  await page.waitForSelector('#password', { state: 'visible', timeout: 15000 });
  
  // Etapa 2: Senha
  await page.getByRole('textbox', { name: /senha/i }).fill(password);
  await page.getByRole('button', { name: /entrar/i }).click();
  
  // Aguardar dashboard
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 20000 });
}

// Helper: Logout
export async function logoutUser(page: Page) {
  await page.getByRole('button', { name: /sair/i }).click();
  await page.waitForURL(`${BASE_URL}/auth/login`, { timeout: 10000 });
}

// Helper: Navegar para rota
export async function navigateTo(page: Page, route: string) {
  await page.click(`a[href="${route}"]`);
  await page.waitForURL(`${BASE_URL}${route}`, { timeout: 10000 });
}

// Helper: Aguardar toast aparecer
export async function waitForToast(page: Page, text: string | RegExp, timeout: number = 5000) {
  const toast = typeof text === 'string' 
    ? page.getByText(text).first()
    : page.locator(`text=${text}`).first();
  
  await toast.waitFor({ state: 'visible', timeout });
  return toast;
}

// Helper: Limpar cookies e storage
export async function clearAuth(page: Page) {
  await page.context().clearCookies();
  // Navegar para página primeiro para evitar erro de localStorage
  await page.goto(BASE_URL).catch(() => {});
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  }).catch(() => {
    // Ignorar erro se localStorage não disponível
  });
}

// Dados de teste para registros financeiros
export const FINANCIAL_RECORDS = {
  income: {
    tipo: 'entrada',
    valor: '1500.00',
    descricao: 'Salário Teste',
    categoria: 'Salário'
  },
  expense: {
    tipo: 'saida',
    valor: '350.50',
    descricao: 'Conta de Luz',
    categoria: 'Moradia'
  },
  duplicate: {
    tipo: 'saida',
    valor: '100.00',
    descricao: 'Teste Duplicata',
    categoria: 'Alimentação'
  }
};

// Payloads XSS para testes de segurança
export const XSS_PAYLOADS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  'javascript:alert("XSS")',
  '<svg/onload=alert("XSS")>',
  '"><script>alert(String.fromCharCode(88,83,83))</script>'
];

// SQL Injection payloads
export const SQL_INJECTION_PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "1' UNION SELECT NULL--",
  "admin'--",
  "' OR 1=1--"
];

