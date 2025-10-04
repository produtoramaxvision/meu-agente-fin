import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AvatarUpload } from '@/components/AvatarUpload';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string(),
  cpf: z.string().min(14, 'CPF é obrigatório e deve ter 14 caracteres.'),
});

export default function Profile() {
  const { cliente, updateAvatar, updateCliente } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: cliente?.name || '',
      email: cliente?.email || '',
      phone: cliente?.phone || '',
      cpf: cliente?.cpf || '',
    },
  });

  useEffect(() => {
    if (cliente) {
      form.reset({
        name: cliente.name,
        email: cliente.email || '',
        phone: cliente.phone,
        cpf: cliente.cpf || '',
      });
      setAvatarUrl(cliente.avatar_url || null);
    }
  }, [cliente, form]);

  const refreshUserData = async () => {
    if (!cliente) return;
    
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('phone, name, email, cpf, avatar_url, subscription_active, is_active')
        .eq('phone', cliente.phone)
        .single();

      if (!error && data) {
        // Update the form and avatar state
        form.reset({
          name: data.name,
          email: data.email || '',
          phone: data.phone,
          cpf: data.cpf || '',
        });
        setAvatarUrl(data.avatar_url || null);
        // Update the context
        updateCliente(data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!cliente) return;

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('clientes')
        .update({
          name: values.name,
          email: values.email || null,
          cpf: values.cpf || null,
        })
        .eq('phone', cliente.phone);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso!',
      });

      // Refresh user data without reloading the page
      await refreshUserData();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar perfil. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  if (!cliente) return null;

  return (
    <div className="py-4 sm:py-6 lg:py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent drop-shadow-sm">Perfil</h1>
        <p className="text-text-muted mt-2">
          Gerencie suas informações pessoais
        </p>
      </div>

          <div className="mx-auto max-w-4xl space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>
                  Adicione ou altere sua foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AvatarUpload
                  currentAvatarUrl={avatarUrl}
                  userPhone={cliente.phone}
                  userName={cliente.name}
                  onUploadComplete={async (url) => {
                    setAvatarUrl(url);
                    updateAvatar(url);
                    await refreshUserData();
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados cadastrais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="seu@email.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled 
                              className="bg-surface-2 cursor-not-allowed"
                            />
                          </FormControl>
                          <p className="text-sm text-text-muted">
                            O telefone não pode ser alterado
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="000.000.000-00"
                              maxLength={14}
                              onChange={(e) => field.onChange(formatCpf(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
    </div>
  );
}