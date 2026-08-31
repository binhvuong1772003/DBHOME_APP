import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { GeneratePayrollResult, Payroll, PayrollFilters, PaymentMethod, SalaryConfig, SalaryConfigInput, ServiceCommission } from "../types/payroll";

export async function getPayrolls(shopSlug: string, filters: PayrollFilters) {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<Payroll[]>>(`/api/shops/${shopSlug}/payrolls`, { params: filters });
  return response.data;
}
export async function getPayroll(shopSlug: string, id: string) {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<Payroll>>(`/api/shops/${shopSlug}/payrolls/${id}`); return response.data;
}
export async function generatePayrolls(shopSlug: string, input: { periodStart: string; periodEnd: string; staffIds?: string[] }) {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<GeneratePayrollResult>>(`/api/shops/${shopSlug}/payrolls/generate`, input); return response.data;
}
export async function adjustPayroll(shopSlug: string, id: string, input: { type: "BONUS" | "DEDUCTION"; amount: number; description: string }) {
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<Payroll>>(`/api/shops/${shopSlug}/payrolls/${id}/adjustments`, input); return response.data;
}
export async function confirmPayroll(shopSlug: string, id: string) { const { data: response } = await axiosClient.post<ApiSuccessResponse<Payroll>>(`/api/shops/${shopSlug}/payrolls/${id}/confirm`); return response.data; }
export async function payPayroll(shopSlug: string, id: string, input: { paymentMethod: PaymentMethod; paymentNote?: string }) { const { data: response } = await axiosClient.post<ApiSuccessResponse<Payroll>>(`/api/shops/${shopSlug}/payrolls/${id}/pay`, input); return response.data; }
export async function getSalaryConfig(shopSlug: string, staffId: string) { const { data: response } = await axiosClient.get<ApiSuccessResponse<SalaryConfig | null>>(`/api/shops/${shopSlug}/staff/${staffId}/salary-config`); return response.data; }
export async function updateSalaryConfig(shopSlug: string, staffId: string, input: SalaryConfigInput) { const { data: response } = await axiosClient.put<ApiSuccessResponse<SalaryConfig>>(`/api/shops/${shopSlug}/staff/${staffId}/salary-config`, input); return response.data; }
export async function getCommissions(shopSlug: string, staffId: string) { const { data: response } = await axiosClient.get<ApiSuccessResponse<ServiceCommission[]>>(`/api/shops/${shopSlug}/staff/${staffId}/commissions`); return response.data; }
export async function updateCommission(shopSlug: string, staffId: string, serviceId: string, input: { commissionType: "PERCENT" | "FIXED_PER_SERVICE"; value: number }) { const { data: response } = await axiosClient.put<ApiSuccessResponse<ServiceCommission>>(`/api/shops/${shopSlug}/staff/${staffId}/commissions/${serviceId}`, input); return response.data; }
