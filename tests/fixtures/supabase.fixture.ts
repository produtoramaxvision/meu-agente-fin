import { test as base } from '@playwright/test';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Credenciais de teste
export const TEST_USER = {
  phone: '5511949746110',
  password: '123456789',
  name: 'Usuário Teste',
  email: 'teste@meuagente.com.br'
};

type SupabaseFixture = {
  supabase: SupabaseClient;
};

// Extend base test with Supabase client
export const test = base.extend<SupabaseFixture>({
  supabase: async ({}, use) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    await use(supabase);
    
    // Cleanup após teste (se necessário)
    await supabase.auth.signOut();
  },
});

export { expect } from '@playwright/test';

