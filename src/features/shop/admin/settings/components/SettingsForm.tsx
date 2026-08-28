import { Loader2, Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppointmentSettingsCard } from "./AppointmentSettingsCard";
import { BusinessHoursSetting } from "./BusinessHoursSetting";
import { BusinessInformationSetting } from "./BusinessInformationSetting";
import { ImagesBrandingSetting } from "./ImagesBrandingSetting";
import { NotificationsSettingCard } from "./NotificationsSettingCard";
import { ProfileSetting } from "./ProfileSetting";
import { SecuritySettingCard } from "./SecuritySettingCard";
import { SettingSide } from "./settingSide";
import { useSetting } from "../hooks/useSettings";

const SECTIONS = [
  ["shop-profile", "Hồ sơ cửa hàng"], ["images-branding", "Hình ảnh & thương hiệu"],
  ["business-information", "Thông tin kinh doanh"], ["business-hours", "Giờ hoạt động"],
  ["appointments", "Lịch hẹn"], ["notifications", "Thông báo"], ["security", "Bảo mật"],
] as const;

export default function SettingsForm() {
  const settings = useSetting();
  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="min-h-full bg-background text-foreground" aria-busy={settings.loading}>
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Settings className="size-3.5" aria-hidden="true" /> Quản trị cửa hàng
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cài đặt</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Quản lý thông tin cửa hàng, thương hiệu và các tùy chọn kinh doanh.
            </p>
          </div>
          <Button type="button" className="w-full sm:w-auto" disabled={!settings.isDirty || settings.isSaving || settings.loading} onClick={settings.handleSave}>
            {settings.isSaving ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
            {settings.isSaving ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </header>

        <div className="mt-6 lg:hidden">
          <Label htmlFor="settings-section" className="sr-only">Chọn mục cài đặt</Label>
          <Select defaultValue="shop-profile" onValueChange={scrollToSection}>
            <SelectTrigger id="settings-section" className="w-full bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>{SECTIONS.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <SettingSide />
          <div className="min-w-0 space-y-6">
            {settings.loading ? (
              <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-card" role="status">
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
                <span className="ml-3 text-sm text-muted-foreground">Đang tải cài đặt...</span>
              </div>
            ) : <>
              <ProfileSetting currentShop={settings.currentShop} form={settings.form} logo={settings.logo} logoUrl={settings.logoUrl} onLogoChange={settings.handleLogoChange} />
              <ImagesBrandingSetting currentShop={settings.currentShop} background={settings.background} coverUrl={settings.coverUrl} onBackgroundChange={settings.handleBackgroundChange} />
              <BusinessInformationSetting form={settings.form} provinces={settings.provinces} districts={settings.districts} provinceCode={settings.provinceCode} districtCode={settings.districtCode} onProvinceChange={settings.onProvinceChange} onDistrictChange={settings.onDistrictChange} />
              <BusinessHoursSetting businessHours={settings.businessHours} weekDays={settings.weekDays} updateBusinessHourDay={settings.updateBusinessHourDay} />
              <AppointmentSettingsCard />
              <NotificationsSettingCard />
              <SecuritySettingCard email={settings.form.watch("email")} />
            </>}
          </div>
        </div>
      </div>
    </main>
  );
}
