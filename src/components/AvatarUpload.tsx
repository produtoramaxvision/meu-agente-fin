import { useState, useRef } from 'react';
import { Edit, Trash2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from '@/components/ui/context-menu';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userPhone: string;
  userName: string;
  onUploadComplete: (url: string | null) => void;
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  userPhone, 
  userName,
  onUploadComplete 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const triggerFileSelect = () => {
    // Previne o acionamento se já estiver em processo de upload
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];

      // Validation
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Por favor, selecione um arquivo JPEG ou PNG.',
          variant: 'destructive',
        });
        return;
      }

      const maxSizeInBytes = 600 * 1024; // 600KB
      if (file.size > maxSizeInBytes) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo da imagem é de 600KB.',
          variant: 'destructive',
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userPhone}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '0'
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl: baseUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('clientes')
        .update({ avatar_url: baseUrl })
        .eq('phone', userPhone);

      if (updateError) {
        console.error("Supabase DB update error:", updateError);
        throw updateError;
      }

      const timestamp = new Date().getTime();
      const publicUrlWithTimestamp = `${baseUrl}?t=${timestamp}`;

      onUploadComplete(publicUrlWithTimestamp);
      
      toast({
        title: 'Sucesso',
        description: 'Foto de perfil atualizada com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da foto. Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatarUrl) return;

    try {
      setUploading(true);

      const url = new URL(currentAvatarUrl);
      const filePath = url.pathname.split('/avatars/')[1];

      if (!filePath) {
        throw new Error("Não foi possível encontrar o caminho do arquivo.");
      }

      await supabase.storage.from('avatars').remove([filePath]);
      const { error: updateError } = await supabase
        .from('clientes')
        .update({ avatar_url: null })
        .eq('phone', userPhone);

      if (updateError) {
        console.error("Supabase DB update error on remove:", updateError);
        throw updateError;
      }

      onUploadComplete(null);

      toast({
        title: 'Sucesso',
        description: 'Foto de perfil removida.',
      });

    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a foto. Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ContextMenu>
        <ContextMenuTrigger 
          className="cursor-pointer rounded-full transition-transform duration-300 ease-in-out hover:scale-105"
          onClick={triggerFileSelect}
        >
          <Avatar className="h-32 w-32 border-2 border-border">
            {currentAvatarUrl ? (
              <AvatarImage src={currentAvatarUrl} alt={userName} key={currentAvatarUrl} />
            ) : (
              <AvatarFallback className="bg-surface text-4xl">
                <User className="h-12 w-12 text-text-muted" />
              </AvatarFallback>
            )}
          </Avatar>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={triggerFileSelect} disabled={uploading}>
            <Edit className="mr-2 h-4 w-4" />
            <span>{uploading ? 'Enviando...' : 'Editar Foto'}</span>
          </ContextMenuItem>
          {currentAvatarUrl && (
            <ContextMenuItem onSelect={handleRemoveAvatar} disabled={uploading} className="text-red-500 focus:text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Remover Foto</span>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <input
        ref={fileInputRef}
        id="avatar-upload"
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileUpload}
        disabled={uploading}
        className="hidden"
      />

      <p className="text-sm text-text-muted">
        Clique com o botão direito para {currentAvatarUrl ? 'editar ou remover' : 'adicionar'} a foto.
      </p>
    </div>
  );
}