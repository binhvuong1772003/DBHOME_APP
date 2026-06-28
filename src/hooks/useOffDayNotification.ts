// hooks/useOffDayNotification.ts
import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { toast } from 'sonner';

// hooks/useOffDayNotification.ts
export const useOffDayNotification = () => {
  useEffect(() => {
    socket.on('off_day_request', (data) => {
      toast.info(data.message); // ← backend gửi data.message
    });

    socket.on('off_day_response', (data) => {
      toast.info(data.message); // ← backend gửi data.message
    });

    return () => {
      socket.off('off_day_request');
      socket.off('off_day_response');
    };
  }, []);
};
