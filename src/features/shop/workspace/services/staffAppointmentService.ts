import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { AppointmentStatus } from "@/features/shop/admin/appointment/constants/appointmentStatus";

export interface StaffAppointmentApiItem {
  id: string;
  staffId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  note?: string | null;
  customer: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  services: Array<{
    id: string;
    serviceName: string;
  }>;
  packages: Array<{
    id: string;
    packageName?: string | null;
    package?: {
      name: string;
    } | null;
  }>;
  addons: Array<{
    id: string;
    addon?: {
      name: string;
    } | null;
  }>;
}

export async function getMyAppointmentsByDate(
  shopSlug: string,
  date: string,
): Promise<StaffAppointmentApiItem[]> {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<StaffAppointmentApiItem[]>>(
    `/api/shops/${shopSlug}/appointments/day`,
    {
      params: {
        date,
        assignedToMe: true,
      },
    },
  );

  return response.data;
}
