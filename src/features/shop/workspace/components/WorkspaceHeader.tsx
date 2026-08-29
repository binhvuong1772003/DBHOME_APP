import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { StaffAvatar } from "@/components/common/UserAvatar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface WorkspaceHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function WorkspaceHeader({ title, description, actions }: WorkspaceHeaderProps) {
  const { t } = useTranslation("workspace");
  const { user } = useAuth();
  const initials = (user?.name || t("navigation.staffMember"))
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex flex-col gap-4 border-b bg-card/90 px-4 py-4 backdrop-blur sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="size-11 shrink-0" />
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end lg:self-auto">
        {actions}
        <Button variant="ghost" size="icon-lg" aria-label={t("accessibility.viewNotifications")}>
          <Bell aria-hidden="true" />
        </Button>
        <StaffAvatar initials={initials} avatarUrl={user?.avatarUrl} alt={user?.name ?? t("navigation.staffMember")} className="size-10" />
      </div>
    </header>
  );
}
