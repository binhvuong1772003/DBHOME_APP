import { ArrowRight, CalendarDays } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StaffWorkspaceAppointment } from "../types/workspace";
import { StaffAppointmentCard } from "./StaffAppointmentCard";
import { ScheduleEmptyState, ScheduleErrorState, ScheduleLoadingState } from "./WorkspaceStates";
import { useTranslation } from "react-i18next";

interface TodayScheduleProps {
  appointments: StaffWorkspaceAppointment[];
  nextAppointment?: StaffWorkspaceAppointment;
  isLoading: boolean;
  hasError: boolean;
}

export function TodaySchedule({ appointments, nextAppointment, isLoading, hasError }: TodayScheduleProps) {
  const { t } = useTranslation("workspace");
  const navigate = useNavigate();
  const { shopSlug } = useParams<{ shopSlug: string }>();

  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-xs">
      <CardHeader className="border-b px-4 py-5 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-base">{t("schedule.todayTitle")}</CardTitle>
            <CardDescription className="mt-1">{t("schedule.todayDescription")}</CardDescription>
          </div>
        </div>
        <CardAction>
          <Button
            variant="outline"
            className="h-11"
            onClick={() => navigate(`/shops/${shopSlug}/workspace/schedule`)}
          >
            {t("schedule.fullSchedule")}
            <ArrowRight aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <ScheduleLoadingState />
        ) : hasError ? (
          <ScheduleErrorState />
        ) : appointments.length === 0 ? (
          <ScheduleEmptyState />
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <StaffAppointmentCard
                key={appointment.id}
                appointment={appointment}
                highlighted={appointment.id === nextAppointment?.id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
