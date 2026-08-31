import type {
  FinancialReportPreset,
  FinancialReportRange,
} from "../types/financialReport";

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPresetRange(
  preset: Exclude<FinancialReportPreset, "CUSTOM">,
  now = new Date(),
): FinancialReportRange {
  const year = now.getFullYear();
  const month = now.getMonth();
  const quarterStartMonth = Math.floor(month / 3) * 3;

  if (preset === "THIS_MONTH") {
    return {
      start: toInputDate(new Date(year, month, 1)),
      end: toInputDate(new Date(year, month + 1, 0)),
    };
  }

  if (preset === "PREVIOUS_MONTH") {
    return {
      start: toInputDate(new Date(year, month - 1, 1)),
      end: toInputDate(new Date(year, month, 0)),
    };
  }

  if (preset === "THIS_QUARTER") {
    return {
      start: toInputDate(new Date(year, quarterStartMonth, 1)),
      end: toInputDate(new Date(year, quarterStartMonth + 3, 0)),
    };
  }

  return {
    start: toInputDate(new Date(year, quarterStartMonth - 3, 1)),
    end: toInputDate(new Date(year, quarterStartMonth, 0)),
  };
}

export function formatDateRange(range: FinancialReportRange) {
  if (!range.start || !range.end) return "Select a date range";

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const start = new Date(`${range.start}T00:00:00`);
  const end = new Date(`${range.end}T00:00:00`);
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}
