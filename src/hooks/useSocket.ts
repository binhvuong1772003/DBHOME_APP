// hooks/useSocket.ts
import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { tokenService } from '@/api/axiosClient';
import { useAuth } from '@/hooks/useAuth';

// hooks/useSocket.ts
export const useSocket = (shopId?: string) => {
  const { user } = useAuth();

  useEffect(() => {
    const token = tokenService.getAccess();
    if (!token || !user) return;

    socket.auth = { token };
    socket.connect();

    socket.on('connect', () => {
      socket.emit('join', user.id);
      if (shopId) {
        socket.emit('join_shop', shopId);
      }
    });

    return () => {
      socket.off('connect');
      socket.disconnect();
    };
  }, [user, shopId]);

  return socket;
};
