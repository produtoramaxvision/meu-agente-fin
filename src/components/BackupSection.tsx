import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Upload, 
  Database, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  HardDrive,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BackupInfo {
  id: string;
  created_at: string;
  size: number;
  status: 'completed' | 'failed' | 'in_progress';
  type: 'automatic' | 'manual';
  description: string;
}

export function BackupSection() {
  const { cliente } = useAuth();
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  // Simular dados de backup (em produção, viria do Supabase)
  useEffect(() => {
    const mockBackups: BackupInfo[] = [
      {
        id: '1',
        created_at: new Date().toISOString(),
        size: 2048576, // 2MB
        status: 'completed',
        type: 'automatic',
        description: 'Backup automático diário'
      },
      {
        id: '2',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        size: 1856432, // 1.8MB
        status: 'completed',
        type: 'manual',
        description: 'Backup manual antes da atualização'
      },
      {
        id: '3',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        size: 1954321, // 1.9MB
        status: 'completed',
        type: 'automatic',
        description: 'Backup automático diário'
      }
    ];
    
    setBackups(mockBackups);
    setLoading(false);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    
    try {
      // Simular criação de backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newBackup: BackupInfo = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        size: Math.floor(Math.random() * 2000000) + 1000000,
        status: 'completed',
        type: 'manual',
        description: 'Backup manual criado pelo usuário'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      toast.success('Backup criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar backup');
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDownloadBackup = async (backupId: string) => {
    try {
      // Simular download
      toast.info('Iniciando download do backup...');
      
      // Em produção, aqui seria feita a chamada para o Supabase
      // para baixar o arquivo de backup
      
      setTimeout(() => {
        toast.success('Download concluído!');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao baixar backup');
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    setRestoring(true);
    setSelectedBackup(backupId);
    
    try {
      // Simular restauração
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      toast.success('Backup restaurado com sucesso!');
    } catch (error) {
      toast.error('Erro ao restaurar backup');
    } finally {
      setRestoring(false);
      setSelectedBackup(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Em Progresso</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
            <p className="text-xs text-muted-foreground">
              {backups.filter(b => b.status === 'completed').length} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {backups.length > 0 ? format(new Date(backups[0].created_at), 'dd/MM', { locale: ptBR }) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {backups.length > 0 ? format(new Date(backups[0].created_at), 'HH:mm', { locale: ptBR }) : 'Nenhum backup'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espaço Usado</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(backups.reduce((acc, b) => acc + b.size, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de todos os backups
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botão Criar Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-brand-600" />
            Criar Backup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleCreateBackup}
            disabled={creatingBackup}
            className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] hover:shadow-lg hover:scale-105"
          >
            <span className="relative z-10 flex items-center">
              <Database className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              {creatingBackup ? 'Criando...' : 'Criar Backup Manual'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>
        </CardContent>
      </Card>

      {/* Backup Progress */}
      {creatingBackup && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Criando backup dos seus dados...</p>
              <Progress value={66} className="w-full" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Restore Progress */}
      {restoring && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Restaurando backup selecionado...</p>
              <Progress value={75} className="w-full" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : backups.length > 0 ? (
            <div className="space-y-4">
              {backups.map((backup, index) => (
                <div 
                  key={backup.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(backup.status)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{backup.description}</p>
                        {getStatusBadge(backup.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(backup.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {formatFileSize(backup.size)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {backup.type === 'automatic' ? 'Automático' : 'Manual'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadBackup(backup.id)}
                      disabled={backup.status !== 'completed'}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreBackup(backup.id)}
                      disabled={backup.status !== 'completed' || restoring}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Restaurar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="h-12 w-12 mx-auto text-text-muted mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum backup encontrado</h3>
              <p className="text-sm text-text-muted mb-6">
                Crie seu primeiro backup para proteger seus dados
              </p>
              <Button onClick={handleCreateBackup} disabled={creatingBackup}>
                <Database className="mr-2 h-4 w-4" />
                Criar Primeiro Backup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações sobre Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Backups Automáticos</h4>
              <p className="text-sm text-muted-foreground">
                Backups automáticos são criados diariamente às 02:00 para proteger seus dados.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Retenção de Dados</h4>
              <p className="text-sm text-muted-foreground">
                Mantemos os últimos 30 backups automaticamente. Backups manuais são mantidos indefinidamente.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">O que é Incluído</h4>
              <p className="text-sm text-muted-foreground">
                Todos os seus dados financeiros, tarefas, agenda e configurações são incluídos no backup.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Restauração</h4>
              <p className="text-sm text-muted-foreground">
                A restauração substitui todos os dados atuais pelos dados do backup selecionado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
