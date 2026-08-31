import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse, PaginatedApiResponse } from "@/api/apiResponse";
import type { AppointmentPayment, ConfirmPaymentInput, CreatePaymentInput, Payment, PaymentListMeta, PaymentListQuery } from "../types/payment";

export async function getPayments(shopSlug: string, query: PaymentListQuery) {
  const params = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== ""));
  const { data: response } = await axiosClient.get<PaginatedApiResponse<Payment[], PaymentListMeta>>(`/api/shops/${shopSlug}/payments`, { params });
  return { data: response.data, meta: response.meta };
}
export async function getPaymentDetail(shopSlug: string, paymentId: string) {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<Payment>>(`/api/shops/${shopSlug}/payments/${paymentId}`);
  return response.data;
}
export async function confirmAppointmentPayment(shopSlug: string, appointmentId: string, input: ConfirmPaymentInput) {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<AppointmentPayment>>(`/api/shops/${shopSlug}/appointments/${appointmentId}/payment/confirm`, input);
  return response.data;
}

export async function getAppointmentPayment(shopSlug: string, appointmentId: string) {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<AppointmentPayment | null>>(`/api/shops/${shopSlug}/appointments/${appointmentId}/payment`);
  return response.data;
}

export async function createAppointmentPayment(shopSlug: string, appointmentId: string, input: CreatePaymentInput) {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<AppointmentPayment>>(`/api/shops/${shopSlug}/appointments/${appointmentId}/payment`, input);
  return response.data;
}
