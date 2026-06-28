import { useState, useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useParams } from 'react-router-dom';
import {
  getListNotification,
  markNotificationRead,
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
export const useNotification = () => {
  const { shopSlug } = useParams();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNew, setHasNew] = useState(false);
  useEffect(() => {
    if (!shopSlug) return;
    const fetch = async () => {
      try {
        const data = await getListNotification(shopSlug);
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [shopSlug]);
  useEffect(() => {
    socket.on('off_day_request', (data) => {
      setHasNew(true);
      setNotifications((prev) => [
        {
          id: data.notificationId,
          title: 'Yêu cầu nghỉ phép',
          content: data.message,
          type: 'off_day_request',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    socket.on('off_day_response', (data) => {
      setHasNew(true);
      setNotifications((prev) => [
        {
          id: data.notificationId,
          title: 'Phản hồi nghỉ phép',
          content: data.message,
          type: 'off_day_response',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });
    socket.on('appointment_request', (data) => {
      setHasNew(true);
      setNotifications((prev) => [
        {
          id: data.notificationId,
          title: 'Thông báo đặt lịch',
          content: data.message,
          type: 'appointment_request',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });
    return () => {
      socket.off('off_day_request');
      socket.off('off_day_response');
      socket.off('appointment_request');
    };
  }, []);
  const onOpenBell = () => setHasNew(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationRead(shopSlug!, id);
    } catch (error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
      console.error(error);
    }
  };
  const deleteNoti = async (id: string) => {
    try {
      await deleteNotification(shopSlug!, id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
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
  };
};
