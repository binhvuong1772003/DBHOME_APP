// @/hooks/useChangeAppointmentStatus.ts
import { useState } from "react";
import { useParams } from "react-router-dom";
import { changeStatus } from "@/features/shop/admin/appointment/services/appointmentService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {
  appointmentStatusConfig,
  type AppointmentStatusUpdate,
} from "../constants/appointmentStatus";

export const useChangeAppointmentStatus = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("appointment");

  const changeAppointmentStatus = async (
    appointmentId: string,
    input: AppointmentStatusUpdate,
  ) => {
    if (!shopSlug) {
      toast.error("Shop không tồn tại");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await changeStatus(shopSlug, appointmentId, input);
      toast.success(
        t("status.updated", {
          status: t(appointmentStatusConfig[input.status].labelKey),
        }),
      );
      return result;
    } catch (requestError: unknown) {
      const errorMsg = getApiErrorMessage(requestError, t("status.updateError"));
      setError(errorMsg);
      toast.error(errorMsg);
      throw requestError;
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
