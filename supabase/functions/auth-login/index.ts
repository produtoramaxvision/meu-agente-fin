import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import bcrypt from 'npm:bcryptjs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phone, password } = await req.json();

    // Validate input
    if (!phone || !password) {
      return new Response(
        JSON.stringify({ error: 'Telefone e senha são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone format (10-15 digits)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'Formato de telefone inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch cliente by phone
    const { data: cliente, error: fetchError } = await supabaseClient
      .from('clientes')
      .select('phone, name, email, cpf, avatar_url, subscription_active, is_active, password, plan_id')
      .eq('phone', phone)
      .eq('is_active', true)
      .single();

    if (fetchError || !cliente) {
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get password hash
    const passwordHash = cliente.password;
    if (!passwordHash) {
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Compare password
    const isValid = await bcrypt.compare(password, passwordHash);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last_seen_at
    await supabaseClient
      .from('clientes')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('phone', phone);

    // Return cliente data (without password hash)
    return new Response(
      JSON.stringify({
        cliente: {
          phone: cliente.phone,
          name: cliente.name,
          email: cliente.email,
          cpf: cliente.cpf,
          avatar_url: cliente.avatar_url,
          subscription_active: cliente.subscription_active,
          is_active: cliente.is_active,
          plan_id: cliente.plan_id,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
