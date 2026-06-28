import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { toast } from 'sonner';

export const useAppointmentNotification = () => {
  useEffect(() => {
    socket.on('appointment_request', (data) => {
      toast.info(data.message);
    });

    return () => {
      socket.off('appointment_request');
    };
  }, []);
};
