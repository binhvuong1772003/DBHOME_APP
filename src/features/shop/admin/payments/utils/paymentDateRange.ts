import dayjs from "@/lib/dayjs";
import type { PaymentDatePreset, PaymentFilters } from "../types/payment";

export function getPaymentPresetRange(preset: Exclude<PaymentDatePreset, "CUSTOM">): Pick<PaymentFilters, "from" | "to"> {
  const now = dayjs();
  if (preset === "TODAY") { const today = now.format("YYYY-MM-DD"); return { from: today, to: today }; }
  if (preset === "THIS_WEEK") return { from: now.startOf("week").format("YYYY-MM-DD"), to: now.endOf("week").format("YYYY-MM-DD") };
  if (preset === "PREVIOUS_MONTH") { const previous = now.subtract(1, "month"); return { from: previous.startOf("month").format("YYYY-MM-DD"), to: previous.endOf("month").format("YYYY-MM-DD") }; }
  return { from: now.startOf("month").format("YYYY-MM-DD"), to: now.endOf("month").format("YYYY-MM-DD") };
}
