export const currentPayPeriod = {
  periodStart: "2026-08-16",
  periodEnd: "2026-08-31",
  estimatedEarnings: 2480,
  baseEarnings: 1920,
  commission: 460,
  tips: 100,
  hoursWorked: 72.5,
};

export const paymentHistory = [
  { id: "pay-0815", date: "2026-08-15", periodStart: "2026-08-01", periodEnd: "2026-08-15", amount: 2210, status: "Paid" },
  { id: "pay-0731", date: "2026-07-31", periodStart: "2026-07-16", periodEnd: "2026-07-31", amount: 2180, status: "Paid" },
  { id: "pay-0715", date: "2026-07-15", periodStart: "2026-07-01", periodEnd: "2026-07-15", amount: 2095, status: "Paid" },
] as const;
