import dayjs from "dayjs";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface DateNavigatorProps {
  value: string;
  onChange: (date: string) => void;
}

export function DateNavigator({ value, onChange }: DateNavigatorProps) {
  const { t, i18n } = useTranslation(["workspace", "common"]);
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const selected = dayjs(value);
  const today = dayjs().format("YYYY-MM-DD");
  const selectedLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(selected.toDate());

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label={t("accessibility.dateNavigation")}>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="size-11"
        aria-label={t("common:time.previousDay")}
        onClick={() => onChange(selected.subtract(1, "day").format("YYYY-MM-DD"))}
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      <div className="min-w-[12rem] flex-1 rounded-lg border bg-card px-4 py-2 text-center sm:flex-none">
        <p className="text-sm font-semibold">{selectedLabel}</p>
        <p className="text-xs text-muted-foreground">{selected.format("YYYY")}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="size-11"
        aria-label={t("common:time.nextDay")}
        onClick={() => onChange(selected.add(1, "day").format("YYYY-MM-DD"))}
      >
        <ChevronRight aria-hidden="true" />
      </Button>
      <Button type="button" variant="outline" className="h-11" onClick={() => onChange(today)} disabled={value === today}>
        {t("common:time.today")}
      </Button>
      <label className="relative flex h-11 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
        <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
        <span>{t("common:time.calendar")}</span>
        <Input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={t("accessibility.chooseScheduleDate")}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </nav>
  );
}
