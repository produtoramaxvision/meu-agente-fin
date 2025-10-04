import { Notification } from '@/hooks/useNotificationsData';
import { cn } from '@/lib/utils';
import { Bell, CreditCard, AlertTriangle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

const typeIcons = {
  pagamento: CreditCard,
  aviso: Info,
  problema: AlertTriangle,
  atualizacao: Bell,
};

const typeColors = {
  pagamento: 'text-green-500',
  aviso: 'text-blue-500',
  problema: 'text-red-500',
  atualizacao: 'text-purple-500',
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = typeIcons[notification.tipo] || Bell;
  const color = typeColors[notification.tipo] || 'text-gray-500';

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-surface-hover',
        !notification.lida && 'bg-surface-2'
      )}
    >
      {!notification.lida && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2" aria-label="Não lida" />
      )}
      <div className={cn('flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full', !notification.lida ? 'ml-0' : 'ml-4')}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{notification.titulo}</p>
        <p className="text-sm text-text-muted">{notification.mensagem}</p>
        <p className="text-xs text-text-muted mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })}
        </p>
      </div>
    </div>
  );
}