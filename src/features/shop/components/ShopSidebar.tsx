import {
  CalendarDays,
  CalendarOff,
  CalendarRange,
  Check,
  ChevronsUpDown,
  ChartNoAxesCombined,
  CircleUserRound,
  CreditCard,
  LayoutDashboard,
  Loader2,
  LogOut,
  Scissors,
  Settings,
  Store,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useShops } from "@/features/shop/hooks/useShops";
import { useShopMembership } from "@/features/shop/membership/hooks/useShopMembership";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ModeToggle } from "@/components/common/ModeToggle";
import { NotificationBell } from "@/features/shop/components/NotificationBell";
import type { Shop } from "@/context/ShopContext";

type NavigationItem = {
  labelKey: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  path: string;
  exact?: boolean;
  managerOnly?: boolean;
};

const navigationGroups: Array<{
  labelKey: string;
  items: NavigationItem[];
}> = [
  {
    labelKey: "groups.overview",
    items: [
      { labelKey: "nav.dashboard", icon: LayoutDashboard, path: "", exact: true },
    ],
  },
  {
    labelKey: "groups.operations",
    items: [
      { labelKey: "nav.appointments", icon: CalendarDays, path: "/appointments" },
      {
        labelKey: "nav.customers",
        icon: UsersRound,
        path: "/customers",
        managerOnly: true,
      },
      { labelKey: "nav.services", icon: Scissors, path: "/services" },
    ],
  },
  {
    labelKey: "groups.people",
    items: [
      { labelKey: "nav.staff", icon: UsersRound, path: "/staff" },
      {
        labelKey: "nav.schedule",
        icon: CalendarRange,
        path: "/staff-schedule",
        managerOnly: true,
      },
      {
        labelKey: "nav.timeOff",
        icon: CalendarOff,
        path: "/time-off",
        managerOnly: true,
      },
    ],
  },
  {
    labelKey: "groups.finance",
    items: [
      {
        labelKey: "nav.payments",
        icon: CreditCard,
        path: "/payments",
        managerOnly: true,
      },
      {
        labelKey: "nav.payroll",
        icon: WalletCards,
        path: "/payroll",
        managerOnly: true,
      },
      {
        labelKey: "nav.financialReport",
        icon: ChartNoAxesCombined,
        path: "/financial-report",
        managerOnly: true,
      },
    ],
  },
];

const menuButtonClass =
  "min-h-11 h-auto min-w-0 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground " +
  "transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring " +
  "data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary " +
  "relative data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:left-0 " +
  "data-[active=true]:before:w-0.5 data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-primary";

const normalizePath = (path: string) => {
  const normalized = path.replace(/\/+$/, "");
  return normalized || "/";
};

const isRouteActive = (pathname: string, target: string, exact = false) => {
  const current = normalizePath(pathname);
  const normalizedTarget = normalizePath(target);
  return exact
    ? current === normalizedTarget
    : current === normalizedTarget || current.startsWith(`${normalizedTarget}/`);
};

function getShopTypeLabel(
  shop: Shop | undefined,
  translate: (key: string) => string,
) {
  return shop?.type
    ? translate(`shop.type.${shop.type}`)
    : translate("shop.type.default");
}

