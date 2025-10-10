import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface DeleteRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: {
    id: number;
    categoria: string;
    valor: number;
    data_hora: string;
    tipo: 'entrada' | 'saida';
    descricao?: string;
  } | null;
  onConfirm: () => Promise<void>;
}

export function DeleteRecordDialog({ open, onOpenChange, record, onConfirm }: DeleteRecordDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!record) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 p-4 rounded-lg bg-surface-elevated border border-border">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Categoria:</span>
              <span className="font-medium">{record.categoria}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Valor:</span>
              <span className={`font-bold ${record.tipo === 'entrada' ? 'text-[#39a85b]' : 'text-[#a93838]'}`}>
                {record.tipo === 'entrada' ? '+' : '-'}
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(record.valor))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Data:</span>
              <span className="font-medium">
                {new Date(record.data_hora).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {record.descricao && (
              <div className="flex justify-between items-start gap-4">
                <span className="text-sm text-text-muted">Descrição:</span>
                <span className="font-medium text-right max-w-[200px] truncate">
                  {record.descricao}
                </span>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
