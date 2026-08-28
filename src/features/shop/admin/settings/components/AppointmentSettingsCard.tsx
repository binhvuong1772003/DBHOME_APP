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

// Ghi chú: backend chưa có API cho các tuỳ chọn đặt lịch bên dưới,
// nên đây vẫn là UI tĩnh (chưa lưu được) — sẽ nối API khi backend hỗ trợ.
export const AppointmentSettingsCard = () => {
  return (
    <Card id="appointments" className="scroll-mt-6 gap-0 py-0 shadow-xs">
      <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
        <CardTitle className="text-lg">Appointment Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure booking rules and scheduling defaults.
        </p>
      </CardHeader>
      <CardContent className="px-5 py-2 sm:px-6">
        <div className="grid gap-5 border-b border-border py-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="appointment-duration">
              Default appointment duration
            </Label>
            <Select defaultValue="45">
              <SelectTrigger id="appointment-duration" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="buffer-time">Buffer time</Label>
            <Select defaultValue="15">
              <SelectTrigger id="buffer-time" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No buffer</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="advance-booking">Maximum advance booking</Label>
            <Select defaultValue="30">
              <SelectTrigger id="advance-booking" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-semibold">Allow online booking</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Customers can book available services from your public shop
                page.
              </p>
            </div>
            <Switch defaultChecked aria-label="Allow online booking" />
          </div>
          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-semibold">Allow same-day booking</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Accept appointments scheduled for the current business day.
              </p>
            </div>
            <Switch defaultChecked aria-label="Allow same-day booking" />
          </div>
          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-semibold">Require customer phone</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                A phone number is required before a booking can be submitted.
              </p>
            </div>
            <Switch defaultChecked aria-label="Require customer phone" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
