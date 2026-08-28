import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { getIncomeByDayWeekly } from "@/services/incomeService";

export const useWeeklyIncomeByDay = () => {
  const { shopSlug } = useParams();
  const { isLoading, error, run } = useAsync();
  const [weeklyIncomeByDay, setWeeklyIncomeByDay] = useState<
    { day: string; date: string; income: number }[]
  >([]);
  const [weekRange, setWeekRange] = useState("");
  const [date, setDate] = useState("");
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [today, setToday] = useState<{
    fullDate: string;
    income: number;
  } | null>(null);
  useEffect(() => {
    if (!shopSlug) return;
    run(async () => {
      const data = await getIncomeByDayWeekly(shopSlug);
      setWeeklyIncomeByDay(data.days);
      setWeekRange(data.weekRange);
      setWeeklyTotal(data.weeklyTotal);
      setToday(data.today);
      return data;
    }, "Không tải được doanh thu");
  }, [shopSlug]);
  return {
    weeklyIncomeByDay,
    isLoading,
    error,
    weeklyTotal,
    weekRange,
    today,
    date,
  };
};
