import dayjs from "@/lib/dayjs";
import "dayjs/locale/vi";

export function shortPaymentId(id: string) {
  return `#${id.slice(-8).toUpperCase()}`;
}

export function formatPaymentDate(value: string, locale: string) {
  return {
    date: dayjs(value).locale(locale).format("MMM D, YYYY"),
    time: dayjs(value).locale(locale).format("LT"),
  };
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
