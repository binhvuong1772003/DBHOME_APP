import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import "dayjs/locale/vi";
import dayjs from "dayjs";
interface MiniCalendarProps {
  selectedDate: string;
  calendarDays: dayjs.Dayjs[];
  mutedList: boolean[];
  currentMonth: dayjs.Dayjs;
  setSelectedDate: (date: string) => void;
  // onDateChange: (date: string) => void;
}
function CalendarDay({
  children,
  selected = false,
  muted = false,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  muted?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
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
  mutedList,
  selectedDate,
  currentMonth,
  setSelectedDate,
}: MiniCalendarProps) {
  return (
    <Card className="gap-4 rounded-xl py-5 shadow-xs">
      <CardHeader className="flex-row items-center justify-between px-5">
        <div>
          <CardTitle className="text-sm">
            {currentMonth.locale("vi").format("MMMM YYYY").toUpperCase()}
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Chọn ngày làm việc
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-xs" aria-label="Previous month">
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon-xs" aria-label="Next month">
            <ChevronRight />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <div className="grid grid-cols-7 justify-items-center gap-y-1 text-center">
          <span className="pb-2 text-[10px] font-semibold uppercase text-muted-foreground">
            Mo
          </span>
          <span className="pb-2 text-[10px] font-semibold uppercase text-muted-foreground">
            Tu
          </span>
          <span className="pb-2 text-[10px] font-semibold uppercase text-muted-foreground">
            We
          </span>
          <span className="pb-2 text-[10px] font-semibold uppercase text-muted-foreground">
            Th
          </span>
          <span className="pb-2 text-[10px] font-semibold uppercase text-muted-foreground">
            Fr
          </span>
          <span className="pb-2 text-[10px] font-semibold uppercase text-muted-foreground">
            Sa
          </span>
          <span className="pb-2 text-[10px] font-semibold uppercase text-muted-foreground">
            Su
          </span>
          {calendarDays.map((day) => {
            const date = day.format("YYYY-MM-DD");
            const isSelected = date === selectedDate;

            return (
              <CalendarDay
                key={date}
                selected={isSelected}
                muted={day.month() !== currentMonth.month()}
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
