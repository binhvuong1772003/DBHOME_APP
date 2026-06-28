import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getAppointmentByDay } from '@/services/appointmentService';
import type { Appointment } from '@/types/appointment';
import { socket } from '@/lib/socket';

export const useGetAppointment = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [preAppointments, setPreAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const prevDate = useMemo(() => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    return currentDate.toISOString().split('T')[0];
  }, [date]);

  // Tách fetch thành function riêng để dùng lại
  const fetchAppointments = useCallback(async () => {
    if (!shopSlug) return;

    try {
      const data = await getAppointmentByDay(shopSlug, {
        date: '2026-03-26',
      });
      const preData = await getAppointmentByDay(shopSlug, {
        date: prevDate,
      });
      setAppointments(data);
      setPreAppointments(preData);
    } catch (err) {
      console.log('lỗi:', err);
      setError('Không tải được dữ liệu shop');
    } finally {
      setIsLoading(false);
    }
  }, [shopSlug, date, prevDate]);

  // Fetch ban đầu khi component mount
  useEffect(() => {
    console.log('useEffect chạy, shopSlug:', shopSlug);
    if (!shopSlug) {
      console.log('return vì shopSlug null');
      return;
    }
    fetchAppointments();
  }, [shopSlug, date, prevDate]);

  // Listen WebSocket để tự động refetch khi có appointment mới
  useEffect(() => {
    socket.on('appointment_request', async () => {
      console.log('🔔 Nhận được appointment mới, đang refetch...');

      if (!shopSlug) return;

      try {
        const freshData = await getAppointmentByDay(shopSlug, {
          date: '2026-03-26',
        });

        // Đánh dấu appointment mới (so sánh với list cũ)
        const newAppointmentIds = freshData
          .filter(
            (apt: Appointment) =>
              !appointments.find((old: Appointment) => old.id === apt.id)
          )
          .map((apt: Appointment) => apt.id);

        const updatedData = freshData.map((apt: Appointment) => ({
          ...apt,
          isNew: newAppointmentIds.includes(apt.id),
        }));

        setAppointments(updatedData);
      } catch (err) {
        console.log('lỗi:', err);
      }
    });

    return () => {
      socket.off('appointment_request');
    };
  }, [shopSlug, appointments]);

  return {
    appointments,
    preAppointments,
    error,
    isLoading,
    date,
    setDate,
    refetch: fetchAppointments,
  };
};
