import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, CheckCheck } from 'lucide-react';
import { useNotificationsData } from '@/hooks/useNotificationsData';
import { NotificationItem } from '@/components/NotificationItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function Notifications() {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotificationsData();

  return (
    <div className="py-4 sm:py-6 lg:py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent drop-shadow-sm">
          Notificações
        </h1>
        <p className="text-text-muted mt-2">
          Aqui você encontrará avisos importantes sobre sua conta e o sistema.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Caixa de Entrada</CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onClick={() => markAsRead(n.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BellRing className="h-12 w-12 mx-auto text-text-muted mb-4" />
              <h3 className="text-lg font-medium">Tudo em dia!</h3>
              <p className="mt-1 text-sm text-text-muted">
                Você não tem nenhuma notificação nova.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}