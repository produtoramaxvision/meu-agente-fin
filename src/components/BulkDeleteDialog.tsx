import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordCount: number;
  recordsPreview: Array<{ id: number; categoria: string; valor: number; tipo: string }>;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export function BulkDeleteDialog({
  open,
  onOpenChange,
  recordCount,
  recordsPreview,
  onConfirm,
  isDeleting = false
}: BulkDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl">
              Confirmar Exclusão em Massa
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-4 space-y-4">
            <p className="text-base">
              Você está prestes a excluir <span className="font-bold text-red-600 dark:text-red-400">{recordCount}</span> {recordCount === 1 ? 'registro' : 'registros'}. Esta ação não pode ser desfeita.
            </p>
            
            {recordsPreview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Registros a serem excluídos:</p>
                <div className="max-h-40 overflow-y-auto space-y-2 bg-muted/30 rounded-md p-3">
                  {recordsPreview.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between text-sm py-1.5 px-2 bg-background rounded">
                      <span className="font-medium">{record.categoria}</span>
                      <span className={record.tipo === 'entrada' ? 'text-[#39a85b]' : 'text-[#a93838]'}>
                        {record.tipo === 'entrada' ? '+' : '-'}
                        R$ {Number(record.valor).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {recordCount > 5 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      E mais {recordCount - 5} {recordCount - 5 === 1 ? 'registro' : 'registros'}...
                    </p>
                  )}
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir Tudo'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
