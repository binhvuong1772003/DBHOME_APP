import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Bell, LogOut, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { StaffAvatar } from "@/components/common/UserAvatar";
import { ModeToggle } from "@/components/common/ModeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useShops } from "@/features/shop/hooks/useShops";
import { staffNavigation } from "../constants/workspace-navigation";

const menuButtonClass =
  "relative h-11 min-w-0 !text-muted-foreground data-[active=true]:bg-primary/10 " +
  "data-[active=true]:!text-primary data-[active=true]:font-semibold " +
  "data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 " +
  "data-[active=true]:before:left-0 data-[active=true]:before:w-[3px] " +
  "data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-primary";

export function WorkspaceAccess() {
  return <Outlet />;
}

function StaffSidebar() {
  const { t } = useTranslation(["workspace", "common"]);
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { currentShop } = useShops();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = `/shops/${shopSlug}/workspace`;
  const initials = (user?.name || t("navigation.staffMember"))
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="overflow-x-hidden [&_[data-slot='sidebar-inner']]:bg-card">
      <SidebarHeader className="gap-3 p-3">
        <button
          type="button"
          onClick={() => navigate(basePath)}
          className="flex min-h-11 items-center gap-2.5 rounded-lg px-1 text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 group-data-[collapsible=icon]:justify-center"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Scissors className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-bold text-primary">{t("navigation.title")}</span>
            <span className="block truncate text-xs text-muted-foreground">{currentShop?.name ?? t("navigation.fallbackSalon")}</span>
          </span>
        </button>
      </SidebarHeader>

      <SidebarSeparator />
      <SidebarContent className="overflow-x-hidden px-2">
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation.group")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {staffNavigation.map((item) => {
                const label = t(item.labelKey);
                const path = `${basePath}${item.path}`;
                const isActive = item.path === ""
                  ? location.pathname === basePath || location.pathname === `${basePath}/`
                  : location.pathname.startsWith(path);
                return (
                  <SidebarMenuItem key={item.labelKey}>
                    <SidebarMenuButton
                      tooltip={label}
                      isActive={isActive}
                      onClick={() => navigate(path)}
                      className={`${menuButtonClass} ${item.emphasized && !isActive ? "text-foreground" : ""}`}
                    >
                      <item.icon className={item.emphasized ? "text-primary" : "text-foreground"} aria-hidden="true" />
                      <span className="truncate">{label}</span>
                      {item.emphasized && (
                        <span className="ml-auto size-1.5 rounded-full bg-primary group-data-[collapsible=icon]:hidden" aria-hidden="true" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t p-3">
        <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
          <LanguageSwitcher />
          <ModeToggle />
          <Button variant="ghost" size="icon" className="size-11" aria-label={t("accessibility.notifications")}>
            <Bell aria-hidden="true" />
          </Button>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={user?.name ?? t("navigation.profileLabel")}
              onClick={() => navigate(`${basePath}/profile`)}
            >
              <StaffAvatar initials={initials} avatarUrl={user?.avatarUrl} alt={user?.name ?? t("navigation.staffMember")} className="size-9" />
              <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-sm font-semibold">{user?.name ?? t("navigation.staffMember")}</span>
                <span className="block truncate text-xs text-muted-foreground">{user?.email ?? t("navigation.staffMember")}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t("common:actions.logout")} onClick={handleLogout}>
              <LogOut aria-hidden="true" />
              <span>{t("common:actions.logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function WorkspaceShell() {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <main id="staff-workspace-main" className="min-w-0 flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
