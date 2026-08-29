import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

// Ghi chú: backend chưa có API cho các tuỳ chọn đặt lịch bên dưới,
// nên đây vẫn là UI tĩnh (chưa lưu được) — sẽ nối API khi backend hỗ trợ.
export const AppointmentSettingsCard = () => {
  const { t } = useTranslation("settings");
  return (
    <Card id="appointments" className="scroll-mt-6 gap-0 py-0 shadow-xs">
      <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
        <CardTitle className="text-lg">{t("appointments.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("appointments.description")}
        </p>
      </CardHeader>
      <CardContent className="px-5 py-2 sm:px-6">
        <div className="grid gap-5 border-b border-border py-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="appointment-duration">
              {t("appointments.duration")}
            </Label>
            <Select defaultValue="45">
              <SelectTrigger id="appointment-duration" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[30, 45, 60, 90].map((value) => <SelectItem key={value} value={String(value)}>{t("common.minutes", { count: value })}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="buffer-time">{t("appointments.buffer")}</Label>
            <Select defaultValue="15">
              <SelectTrigger id="buffer-time" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t("appointments.noBuffer")}</SelectItem>
                {[10, 15, 30].map((value) => <SelectItem key={value} value={String(value)}>{t("common.minutes", { count: value })}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="advance-booking">{t("appointments.advance")}</Label>
            <Select defaultValue="30">
              <SelectTrigger id="advance-booking" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[14, 30, 60, 90].map((value) => <SelectItem key={value} value={String(value)}>{t("common.days", { count: value })}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-semibold">{t("appointments.online")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t("appointments.onlineDescription")}
              </p>
            </div>
            <Switch defaultChecked aria-label={t("appointments.online")} />
          </div>
          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-semibold">{t("appointments.sameDay")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t("appointments.sameDayDescription")}
              </p>
            </div>
            <Switch defaultChecked aria-label={t("appointments.sameDay")} />
          </div>
          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-semibold">{t("appointments.phone")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t("appointments.phoneDescription")}
              </p>
            </div>
            <Switch defaultChecked aria-label={t("appointments.phone")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
