import { useNotificationsData } from '@/hooks/useNotificationsData';
import { NotificationItem } from './NotificationItem';
import { SkeletonNotification } from './SkeletonNotification';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellRing, CheckCheck, Settings, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAsUnread, deleteNotification, markAllAsRead, loading, refetch } = useNotificationsData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-80 md:w-96 bg-popover">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        </div>
      </div>
      <ScrollArea className="h-80 bg-popover">
        {loading ? (
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonNotification key={i} />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="p-2">
            {notifications.map((n) => (
              <NotificationItem 
                key={n.id} 
                notification={n} 
                onMarkRead={markAsRead}
                onMarkUnread={markAsUnread}
                onDelete={deleteNotification}
              />
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
      <div className="p-2 border-t flex gap-2">
        <Button variant="link" asChild className="flex-1">
          <Link to="/notificacoes">Ver todas as notificações</Link>
        </Button>
        <Button variant="link" asChild className="flex-1">
          <Link to="/configuracoes">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Link>
        </Button>
      </div>
    </div>
  );
}