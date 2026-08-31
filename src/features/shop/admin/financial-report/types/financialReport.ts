export type FinancialReportPreset =
  | "THIS_MONTH"
  | "PREVIOUS_MONTH"
  | "THIS_QUARTER"
  | "PREVIOUS_QUARTER"
  | "CUSTOM";

export interface FinancialReportRange {
  start: string;
  end: string;
}

export interface FinancialPayrollSummary {
  records: number;
  cost: number;
  baseSalary: number;
  commission: number;
  bonus: number;
  deductions: number;
  overtime: number;
  netPaid: number;
}

export interface FinancialPeriodData {
  dataAvailable: boolean;
  revenue: number;
  completedAppointments: number;
  averageTicket: number;
  payroll: FinancialPayrollSummary | null;
  revenueAfterPayroll: number | null;
  trend: Array<{ date: string; revenue: number }>;
  revenueBreakdown: Array<{ key: string; revenue: number }>;
  topServices: Array<{
    name: string;
    appointments: number;
    revenue: number;
    averageTicket: number;
  }>;
  staffPerformance: Array<{
    staffId: string;
    name: string;
    email?: string;
    appointments: number;
    revenue: number;
    commission: number;
  }>;
  paymentMethods: Array<{ method: string; revenue: number }>;
}

export interface FinancialReportResponse {
  period: {
    start: string;
    end: string;
    previousStart: string;
    previousEnd: string;
  };
  current: FinancialPeriodData;
  previous: {
    revenue: number;
    payrollCost: number | null;
    revenueAfterPayroll: number | null;
    completedAppointments: number;
    dataAvailable: boolean;
  };
  coverage: {
    revenue: boolean;
    payroll: boolean;
    operatingExpenses: boolean;
    paymentMethods: boolean;
  };
}
