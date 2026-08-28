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

export const SettingSide = () => {
  return (
    <aside className="sticky top-6 hidden rounded-xl border border-border bg-card p-3 shadow-xs lg:block">
      <div className="px-3 pb-3 pt-1">
        <p className="text-sm font-semibold">Settings</p>
        <p className="mt-1 text-xs text-muted-foreground">Shop configuration</p>
      </div>
      <nav aria-label="Settings navigation" className="space-y-1">
        <a
          href="#general"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="size-4" aria-hidden="true" />
          General
        </a>
        <a
          href="#shop-profile"
          aria-current="page"
          className="flex items-center gap-3 rounded-lg border border-primary/15 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
        >
          <Store className="size-4" aria-hidden="true" />
          Shop Profile
        </a>
        <a
          href="#images-branding"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Palette className="size-4" aria-hidden="true" />
          Images &amp; Branding
        </a>
        <a
          href="#business-information"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Building2 className="size-4" aria-hidden="true" />
          Business Information
        </a>
        <a
          href="#business-hours"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Clock3 className="size-4" aria-hidden="true" />
          Business Hours
        </a>
        <a
          href="#appointments"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          Appointments
        </a>
        <a
          href="#notifications"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-4" aria-hidden="true" />
          Notifications
        </a>
        <a
          href="#security"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          Security
        </a>
      </nav>
    </aside>
  );
};
