import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, Check, Clock3, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "@/lib/dayjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getStaffInitials, getStaffName } from "../../staff/constants/staff";
import { countStaffAppointments } from "../services/workforceService";
import type { AdminTimeOffRequest } from "../types/workforce";
import { enumerateDateRange } from "../utils/schedule";

interface TimeOffRequestSheetProps {
  request: AdminTimeOffRequest;
  open: boolean;
  isReviewing: boolean;
  onOpenChange: (open: boolean) => void;
  onReview: (requestId: string, input: { status: "APPROVED" | "REJECTED"; rejectReason?: string }) => Promise<boolean>;
}

export function TimeOffRequestSheet({ request, open, isReviewing, onOpenChange, onReview }: TimeOffRequestSheetProps) {
  const { t, i18n } = useTranslation(["workforce", "common", "staff"]);
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showReasonError, setShowReasonError] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState<number | null>(null);
  const [isCheckingAppointments, setIsCheckingAppointments] = useState(request.status === "PENDING");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";

  useEffect(() => {
    if (!open || !shopSlug || request.status !== "PENDING") return;
    let cancelled = false;
    countStaffAppointments(shopSlug, request.shopStaff.userId, enumerateDateRange(request.offDate, request.offDateEnd))
      .then((count) => { if (!cancelled) setAppointmentCount(count); })
      .catch(() => { if (!cancelled) setAppointmentCount(null); })
      .finally(() => { if (!cancelled) setIsCheckingAppointments(false); });
    return () => { cancelled = true; };
  }, [open, request, shopSlug]);

  const name = getStaffName(request.shopStaff);
  const avatar = request.shopStaff.avatarUrl ?? request.shopStaff.user?.avatarUrl ?? undefined;
  const start = dayjs(request.offDate);
  const end = dayjs(request.offDateEnd ?? request.offDate);
  const days = Math.max(1, end.startOf("day").diff(start.startOf("day"), "day") + 1);
  const dateLabel = request.offDateEnd
    ? `${start.toDate().toLocaleDateString(locale)} – ${end.toDate().toLocaleDateString(locale)}`
    : start.toDate().toLocaleDateString(locale);

  const handleReview = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !rejectReason.trim()) {
      setShowReasonError(true);
      return;
    }
    const succeeded = await onReview(request.id, { status, rejectReason: status === "REJECTED" ? rejectReason.trim() : undefined });
    if (succeeded) onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="border-b px-6 py-5 pr-14">
          <SheetTitle>{rejecting ? t("timeOff.rejectTitle") : t("timeOff.reviewTitle")}</SheetTitle>
          <SheetDescription>{rejecting ? t("timeOff.rejectDescription") : t("timeOff.reviewDescription", { name })}</SheetDescription>
        </SheetHeader>
        <SheetClose asChild><Button type="button" variant="ghost" size="icon-sm" className="absolute right-3 top-3 size-11 rounded-full sm:right-4 sm:top-4 sm:size-8" aria-label={t("common:actions.close")}><X aria-hidden="true" /></Button></SheetClose>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-12"><AvatarImage src={avatar} alt={name} /><AvatarFallback className="bg-primary/10 font-semibold text-primary">{getStaffInitials(request.shopStaff)}</AvatarFallback></Avatar>
            <div className="min-w-0"><p className="truncate font-semibold">{name}</p><p className="mt-0.5 text-sm text-muted-foreground">{t(`staff:roles.${request.shopStaff.role.toLowerCase()}`)}</p></div>
          </div>

          {!rejecting ? (
            <>
              <dl className="mt-6 space-y-3">
                <div className="rounded-xl border bg-muted/25 p-4"><dt className="text-xs font-medium text-muted-foreground">{t("timeOff.requestedDates")}</dt><dd className="mt-1.5 flex items-center gap-2 text-sm font-semibold"><CalendarDays className="size-4 text-primary" aria-hidden="true" />{dateLabel}<Badge className="ml-auto bg-muted">{t("timeOff.days", { count: days })}</Badge></dd></div>
                <div className="rounded-xl border bg-muted/25 p-4"><dt className="text-xs font-medium text-muted-foreground">{t("timeOff.reason")}</dt><dd className="mt-1.5 text-sm leading-6">{request.reason || t("timeOff.noReason")}</dd></div>
                <div className="rounded-xl border bg-muted/25 p-4"><dt className="text-xs font-medium text-muted-foreground">{t("timeOff.requestSubmitted")}</dt><dd className="mt-1.5 flex items-center gap-2 text-sm"><Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />{new Date(request.createdAt).toLocaleDateString(locale)}</dd></div>
              </dl>

              {request.status === "PENDING" && (
                <div className="mt-6">
                  {isCheckingAppointments ? <div className="space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-16 w-full" /></div> : appointmentCount !== null && (
                    <Alert className={appointmentCount > 0 ? "border-destructive/30 bg-destructive/5" : "bg-muted/30"}>
                      <AlertTriangle aria-hidden="true" />
                      <AlertTitle>{t("timeOff.appointmentCount", { count: appointmentCount })}</AlertTitle>
                      {appointmentCount > 0 && <AlertDescription>{t("timeOff.conflictWarning")}</AlertDescription>}
                    </Alert>
                  )}
                </div>
              )}
            </>
          ) : (
            <Field className="mt-2" data-invalid={showReasonError || undefined}>
              <FieldLabel htmlFor="reject-reason">{t("timeOff.rejectReason")}</FieldLabel>
              <Textarea id="reject-reason" value={rejectReason} placeholder={t("timeOff.rejectPlaceholder")} className="min-h-28" aria-invalid={showReasonError || undefined} aria-describedby={showReasonError ? "reject-reason-error" : undefined} onChange={(event) => { setRejectReason(event.target.value); if (event.target.value.trim()) setShowReasonError(false); }} />
              {showReasonError && <FieldError id="reject-reason-error">{t("timeOff.rejectRequired")}</FieldError>}
            </Field>
          )}
        </div>

        {request.status === "PENDING" && <SheetFooter className="border-t px-6 py-4 sm:flex-row sm:justify-end">
          {rejecting ? <><Button type="button" variant="outline" className="min-h-11" disabled={isReviewing} onClick={() => setRejecting(false)}>{t("common:actions.cancel")}</Button><Button type="button" variant="destructive" className="min-h-11" disabled={isReviewing} onClick={() => void handleReview("REJECTED")}>{isReviewing ? t("timeOff.rejecting") : t("timeOff.reject")}</Button></> : <><Button type="button" variant="outline" className="min-h-11" disabled={isReviewing} onClick={() => setRejecting(true)}>{t("timeOff.reject")}</Button><Button type="button" className="min-h-11" disabled={isReviewing} onClick={() => void handleReview("APPROVED")}><Check aria-hidden="true" />{isReviewing ? t("timeOff.approving") : t("timeOff.approve")}</Button></>}
        </SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
