import axiosClient from "@/api/axiosClient";
export const getIncomeByDayWeekly = async (shopSlug: string) => {
  const { data: res } = await axiosClient.get(
    `/api/shops/${shopSlug}/appointments/income/weekly`,
  );
  return res.data;
};
