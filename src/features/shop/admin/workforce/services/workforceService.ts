import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse, PaginatedApiResponse } from "@/api/apiResponse";
import { getAppointmentByDate } from "../../appointment/services/appointmentService";
import type { Appointment } from "../../appointment/type/appointment";
import type { AdminTimeOffRequest, TimeOffPagination, TimeOffStatusFilter } from "../types/workforce";

export async function getTimeOffRequests(
  shopSlug: string,
  query: { page: number; limit: number; status: TimeOffStatusFilter },
): Promise<{ data: AdminTimeOffRequest[]; meta: TimeOffPagination }> {
  const { data: response } = await axiosClient.get<PaginatedApiResponse<AdminTimeOffRequest[], TimeOffPagination>>(
    `/api/shops/${shopSlug}/staff/off-days`,
    {
      params: {
        page: query.page,
        limit: query.limit,
        status: query.status === "ALL" ? undefined : query.status,
      },
    },
  );
  return { data: response.data, meta: response.meta };
}

export async function reviewTimeOffRequest(
  shopSlug: string,
  requestId: string,
  input: { status: "APPROVED" | "REJECTED"; rejectReason?: string },
): Promise<AdminTimeOffRequest> {
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<AdminTimeOffRequest>>(
    `/api/shops/${shopSlug}/staff/off-days/${requestId}`,
    input,
  );
  return response.data;
}

export async function countStaffAppointments(
  shopSlug: string,
  staffUserId: string,
  dates: string[],
): Promise<number> {
  const dailyAppointments = await Promise.all(
    dates.map((date) => getAppointmentByDate(shopSlug, { date }) as Promise<Appointment[]>),
  );
  return dailyAppointments.flat().filter(
    (appointment) =>
      appointment.staffId === staffUserId &&
      appointment.status !== "CANCELLED" &&
      appointment.status !== "NO_SHOW",
  ).length;
}
