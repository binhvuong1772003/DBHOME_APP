import { useState, useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useParams } from 'react-router-dom';
import {
  getListNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/services/notificationService';
interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
export const useNotification = (shopSlugOverride?: string) => {
  const { shopSlug } = useParams();
  const activeShopSlug = shopSlugOverride ?? shopSlug;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!activeShopSlug) return;
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getListNotification(activeShopSlug);
        if (!cancelled) setNotifications(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [activeShopSlug, attempt]);
  useEffect(() => {
    const refreshFromSocket = () => {
      // Socket events only invalidate the list. The authenticated API remains
      // the source of truth so a shop-wide event cannot leak another user's
      // notification into this account's list.
      setHasNew(true);
      setAttempt((value) => value + 1);
    };

    socket.on('off_day_request', refreshFromSocket);
    socket.on('off_day_response', refreshFromSocket);
    socket.on('appointment_request', refreshFromSocket);
    return () => {
      socket.off('off_day_request', refreshFromSocket);
      socket.off('off_day_response', refreshFromSocket);
      socket.off('appointment_request', refreshFromSocket);
    };
  }, []);
  const onOpenBell = () => setHasNew(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationRead(activeShopSlug!, id);
    } catch (error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
      console.error(error);
    }
  };
  const deleteNoti = async (id: string) => {
    try {
      await deleteNotification(activeShopSlug!, id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  const markAllRead = async () => {
    if (!activeShopSlug) return;
    const previous = notifications;
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    try {
      await markAllNotificationsRead(activeShopSlug);
    } catch (error) {
      setNotifications(previous);
      console.error(error);
    }
  };
  return {
    notifications,
    hasNew,
    onOpenBell,
    unreadCount,
    markRead,
    deleteNoti,
    markAllRead,
    loading,
    error,
    retry: () => setAttempt((value) => value + 1),
  };
};
