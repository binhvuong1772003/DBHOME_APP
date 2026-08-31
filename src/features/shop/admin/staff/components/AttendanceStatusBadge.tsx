import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import type { AttendanceDisplayStatus } from "../types/staffOperations";
import { attendanceStatusClass } from "../utils/staffOperations";

export function AttendanceStatusBadge({ status }: { status: AttendanceDisplayStatus }) {
  const { t } = useTranslation("staffDetail"); const key = status.toLowerCase(); const help = ["ABSENT", "APPROVED_LEAVE", "SCHEDULED_OFF"].includes(status) ? t(`statusHelp.${key}`) : null;
  const badge = <Badge className={attendanceStatusClass(status)}>{t(`statuses.${key}`)}</Badge>;
  if (!help) return badge;
  return <Tooltip><TooltipTrigger asChild><span className="inline-flex cursor-help" tabIndex={0}>{badge}</span></TooltipTrigger><TooltipContent className="max-w-64">{help}</TooltipContent></Tooltip>;
}
