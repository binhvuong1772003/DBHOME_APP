import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type {
  FinancialReportRange,
  FinancialReportResponse,
} from "../types/financialReport";

export async function getFinancialReport(
  shopSlug: string,
  range: FinancialReportRange,
) {
  const { data: response } = await axiosClient.get<
    ApiSuccessResponse<FinancialReportResponse>
  >(`/api/shops/${shopSlug}/financial-report`, {
    params: {
      periodStart: range.start,
      periodEnd: range.end,
    },
  });
  return response.data;
}
