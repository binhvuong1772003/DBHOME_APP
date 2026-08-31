import type { PayrollStatus } from "../types/payroll";
export const payrollStatusClass = (status: PayrollStatus) => status === "PAID" ? "border-secondary/25 bg-secondary/10 text-secondary" : status === "CONFIRMED" ? "border-primary/25 bg-primary/10 text-primary" : "border-chart-3/25 bg-chart-3/10 text-foreground";
export const getApiError = (error: unknown) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string; error?: { message?: string } } } }).response;
    return response?.data?.error?.message ?? response?.data?.message ?? "Request failed";
  }
  return error instanceof Error ? error.message : "Request failed";
};
