import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { getAppointmentByDate } from "@/features/shop/admin/appointment/services/appointmentService";
import type { Appointment } from "@/features/shop/admin/appointment/type/appointment";
import { socket } from "@/lib/socket";
import { useAsync } from "@/hooks/common/useAsync";
export const useGetAppointment = (externalDate?: string) => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [preAppointments, setPreAppointments] = useState<Appointment[]>([]);
  const { isLoading, error, run } = useAsync<void>();
  const [internalDate, setInternalDate] = useState<string>(() =>
    new Date().toLocaleDateString("sv-SE"),
  );
  const newIdsRef = useRef(newIds);
  useEffect(() => {
    newIdsRef.current = newIds;
  }, [newIds]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopListeningRef = useRef<() => void>(() => {});
  useEffect(() => {
    return () => {
      stopListeningRef.current();
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);
  const date = externalDate ?? internalDate;
  const setDate = setInternalDate;

  const prevDate = useMemo(() => {
    const currentDate = new Date(`${date}T00:00:00`);
    currentDate.setDate(currentDate.getDate() - 1);
    return currentDate.toLocaleDateString("sv-SE");
  }, [date]);

  const appointmentsRef = useRef(appointments);
  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  const fetchAppointments = useCallback(async () => {
    if (!shopSlug) return;
    return run(async () => {
      const data = await getAppointmentByDate(shopSlug, { date });
      console.log('data":', data);
      const preData = await getAppointmentByDate(shopSlug, { date: prevDate });
      setAppointments(data ?? []);
      setPreAppointments(preData ?? []);
    }, "Không tải được dữ liệu lịch hẹn");
  }, [shopSlug, date, prevDate]);

  const clearNew = useCallback((id: string) => {
    setNewIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!shopSlug) return;
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (!shopSlug) return;

    const handleAppointmentRequest = async () => {
      try {
        const freshData = await getAppointmentByDate(shopSlug, { date });
        const freshAppointments: Appointment[] = freshData ?? [];

        const currentAppointments = appointmentsRef.current;
        const newAppointmentIds = freshAppointments
          .filter(
            (apt) => !currentAppointments.find((old) => old.id === apt.id),
          )
          .map((apt) => apt.id);
        const trulyNewIds = newAppointmentIds.filter(
          (id) => !newIdsRef.current.has(id),
        );

        setNewIds((prev) => new Set([...prev, ...trulyNewIds]));
        setAppointments(freshAppointments);
        if (trulyNewIds.length > 0 && !audioRef.current) {
          const audio = new Audio("/sounds/appointment-sound.wav");
          audio.loop = true;
          audio.volume = 0.5;
          audio.play().catch(() => {
            console.log("Không thể phát âm thanh");
            audioRef.current = null;
          });
          audioRef.current = audio;

          const stopAudio = () => {
            audio.pause();
            audioRef.current = null;
          };

          const events = ["click", "mousemove", "keydown", "touchstart"];
          const handler = () => stopAudio();
          events.forEach((event) =>
            window.addEventListener(event, handler, { once: true }),
          );

          stopListeningRef.current = () => {
            events.forEach((event) =>
              window.removeEventListener(event, handler),
            );
          };
        }
      } catch (err) {
        console.log("lỗi:", err);
      }
    };

    socket.on("appointment_request", handleAppointmentRequest);
    return () => {
      socket.off("appointment_request", handleAppointmentRequest);
    };
  }, [shopSlug, date]);
  const updateAppointment = useCallback(
    async (appointmentId: string, changes: Partial<Appointment>) => {
      await setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, ...changes } : apt,
        ),
      );
    },
    [],
  );
  return {
    appointments,
    newIds,
    clearNew,
    preAppointments,
    error,
    isLoading,
    date,
    setDate,
    refetch: fetchAppointments,
    updateAppointment,
  };
};
