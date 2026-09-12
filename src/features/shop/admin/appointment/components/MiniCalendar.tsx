import type { ReactNode } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/vi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MiniCalendarProps {
  selectedDate: string;
  calendarDays: dayjs.Dayjs[];
  mutedList: boolean[];
  currentMonth: dayjs.Dayjs;
  setSelectedDate: (date: string) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

function CalendarDay({ children, selected = false, muted = false, onClick, ariaLabel }: {
  children: ReactNode;
  selected?: boolean;
  muted?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium ${
        selected
          ? "bg-primary text-primary-foreground shadow-sm"
          : muted
            ? "text-muted-foreground/45"
            : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function MiniCalendar({
  calendarDays,
  selectedDate,
  currentMonth,
  setSelectedDate,
  goToPreviousMonth,
  goToNextMonth,
}: MiniCalendarProps) {
  const { t, i18n } = useTranslation("appointment");
  const weekdays = t("calendar.weekdays", { returnObjects: true }) as string[];
  const calendarLocale = i18n.resolvedLanguage?.startsWith("vi") ? "vi" : "en";

  return (
    <Card className="gap-4 rounded-xl py-5 shadow-xs">
      <CardHeader className="flex-row items-center justify-between px-5">
        <div>
          <CardTitle className="text-sm">
            {currentMonth.locale(calendarLocale).format("MMMM YYYY").toUpperCase()}
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("calendar.selectDate")}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11"
            aria-label={t("calendar.previousMonth")}
            onClick={goToPreviousMonth}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11"
            aria-label={t("calendar.nextMonth")}
            onClick={goToNextMonth}
          >
            <ChevronRight />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <div className="grid grid-cols-7 justify-items-center gap-y-1 text-center">
          {weekdays.map((weekday) => (
            <span key={weekday} className="pb-2 text-[10px] font-semibold uppercase text-muted-foreground">
              {weekday}
            </span>
          ))}
          {calendarDays.map((day) => {
            const date = day.format("YYYY-MM-DD");
            return (
              <CalendarDay
                key={date}
                selected={date === selectedDate}
                muted={day.month() !== currentMonth.month()}
                ariaLabel={day.locale(calendarLocale).format("dddd, D MMMM YYYY")}
                onClick={() => setSelectedDate(date)}
              >
                {day.date()}
              </CalendarDay>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
