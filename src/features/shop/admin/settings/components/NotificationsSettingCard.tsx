import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// Ghi chú: backend chưa có API lưu tuỳ chọn thông báo, đây vẫn là UI tĩnh.
export const NotificationsSettingCard = () => {
  return (
    <Card id="notifications" className="scroll-mt-6 gap-0 py-0 shadow-xs">
      <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which shop and customer events should send notifications.
        </p>
      </CardHeader>
      <CardContent className="divide-y divide-border px-5 sm:px-6">
        <div className="flex items-center justify-between gap-6 py-5">
          <div>
            <p className="text-sm font-semibold">New appointment</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Get notified when a new appointment is created.
            </p>
          </div>
          <Switch defaultChecked aria-label="New appointment notifications" />
        </div>
        <div className="flex items-center justify-between gap-6 py-5">
          <div>
            <p className="text-sm font-semibold">Appointment confirmed</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Get notified when an appointment is confirmed.
            </p>
          </div>
          <Switch
            defaultChecked
            aria-label="Appointment confirmed notifications"
          />
        </div>
        <div className="flex items-center justify-between gap-6 py-5">
          <div>
            <p className="text-sm font-semibold">Appointment cancelled</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Get notified when an appointment is cancelled.
            </p>
          </div>
          <Switch
            defaultChecked
            aria-label="Appointment cancelled notifications"
          />
        </div>
        <div className="flex items-center justify-between gap-6 py-5">
          <div>
            <p className="text-sm font-semibold">Appointment reminder</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Send appointment reminders to customers.
            </p>
          </div>
          <Switch
            defaultChecked
            aria-label="Appointment reminder notifications"
          />
        </div>
      </CardContent>
    </Card>
  );
};
