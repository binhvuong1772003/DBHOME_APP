import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { BusinessHourItem } from "@/validations/shopSchema";
import { useTranslation } from "react-i18next";

interface BusinessHoursSettingProps {
  businessHours: BusinessHourItem[];
  weekDays: { value: number; label: string }[];
  updateBusinessHourDay: (
    dayOfWeek: number,
    patch: Partial<BusinessHourItem>,
  ) => void;
}

export const BusinessHoursSetting = ({
  businessHours,
  weekDays,
  updateBusinessHourDay,
}: BusinessHoursSettingProps) => {
  const { t } = useTranslation("settings");
  return (
    <Card id="business-hours" className="scroll-mt-6 gap-0 py-0 shadow-xs">
      <CardHeader className="border-b border-border px-5 py-5 sm:px-6">
        <CardTitle className="text-lg">{t("hours.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("hours.description")}
        </p>
      </CardHeader>
      <CardContent className="divide-y divide-border px-5 sm:px-6">
        {weekDays.map(({ value }) => {
          const weekdays = t("hours.weekdays", { returnObjects: true }) as string[];
          const label = weekdays[value];
          const day = businessHours.find((item) => item.dayOfWeek === value);
          if (!day) return null;
          return (
            <div
              key={value}
              className="grid gap-3 py-4 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center"
            >
              <p className="text-sm font-semibold">{label}</p>
              {day.isClosed ? (
                <div className="flex h-9 items-center rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground">
                  {t("common.closed")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={day.openTime}
                    className="min-w-0"
                    onChange={(e) =>
                      updateBusinessHourDay(value, {
                        openTime: e.target.value,
                      })
                    }
                  />
                  <span className="text-muted-foreground">—</span>
                  <Input
                    type="time"
                    value={day.closeTime}
                    className="min-w-0"
                    onChange={(e) =>
                      updateBusinessHourDay(value, {
                        closeTime: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs font-medium text-muted-foreground">
                  {day.isClosed ? t("common.closed") : t("common.open")}
                </span>
                <Switch
                  checked={!day.isClosed}
                  onCheckedChange={(checked) =>
                    updateBusinessHourDay(value, { isClosed: !checked })
                  }
                  aria-label={t("hours.toggle", { day: label })}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
