import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface DuplicateWarningProps {
  isDuplicate: boolean;
  duplicateFields: string[];
  isChecking: boolean;
  message?: string;
}

export function DuplicateWarning({ 
  isDuplicate, 
  duplicateFields, 
  isChecking, 
  message 
}: DuplicateWarningProps) {
  if (isChecking) {
    return (
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-800">
        <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
        <AlertTitle className="text-blue-900 dark:text-blue-100">
          Verificando duplicatas...
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          Aguarde enquanto verificamos se já existe um registro similar.
        </AlertDescription>
      </Alert>
    );
  }

  if (isDuplicate) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-900 dark:text-red-100">
          Registro duplicado detectado!
        </AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-300">
          {message || `Campos duplicados: ${duplicateFields.join(', ')}. Verifique os dados ou aguarde alguns minutos.`}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800">
      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertTitle className="text-green-900 dark:text-green-100">
        Registro válido
      </AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-300">
        Nenhuma duplicata encontrada. Você pode prosseguir.
      </AlertDescription>
    </Alert>
  );
}
