// @/hooks/useChangeAppointmentStatus.ts
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { changeStatus } from '@/services/appointmentService';
import { toast } from 'sonner';

export const useChangeAppointmentStatus = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeAppointmentStatus = async (
    appointmentId: string,
    status: 'CONFIRMED' | 'CANCELLED' | 'IN_PROGRESS' | 'DONE' | 'NO_SHOW'
  ) => {
    if (!shopSlug) {
      toast.error('Shop không tồn tại');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await changeStatus(shopSlug, appointmentId, status);
      toast.success(`Đã cập nhật trạng thái thành ${status}`);
      return result;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || 'Không thể cập nhật trạng thái';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changeAppointmentStatus,
    isLoading,
    error,
  };
};
