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
    const { phone, name, email, cpf, password } = await req.json();

    // Validate input
    if (!phone || !name || !password) {
      return new Response(
        JSON.stringify({ error: 'Telefone, nome e senha são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone format (10-15 digits)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'Formato de telefone inválido (apenas dígitos, 10-15 caracteres)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Senha deve ter no mínimo 8 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if cliente already exists
    const { data: existing } = await supabaseClient
      .from('clientes')
      .select('phone, password')
      .eq('phone', phone)
      .maybeSingle();

    if (existing) {
      // Se já tem senha, bloquear
      if (existing.password) {
        return new Response(
          JSON.stringify({ error: 'Telefone já cadastrado com senha. Use a tela de login.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Se NÃO tem senha, permitir definir senha (UPDATE em vez de INSERT)
      const passwordHash = await bcrypt.hash(password, 10);
      const { data: cliente, error: updateError } = await supabaseClient
        .from('clientes')
        .update({
          name,
          email: email || null,
          cpf: cpf || null,
          password: passwordHash,
          last_seen_at: new Date().toISOString(),
        })
        .eq('phone', phone)
        .select('phone, name, email, cpf, subscription_active, is_active')
        .single();
        
      if (updateError || !cliente) {
        return new Response(
          JSON.stringify({ error: 'Erro ao atualizar conta' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if user already has calendars, if not create default one
      const { data: existingCalendars } = await supabaseClient
        .from('calendars')
        .select('id')
        .eq('phone', cliente.phone)
        .limit(1);

      if (!existingCalendars || existingCalendars.length === 0) {
        // Create default calendar for existing user without calendars
        const { error: calendarError } = await supabaseClient
          .from('calendars')
          .insert({
            phone: cliente.phone,
            name: 'default',
            color: '#3b82f6',
            timezone: 'America/Sao_Paulo',
            is_primary: true,
          });

        if (calendarError) {
          console.error('Error creating default calendar for existing user:', calendarError);
          // Don't fail the signup if calendar creation fails
        }
      }
      
      return new Response(
        JSON.stringify({ cliente }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create cliente
    const { data: cliente, error: insertError } = await supabaseClient
      .from('clientes')
      .insert({
        phone,
        name,
        email: email || null,
        cpf: cpf || null,
        subscription_active: false,
        is_active: true,
        password: passwordHash,
        last_seen_at: new Date().toISOString(),
      })
      .select('phone, name, email, cpf, subscription_active, is_active')
      .single();

    if (insertError || !cliente) {
      return new Response(
        JSON.stringify({ error: 'Erro ao criar conta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create default calendar for new user
    const { error: calendarError } = await supabaseClient
      .from('calendars')
      .insert({
        phone: cliente.phone,
        name: 'default',
        color: '#3b82f6',
        timezone: 'America/Sao_Paulo',
        is_primary: true,
      });

    if (calendarError) {
      console.error('Error creating default calendar:', calendarError);
      // Don't fail the signup if calendar creation fails
    }

    return new Response(
      JSON.stringify({ cliente }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
