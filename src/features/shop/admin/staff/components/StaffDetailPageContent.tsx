import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import dayjs from "@/lib/dayjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShopMembership } from "@/features/shop/membership/hooks/useShopMembership";
import { updateStaff } from "../services/staffService";
import type { UpdateStaffInput } from "../types/staff";
import { useStaffOperations } from "../hooks/useStaffOperations";
import { StaffFormSheet } from "./StaffFormSheet";
import { StaffDetailHeader } from "./StaffDetailHeader";
import { StaffOverviewTab } from "./StaffOverviewTab";
import { StaffScheduleTab } from "./StaffScheduleTab";
import { StaffAttendanceTab } from "./StaffAttendanceTab";
import { StaffTimeOffTab } from "./StaffTimeOffTab";
import { EditScheduleSheet } from "../../workforce/components/EditScheduleSheet";
import type { Staff, StaffScheduleDay, StaffScheduleOffDay } from "../types/staff";

export default function StaffDetailPageContent() {
  const { t, i18n } = useTranslation(["staffDetail", "staff"]); const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US"; const navigate = useNavigate(); const { membership } = useShopMembership();
  const data = useStaffOperations(); const [editing, setEditing] = useState(false); const [editingSchedule, setEditingSchedule] = useState(false); const [updating, setUpdating] = useState(false);
  const today = data.overviewRecords.find((item) => item.date === dayjs().format("YYYY-MM-DD"));
  const handleUpdate = async (input: UpdateStaffInput) => { if (!data.staff) return false; setUpdating(true); try { await updateStaff(data.shopSlug, data.staff.id, membership?.role === "OWNER" ? input : { isActive: input.isActive }); await data.reload(); setEditing(false); toast.success(t("staff:notifications.updateSuccess")); return true; } catch { toast.error(t("staff:notifications.updateError")); return false; } finally { setUpdating(false); } };
  if (data.loading) return <main className="p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-[1500px] space-y-5"><Skeleton className="h-8 w-40" /><Skeleton className="h-32" /><Skeleton className="h-12" /><Skeleton className="h-80" /></div></main>;
  if (data.error && !data.staff) return <main className="p-4 sm:p-6 lg:p-8"><Card className="mx-auto max-w-2xl"><CardContent className="flex min-h-64 flex-col items-center justify-center text-center"><p className="font-semibold">{t("loadError")}</p><p className="mt-2 text-sm text-muted-foreground" role="alert">{data.error}</p><Button variant="outline" className="mt-4" onClick={() => void data.reload()}>{t("retry")}</Button></CardContent></Card></main>;
  if (!data.staff) return null;
  return <main className="min-h-full bg-background text-foreground"><div className="mx-auto w-full max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8"><StaffDetailHeader staff={data.staff} today={today} onBack={() => navigate(`/shops/${data.shopSlug}/admin/staff`)} onEdit={() => setEditing(true)} onEditSchedule={() => setEditingSchedule(true)} />{data.error && <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"><span>{data.error}</span><Button variant="outline" size="sm" onClick={() => void data.reload()}>{t("retry")}</Button></div>}<Tabs defaultValue="overview"><div className="max-w-full overflow-x-auto"><TabsList className="min-w-max"><TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger><TabsTrigger value="schedule">{t("tabs.schedule")}</TabsTrigger><TabsTrigger value="attendance">{t("tabs.attendance")}</TabsTrigger><TabsTrigger value="time-off">{t("tabs.timeOff")}</TabsTrigger></TabsList></div><TabsContent value="overview"><StaffOverviewTab records={data.overviewRecords} pendingCount={data.timeOffMeta.statusCounts.PENDING} locale={locale} /></TabsContent><TabsContent value="schedule"><StaffScheduleTab staff={data.staff} schedule={data.schedule} offDays={data.scheduleOffDays} records={data.records} locale={locale} saving={data.savingSchedule} onSave={data.saveSchedule} /></TabsContent><TabsContent value="attendance"><StaffAttendanceTab records={data.records} loading={data.attendanceLoading} preset={data.preset} setPreset={data.setPreset} customFrom={data.customFrom} setCustomFrom={data.setCustomFrom} customTo={data.customTo} setCustomTo={data.setCustomTo} locale={locale} /></TabsContent><TabsContent value="time-off"><StaffTimeOffTab requests={data.timeOff} meta={data.timeOffMeta} page={data.timeOffPage} setPage={data.setTimeOffPage} status={data.timeOffStatus} setStatus={data.setTimeOffStatus} loading={data.timeOffLoading} reviewingId={data.reviewingId} locale={locale} onReview={data.reviewTimeOff} /></TabsContent></Tabs></div>
    <StaffFormSheet mode="EDIT" staff={data.staff} open={editing} canChangeRole={membership?.role === "OWNER"} isSubmitting={updating} onOpenChange={setEditing} onInvite={async () => false} onUpdate={handleUpdate} />
    {editingSchedule && <StaffScheduleTabEditor staff={data.staff} schedule={data.schedule} offDays={data.scheduleOffDays} saving={data.savingSchedule} onOpenChange={setEditingSchedule} onSave={data.saveSchedule} />}
  </main>;
}

function StaffScheduleTabEditor({ staff, schedule, offDays, saving, onOpenChange, onSave }: { staff: Staff; schedule: StaffScheduleDay[]; offDays: StaffScheduleOffDay[]; saving: boolean; onOpenChange: (open: boolean) => void; onSave: (staffId: string, schedule: StaffScheduleDay[]) => Promise<boolean> }) { return <EditScheduleSheet open item={{ staff, schedule: { shopId: staff.shopId, staffId: staff.id, schedule, offDays } }} isSaving={saving} onOpenChange={onOpenChange} onSave={onSave} />; }
