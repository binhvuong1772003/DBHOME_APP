import {
  Building2,
  CalendarDays,
  Clock3,
  Palette,
  Settings,
  ShieldCheck,
  Store,
  Bell,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const SettingSide = () => {
  const { t } = useTranslation("settings");
  return (
    <aside className="sticky top-6 hidden rounded-xl border border-border bg-card p-3 shadow-xs lg:block">
      <div className="px-3 pb-3 pt-1">
        <p className="text-sm font-semibold">{t("sections.title")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("sections.subtitle")}</p>
      </div>
      <nav aria-label={t("sections.navigation")} className="space-y-1">
        <a
          href="#general"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="size-4" aria-hidden="true" />
          {t("sections.general")}
        </a>
        <a
          href="#shop-profile"
          aria-current="page"
          className="flex items-center gap-3 rounded-lg border border-primary/15 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
        >
          <Store className="size-4" aria-hidden="true" />
          {t("sections.profile")}
        </a>
        <a
          href="#images-branding"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Palette className="size-4" aria-hidden="true" />
          {t("sections.images")}
        </a>
        <a
          href="#business-information"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Building2 className="size-4" aria-hidden="true" />
          {t("sections.business")}
        </a>
        <a
          href="#business-hours"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Clock3 className="size-4" aria-hidden="true" />
          {t("sections.hours")}
        </a>
        <a
          href="#appointments"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          {t("sections.appointments")}
        </a>
        <a
          href="#notifications"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-4" aria-hidden="true" />
          {t("sections.notifications")}
        </a>
        <a
          href="#security"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          {t("sections.security")}
        </a>
      </nav>
    </aside>
  );
};
