import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Notification {
  id: string;
  phone: string;
  tipo: 'pagamento' | 'aviso' | 'problema' | 'atualizacao';
  titulo: string;
  mensagem: string;
  lida: boolean;
  data: Record<string, any> | null;
  created_at: string;
}

export function useNotificationsData() {
  const { cliente } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async (phone: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = data as Notification[];
      setNotifications(typedData || []);
      setUnreadCount(typedData?.filter(n => !n.lida).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Erro ao buscar notificações.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cliente?.phone) {
      fetchNotifications(cliente.phone);
    }
  }, [cliente?.phone, fetchNotifications]);

  useEffect(() => {
    if (!cliente?.phone) return;

    const channel: RealtimeChannel = supabase.channel(`notifications:${cliente.phone}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `phone=eq.${cliente.phone}` },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(current => [newNotification, ...current]);
          setUnreadCount(current => current + 1);
          toast.info(newNotification.titulo, {
            description: newNotification.mensagem,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cliente?.phone]);

  const markAsRead = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.lida) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ lida: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(current =>
        current.map(n => (n.id === id ? { ...n, lida: true } : n))
      );
      setUnreadCount(current => Math.max(0, current - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Erro ao marcar notificação como lida.');
    }
  };

  const markAllAsRead = async () => {
    if (!cliente?.phone || unreadCount === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ lida: true })
        .eq('phone', cliente.phone)
        .eq('lida', false);

      if (error) throw error;

      setNotifications(current => current.map(n => ({ ...n, lida: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Erro ao marcar todas as notificações como lidas.');
    }
  };

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead };
}