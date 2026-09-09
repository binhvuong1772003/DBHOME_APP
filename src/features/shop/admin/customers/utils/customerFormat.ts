import { formatCurrency } from "@/features/shop/admin/financial-report/utils/formatCurrency";

export { formatCurrency };

export function formatCustomerDate(value: string | null | undefined, locale: string, fallback = "—") {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });
}

export function formatCustomerDateTime(value: string, time: string, locale: string) {
  const date = formatCustomerDate(value, locale);
  return `${date} · ${time}`;
}

export function getCustomerInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}
