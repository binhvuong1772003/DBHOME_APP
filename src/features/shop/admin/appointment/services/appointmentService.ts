import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { Appointment } from "../type/appointment";
import type { AppointmentScheduleResponse } from "../type/appointmentSchedule";
export const getAppointmentByDateWithSlot = async (
  shopSlug: string,
  params: { date: string },
) => {
  const { data: response } = await axiosClient.get<
    ApiSuccessResponse<AppointmentScheduleResponse>
  >(`/api/shops/${shopSlug}/calendar/appointments`, { params });
  console.log(`/api/shops/${shopSlug}/calendar/appointments`, { params });
  return response.data;
};
export const getAppointmentByDate = async (
  shopSlug: string,
  params: { date: string },
) => {
  const { data: response } = await axiosClient.get<
    ApiSuccessResponse<Appointment[]>
  >(`/api/shops/${shopSlug}/appointments/day`, { params });
  console.log(`/api/shops/${shopSlug}/appointments/day`, { params });
  return response.data;
};
export const changeStatus = async (
  shopSlug: string,
  appointmentId: string,
  status: string,
) => {
  const { data: response } = await axiosClient.put<
    ApiSuccessResponse<Appointment>
  >(`/api/shops/${shopSlug}/appointments/${appointmentId}`, { status });
  return response.data;
};
