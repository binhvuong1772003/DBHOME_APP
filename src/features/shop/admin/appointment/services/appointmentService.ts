import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { Appointment } from "../type/appointment";
import type { AppointmentScheduleResponse } from "../type/appointmentSchedule";
import type { AppointmentStatusUpdate } from "../constants/appointmentStatus";
import type { CreateAppointmentInput } from "../types/createAppointment";

export const createManagerAppointment = async (
  shopSlug: string,
  input: CreateAppointmentInput,
) => {
  const { data: response } = await axiosClient.post<
    ApiSuccessResponse<Appointment>
  >(`/api/shops/${shopSlug}/appointments`, input);
  return response.data;
};
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
  input: AppointmentStatusUpdate,
) => {
  const { data: response } = await axiosClient.put<
    ApiSuccessResponse<Appointment>
  >(`/api/shops/${shopSlug}/appointments/${appointmentId}`, input);
  return response.data;
};
