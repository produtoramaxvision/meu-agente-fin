import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Download, 
  Trash2, 
  CheckCircle, 
  FileText,
  User,
  Database,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PrivacySettings {
  dataCollection: boolean;
  dataProcessing: boolean;
  dataSharing: boolean;
  marketingEmails: boolean;
  analyticsTracking: boolean;
  cookieConsent: boolean;
  dataRetention: number;
  consentDate?: string;
  lastUpdated?: string;
}

export function PrivacySection() {
  const { cliente } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PrivacySettings>({
    dataCollection: true,
    dataProcessing: true,
    dataSharing: false,
    marketingEmails: false,
    analyticsTracking: true,
    cookieConsent: true,
    dataRetention: 365,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, [cliente]);

  const loadPrivacySettings = async () => {
    if (!cliente?.phone) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('phone', cliente.phone)
        .single();

      if (data) {
        setSettings({
          dataCollection: data.data_collection ?? true,
          dataProcessing: data.data_processing ?? true,
          dataSharing: data.data_sharing ?? false,
          marketingEmails: data.marketing_emails ?? false,
          analyticsTracking: data.analytics_tracking ?? true,
          cookieConsent: data.cookie_consent ?? true,
          dataRetention: data.data_retention ?? 365,
          consentDate: data.consent_date,
          lastUpdated: data.last_updated,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de privacidade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!cliente?.phone) return;
    
    setIsSaving(true);
    try {
      const settingsData = {
        phone: cliente.phone,
        data_collection: settings.dataCollection,
        data_processing: settings.dataProcessing,
        data_sharing: settings.dataSharing,
        marketing_emails: settings.marketingEmails,
        analytics_tracking: settings.analyticsTracking,
        cookie_consent: settings.cookieConsent,
        data_retention: settings.dataRetention,
        consent_date: settings.consentDate || new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('privacy_settings')
        .upsert(settingsData, { 
          onConflict: 'phone',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "Suas preferências de privacidade foram atualizadas com sucesso.",
      });

      setSettings(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
      }));

    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataExport = async () => {
    try {
      toast({
        title: "Exportando dados...",
        description: "Preparando arquivo com seus dados pessoais",
      });

      // Usar função do Supabase para exportação completa
      const { data, error } = await supabase.rpc('export_user_data', {
        user_phone: cliente?.phone
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erro na exportação');
      }

      const jsonContent = JSON.stringify(data.data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `meus_dados_pessoais_${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Dados exportados",
        description: "Seus dados pessoais foram baixados com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar seus dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDataDeletion = async () => {
    if (!confirm('ATENÇÃO: Esta ação irá deletar TODOS os seus dados permanentemente. Esta ação não pode ser desfeita. Tem certeza?')) {
      return;
    }

    if (!confirm('Confirmação final: Você tem certeza absoluta de que deseja deletar todos os seus dados?')) {
      return;
    }

    try {
      setIsSaving(true);
      
      // Usar função do Supabase para exclusão completa e segura
      const { data, error } = await supabase.rpc('delete_user_data', {
        user_phone: cliente?.phone
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erro na exclusão');
      }

      toast({
        title: "Dados deletados",
        description: `Todos os seus dados foram removidos permanentemente. Tabelas afetadas: ${data.deleted_tables.join(', ')}`,
      });

      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);

    } catch (error) {
      console.error('Erro ao deletar dados:', error);
      toast({
        title: "Erro na exclusão",
        description: "Não foi possível deletar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-600" />
            Configurações de Privacidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status de Conformidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Status de Conformidade LGPD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conforme
            </Badge>
            <span className="text-sm text-text-muted">
              Suas configurações estão em conformidade com a Lei Geral de Proteção de Dados
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Consentimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-600" />
            Consentimento e Preferências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dataCollection" className="text-sm font-medium">
                  Coleta de Dados
                </Label>
                <p className="text-xs text-text-muted">
                  Permitir coleta de dados pessoais para funcionalidades do sistema
                </p>
              </div>
              <Switch
                id="dataCollection"
                checked={settings.dataCollection}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, dataCollection: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dataProcessing" className="text-sm font-medium">
                  Processamento de Dados
                </Label>
                <p className="text-xs text-text-muted">
                  Permitir processamento de dados para análise e relatórios
                </p>
              </div>
              <Switch
                id="dataProcessing"
                checked={settings.dataProcessing}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, dataProcessing: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dataSharing" className="text-sm font-medium">
                  Compartilhamento de Dados
                </Label>
                <p className="text-xs text-text-muted">
                  Permitir compartilhamento de dados com terceiros (parceiros)
                </p>
              </div>
              <Switch
                id="dataSharing"
                checked={settings.dataSharing}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, dataSharing: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="marketingEmails" className="text-sm font-medium">
                  E-mails de Marketing
                </Label>
                <p className="text-xs text-text-muted">
                  Receber comunicações promocionais e ofertas especiais
                </p>
              </div>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, marketingEmails: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analyticsTracking" className="text-sm font-medium">
                  Rastreamento Analítico
                </Label>
                <p className="text-xs text-text-muted">
                  Permitir coleta de dados de uso para melhorar o serviço
                </p>
              </div>
              <Switch
                id="analyticsTracking"
                checked={settings.analyticsTracking}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, analyticsTracking: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="cookieConsent" className="text-sm font-medium">
                  Cookies
                </Label>
                <p className="text-xs text-text-muted">
                  Permitir uso de cookies para funcionalidades essenciais
                </p>
              </div>
              <Switch
                id="cookieConsent"
                checked={settings.cookieConsent}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, cookieConsent: checked }))
                }
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={savePrivacySettings}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Direitos do Titular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-brand-600" />
            Direitos do Titular de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Conforme a LGPD, você tem direito a acessar, corrigir, excluir e portar seus dados pessoais.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleDataExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar Meus Dados
            </Button>

            <Button 
              onClick={handleDataDeletion}
              variant="destructive"
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <Trash2 className="h-4 w-4" />
              Deletar Todos os Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre Retenção */}
      {settings.lastUpdated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-brand-600" />
              Informações de Retenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-text-muted">
                <strong>Última atualização:</strong> {new Date(settings.lastUpdated).toLocaleString('pt-BR')}
              </p>
              {settings.consentDate && (
                <p className="text-sm text-text-muted">
                  <strong>Consentimento dado em:</strong> {new Date(settings.consentDate).toLocaleString('pt-BR')}
                </p>
              )}
              <p className="text-sm text-text-muted">
                <strong>Período de retenção:</strong> {settings.dataRetention} dias
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-600" />
            Contato e Suporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-text-muted">
              Para questões sobre privacidade e proteção de dados, entre em contato:
            </p>
            <div className="space-y-1">
              <p className="text-sm">
                <strong>E-mail:</strong> privacidade@meuagente.api.br
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
