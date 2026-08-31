export type PayrollStatus = "DRAFT" | "CONFIRMED" | "PAID";
export type CommissionType = "PERCENT" | "FIXED_PER_SERVICE" | "FIXED_PER_DAY" | "SALARY";
export type SalaryPeriod = "WEEKLY" | "BIWEEKLY" | "MONTHLY";
export type PaymentMethod = "CASH" | "MOMO" | "VNPAY" | "ZALO_PAY" | "CARD" | "TRANSFER";

export interface PayrollLineItem { type: string; description: string; amount: number; date?: string | null; referenceId?: string | null }
export interface Payroll {
  id: string; shopId: string; userId: string; staffId: string | null;
  periodStart: string; periodEnd: string; status: PayrollStatus;
  totalWorkDays: number; totalWorkMinutes: number; totalServices: number; totalRevenue: number;
  baseSalary: number; commissionTotal: number; bonusTotal: number; penaltyTotal: number;
  otAmount: number; otherDeductions: number; otherBonuses: number; grossAmount: number; netAmount: number;
  lineItems: PayrollLineItem[]; note?: string | null; approvedAt?: string | null; paidAt?: string | null;
  paymentMethod?: PaymentMethod | null; paymentNote?: string | null; createdAt: string; updatedAt: string;
  user?: { name?: string; email?: string };
}
export interface SalaryConfig {
  id: string; shopStaffId: string; commissionType: CommissionType; baseSalary: number; salaryPeriod: SalaryPeriod;
  defaultCommissionPercent: number; defaultFixedPerService: number; bonusPerPositiveReview: number;
  penaltyPerNoShow: number; penaltyPerLateMinute: number; otMultiplier: number; effectiveFrom: string; note?: string | null;
}
export type SalaryConfigInput = Partial<Omit<SalaryConfig, "id" | "shopStaffId">>;
export interface ServiceCommission { id: string; serviceId: string; commissionType: "PERCENT" | "FIXED_PER_SERVICE"; value: number; service: { id: string; name: string; price?: number } }
export interface PayrollFilters { periodStart?: string; periodEnd?: string; status?: PayrollStatus; staffId?: string }
export interface GeneratePayrollResult { created: Payroll[]; skipped: { staffId: string; reason: string }[] }
