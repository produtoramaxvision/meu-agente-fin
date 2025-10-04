import { useNotificationsData } from '@/hooks/useNotificationsData';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellRing, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsData();

  return (
    <div className="w-80 md:w-96">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold">Notificações</h3>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>
      <ScrollArea className="h-80">
        {notifications.length > 0 ? (
          <div className="p-2">
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onClick={() => markAsRead(n.id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-text-muted">
            <BellRing className="h-10 w-10 mb-4" />
            <p className="font-medium">Nenhuma notificação</p>
            <p className="text-sm">Você está em dia!</p>
          </div>
        )}
      </ScrollArea>
      <div className="p-2 border-t">
        <Button variant="link" asChild className="w-full">
          <Link to="/notificacoes">Ver todas as notificações</Link>
        </Button>
      </div>
    </div>
  );
}