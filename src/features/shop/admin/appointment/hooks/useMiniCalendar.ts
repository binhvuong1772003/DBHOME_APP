import { useShopContext } from "@/context/ShopContext";
import { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import dayjs from "@/lib/dayjs";
export const useMiniCalendar = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { shops } = useShopContext();
  const currentShop = useMemo(
    () => shops.find((shop) => shop.slug === shopSlug),
    [shops, shopSlug],
  );
  const shopTimezone = currentShop?.timezone;
  const today = useMemo(
    () => (shopTimezone ? dayjs().tz(shopTimezone) : dayjs()),
    [shopTimezone],
  );
  const todayDate = today.format("YYYY-MM-DD");
  const [selectedDate, setSelectedDateState] = useState("");
  const [visibleMonthValue, setVisibleMonthValue] = useState<string | null>(null);
  const effectiveSelectedDate = selectedDate || todayDate;
  const currentMonth = useMemo(
    () =>
      visibleMonthValue
        ? dayjs(`${visibleMonthValue}-01`)
        : dayjs(effectiveSelectedDate).startOf("month"),
    [effectiveSelectedDate, visibleMonthValue],
  );
  const setSelectedDate = useCallback((date: string) => {
    setSelectedDateState(date);
    setVisibleMonthValue(date.slice(0, 7));
  }, []);
  const goToPreviousMonth = useCallback(() => {
    setVisibleMonthValue(currentMonth.subtract(1, "month").format("YYYY-MM"));
  }, [currentMonth]);
  const goToNextMonth = useCallback(() => {
    setVisibleMonthValue(currentMonth.add(1, "month").format("YYYY-MM"));
  }, [currentMonth]);
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDay = (startOfMonth.day() + 6) % 7;
  const daysInMonth = currentMonth.daysInMonth();
  const calendarDays = [];
  for (let i = startDay; i > 0; i--) {
    calendarDays.push(startOfMonth.subtract(i, "day"));
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(currentMonth.date(i));
  }
  let next = 1;
  for (let i = 42 - calendarDays.length; i > 0; i--) {
    calendarDays.push(endOfMonth.add(next, "day"));
    next++;
  }
  const mutedList = calendarDays.map((day) => {
    return day.month() !== currentMonth.month();
  });
  return {
    calendarDays,
    mutedList,
    selectedDate: effectiveSelectedDate,
    setSelectedDate,
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    todayDate,
  };
};
