import { useShopContext } from "@/context/ShopContext";
import { useMemo, useState, useEffect } from "react";
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
  const [selectedDate, setSelectedDate] = useState("");
  useEffect(() => {
    if (!shopTimezone || selectedDate) return;

    setSelectedDate(dayjs().tz(shopTimezone).format("YYYY-MM-DD"));
  }, [shopTimezone, selectedDate]);
  const currentMonth = selectedDate ? dayjs(selectedDate) : dayjs();
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
    selectedDate,
    setSelectedDate,
    currentMonth,
  };
};
