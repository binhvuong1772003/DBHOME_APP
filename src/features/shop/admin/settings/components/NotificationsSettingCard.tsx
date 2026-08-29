import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

// Ghi chú: backend chưa có API lưu tuỳ chọn thông báo, đây vẫn là UI tĩnh.
export const NotificationsSettingCard = () => {
  const { t } = useTranslation("settings");
  return (
    <Card id="notifications" className="scroll-mt-6 gap-0 py-0 shadow-xs">
      <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
        <CardTitle className="text-lg">{t("notifications.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which shop and customer events should send notifications.
        </p>
      </CardHeader>
      <CardContent className="divide-y divide-border px-5 sm:px-6">
        <div className="flex items-center justify-between gap-6 py-5">
          <div>
            <p className="text-sm font-semibold">{t("notifications.new")}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Get notified when a new appointment is created.
            </p>
          </div>
          <Switch defaultChecked aria-label={t("notifications.new")} />
        </div>
        <div className="flex items-center justify-between gap-6 py-5">
          <div>
            <p className="text-sm font-semibold">{t("notifications.confirmed")}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Get notified when an appointment is confirmed.
            </p>
          </div>
          <Switch
            defaultChecked
            aria-label={t("notifications.confirmed")}
          />
        </div>
        <div className="flex items-center justify-between gap-6 py-5">
          <div>
            <p className="text-sm font-semibold">{t("notifications.cancelled")}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Get notified when an appointment is cancelled.
            </p>
          </div>
          <Switch
            defaultChecked
            aria-label={t("notifications.cancelled")}
          />
        </div>
        <div className="flex items-center justify-between gap-6 py-5">
          <div>
            <p className="text-sm font-semibold">{t("notifications.reminder")}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Send appointment reminders to customers.
            </p>
          </div>
          <Switch
            defaultChecked
            aria-label={t("notifications.reminder")}
          />
        </div>
      </CardContent>
    </Card>
  );
};