export const ShopSideBar = () => {
  const { t } = useTranslation([
    "sidebar",
    "navbar",
  ]);
  const { membership, isLoading: membershipLoading } = useShopMembership();
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { shops, currentShop, setCurrentShop } = useShops();
  const { user, logout } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();
  const [loggingOut, setLoggingOut] = useState(false);

  const routeShop = shops.find((shop) => shop.slug === shopSlug);
  const activeShop = shopSlug ? routeShop : currentShop;
  const canManageShop =
    membership?.role === "OWNER" || membership?.role === "ADMIN";
  const basePath = shopSlug ? `/shops/${shopSlug}/admin` : "";

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleShopChange = (shop: Shop) => {
    setCurrentShop(shop);
    closeOnMobile();
    if (shop.slug !== shopSlug) navigate(`/shops/${shop.slug}/admin`);
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const serverLogoutSucceeded = await logout();
      if (!serverLogoutSucceeded) toast.error(t("navbar:account.logoutError"));
      navigate("/", { replace: true });
    } catch {
      toast.error(t("navbar:account.logoutError"));
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const renderNavigationItem = (item: NavigationItem) => {
    if (!basePath) return null;
    if (item.managerOnly && (membershipLoading || !canManageShop)) return null;
    const target = `${basePath}${item.path}`;
    const active = isRouteActive(pathname, target, item.exact);
    const Icon = item.icon;

    return (
      <SidebarMenuItem key={item.labelKey}>
        <SidebarMenuButton
          asChild
          isActive={active}
          tooltip={t(`sidebar:${item.labelKey}`)}
          className={menuButtonClass}
        >
          <NavLink
            to={target}
            aria-current={active ? "page" : undefined}
            onClick={closeOnMobile}
          >
            <Icon className="size-4 shrink-0 text-current" strokeWidth={2} aria-hidden="true" />
            <span className="truncate">{t(`sidebar:${item.labelKey}`)}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const roleLabel = membership
    ? t(
        `sidebar:account.role${membership.role === "OWNER" ? "Owner" : membership.role === "ADMIN" ? "Admin" : "Staff"}`,
      )
    : "";

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-x-hidden border-sidebar-border [&_[data-slot='sidebar-inner']]:bg-card"
    >
      <SidebarHeader className="gap-3 border-b border-sidebar-border p-3">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <Link
            to="/"
            aria-label={t("sidebar:brand.home")}
            onClick={closeOnMobile}
            className="flex min-w-0 items-center gap-2.5 group-data-[collapsible=icon]:hidden"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              S
            </span>
            <span className="truncate text-base font-bold tracking-wide text-primary">
              {t("sidebar:brand.name")}
            </span>
          </Link>
          <SidebarTrigger
            aria-label={t("sidebar:toggle")}
            className="min-h-11 min-w-11 shrink-0"
          />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="min-h-11 w-full rounded-lg border border-border/70 bg-background/60"
                  tooltip={activeShop?.name ?? t("sidebar:shop.noShop")}
                >
                  <Avatar className="size-8 shrink-0 rounded-lg">
                    <AvatarImage
                      src={activeShop?.logoUrl ?? undefined}
                      alt={
                        activeShop
                          ? t("sidebar:shop.logoAlt", { name: activeShop.name })
                          : t("sidebar:shop.noShop")
                      }
                    />
                    <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">
                      <Store className="size-4" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {activeShop?.name ?? t("sidebar:shop.noShop")}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {getShopTypeLabel(activeShop ?? undefined, (key) => t(`sidebar:${key}`))}
                    </p>
                  </div>
                  <ChevronsUpDown
                    className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
                    aria-hidden="true"
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-64">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {t("sidebar:shop.choose")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {shops.length === 0 ? (
                  <DropdownMenuLabel className="font-normal text-muted-foreground">
                    {t("sidebar:empty")}
                  </DropdownMenuLabel>
                ) : (
                  shops.map((shop) => (
                    <DropdownMenuItem
                      key={shop.id}
                      onSelect={() => handleShopChange(shop)}
                      className="min-h-11"
                    >
                      <Avatar className="size-7 rounded-md">
                        <AvatarImage
                          src={shop.logoUrl ?? undefined}
                          alt={t("sidebar:shop.logoAlt", { name: shop.name })}
                        />
                        <AvatarFallback className="rounded-md bg-muted">
                          <Store className="size-3.5" aria-hidden="true" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1 truncate">{shop.name}</span>
                      {shop.id === activeShop?.id ? (
                        <Check className="ml-auto size-4 text-primary" aria-hidden="true" />
                      ) : null}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {basePath ? (
          <>
            {navigationGroups.map((group, index) => {
              const visibleItems = group.items.filter(
                (item) =>
                  !item.managerOnly || (!membershipLoading && canManageShop),
              );
              if (visibleItems.length === 0) return null;
              return (
                <div key={group.labelKey}>
                  {index > 0 ? <SidebarSeparator className="my-2" /> : null}
                  <SidebarGroup className="p-1">
                    <SidebarGroupLabel className="h-7 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground group-data-[collapsible=icon]:-mt-7 group-data-[collapsible=icon]:opacity-0">
                      {t(`sidebar:${group.labelKey}`)}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu className="gap-0.5">
                        {visibleItems.map(renderNavigationItem)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </div>
              );
            })}
            <SidebarSeparator className="my-2" />
            <SidebarGroup className="p-1">
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderNavigationItem({
                    labelKey: "nav.settings",
                    icon: Settings,
                    path: "/settings",
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          <SidebarGroup className="p-3">
            <p className="text-sm leading-5 text-muted-foreground">
              {shops.length ? t("sidebar:shop.noAccess") : t("sidebar:empty")}
            </p>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-0">
          <LanguageSwitcher />
          <ModeToggle />
          <NotificationBell shopSlug={shopSlug} />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="min-h-11 rounded-lg"
                  tooltip={user?.name ?? t("navbar:account.menuLabel")}
                >
                  <Avatar className="size-8 shrink-0 rounded-lg">
                    <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
                    <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold text-foreground">
                      {user?.name?.slice(0, 2).toUpperCase() ?? <CircleUserRound className="size-4" aria-hidden="true" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" aria-hidden="true" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-[min(18rem,calc(100vw-1rem))]">
                <DropdownMenuLabel className="max-w-full p-3 font-normal">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-9 shrink-0 rounded-lg">
                      <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
                      <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold">
                        {user?.name?.slice(0, 2).toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                      {roleLabel ? <p className="mt-1 truncate text-xs text-muted-foreground">{roleLabel}</p> : null}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="min-h-11">
                  <Link to="/account" onClick={closeOnMobile}>
                    <CircleUserRound className="size-4" aria-hidden="true" />
                    {t("navbar:account.manage")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={loggingOut}
                  onSelect={() => void handleLogout()}
                  className="min-h-11 text-destructive focus:text-destructive"
                >
                  {loggingOut ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <LogOut className="size-4" aria-hidden="true" />}
                  {loggingOut ? t("sidebar:account.loggingOut") : t("sidebar:account.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
