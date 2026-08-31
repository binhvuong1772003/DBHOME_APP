import type { PaginationMeta } from "@/api/apiResponse";

export type PaymentStatus = "PENDING" | "PARTIAL" | "PAID" | "REFUNDED";
export type PaymentMethod = "CASH" | "MOMO" | "VNPAY" | "ZALO_PAY" | "CARD" | "TRANSFER";
export type PaymentDatePreset = "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "PREVIOUS_MONTH" | "CUSTOM";

export interface AppointmentPayment {
  id: string;
  appointmentId: string;
  amount: number;
  paidAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string | null;
  paidAt?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface PaymentPerson { id: string; name: string; email: string; avatarUrl?: string | null }
export interface PaymentAppointment {
  id: string; date: string; startTime: string; endTime: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  subtotal: number; discountAmount: number; totalAmount: number; note?: string | null;
  customer: PaymentPerson; staff?: PaymentPerson | null;
  services: Array<{ id: string; serviceName: string; priceAtBooking: number; durationMin: number; selectedValues: Array<{ id: string; priceAtBooking: number; optionValue: { id: string; name: string } }> }>;
  packages: Array<{ id: string; priceAtBooking: number; package: { id: string; name: string } }>;
  addons: Array<{ id: string; priceAtBooking: number; addon: { id: string; name: string } }>;
}
export interface Payment extends AppointmentPayment {
  appointment: PaymentAppointment;
}
export interface PaymentSummary { totalCollected: number; transactions: number; statusCounts: Record<PaymentStatus, number> }
export interface PaymentListMeta extends PaginationMeta { summary: PaymentSummary }
export interface PaymentListQuery { page: number; limit: number; from?: string; to?: string; status?: PaymentStatus; method?: PaymentMethod; search?: string }
export interface PaymentFilters { from: string; to: string; status?: PaymentStatus; method?: PaymentMethod; search?: string }
export interface ConfirmPaymentInput { paidAmount: number; transactionId?: string; note?: string }
export interface CreatePaymentInput { method: PaymentMethod; note?: string }
