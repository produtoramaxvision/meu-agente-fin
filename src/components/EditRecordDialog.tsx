import { FinanceRecordForm } from './FinanceRecordForm';

interface EditRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: {
    id: number;
    tipo: 'entrada' | 'saida';
    categoria: string;
    valor: number;
    descricao: string | null;
    data_hora: string;
    data_vencimento?: string;
    status?: 'pago' | 'pendente';
    recorrente?: boolean;
    recorrencia_fim?: string;
    phone: string;
  } | null;
  onSuccess?: () => void;
}

export function EditRecordDialog({ open, onOpenChange, record, onSuccess }: EditRecordDialogProps) {
  if (!record) return null;

  return (
    <FinanceRecordForm
      userPhone={record.phone}
      recordToEdit={record}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
