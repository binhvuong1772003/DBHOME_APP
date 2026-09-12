import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, LogOut, Menu, Settings2, Store } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ModeToggle } from "@/components/common/ModeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { NotificationBell } from "@/features/shop/components/NotificationBell";
import { useOptionalShopContext } from "@/context/ShopContext";

const initials = (name?: string | null) =>
  (name ?? "SHN")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SHN";

export const Navbar = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation("navbar");
  const { user, loading: authLoading, logout } = useAuth();
  const shopContext = useOptionalShopContext();
  const shops = shopContext?.shops ?? [];
  const { shopSlug } = useParams<{ shopSlug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isMarketplace =
    location.pathname === "/" ||
    location.pathname === "/shops";
  const hasEditorialNav = isMarketplace || className.includes("shn-home-nav");
  const openAuth = (mode: "signin" | "signup") =>
    navigate(`/auth?mode=${mode}`);
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const serverLogoutSucceeded = await logout();
      if (!serverLogoutSucceeded) toast.error(t("account.logoutError"));
      navigate("/", { replace: true });
    } catch {
      toast.error(t("account.logoutError"));
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 shadow-sm ${hasEditorialNav ? "backdrop-blur-none" : "backdrop-blur"} ${className}`.trim()}
    >
      <div
        className={`relative flex min-h-16 w-full items-center gap-3 px-3 sm:px-5 lg:px-6 ${hasEditorialNav ? "min-h-[4.5rem] gap-1 px-[0.65rem] sm:px-4" : ""}`}
      >
        <Link
          to="/"
          className={`group flex min-w-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${hasEditorialNav ? "min-h-12 rounded-none border-0 p-1 pl-[0.15rem] pr-[0.35rem] transition-opacity hover:opacity-80 sm:pr-2" : "rounded-lg"}`}
          aria-label="SHN"
        >
          <span
            className={`flex shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground ${hasEditorialNav ? "size-[2.35rem] rounded-[0.7rem] shadow-none tracking-[0.06em]" : "size-9 rounded-lg shadow-xs"}`}
          >
            S
          </span>
          <span className="min-w-0">
            <span
              className={`block truncate text-base font-extrabold text-primary ${hasEditorialNav ? "tracking-[0.14em]" : "tracking-wide"}`}
            >
              SHN APP
            </span>
            <span
              className={`hidden truncate text-[11px] text-muted-foreground lg:block ${hasEditorialNav ? "mt-[0.1rem] max-w-60 leading-[1.3]" : ""}`}
            >
              {t("brandSubtitle")}
            </span>
          </span>
        </Link>

        {isMarketplace && (
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 text-sm lg:flex"
            aria-label={t("primaryNavigation")}
          >
            <Link
              to="/shops"
              className="inline-flex min-h-10 items-center rounded-none px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-[0.45rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("nav.salons")}
            </Link>
            <Link
              to="/#discover-recommended"
              className="inline-flex min-h-10 items-center rounded-none px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-[0.45rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("nav.services")}
            </Link>
            <Link
              to="/#collections"
              className="inline-flex min-h-10 items-center rounded-none px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-[0.45rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("nav.discover")}
            </Link>
          </nav>
        )}

        <div
          className={`flex items-center ${hasEditorialNav ? "ml-auto gap-[0.35rem]" : "gap-2"}`}
        >
          {isMarketplace && (
            <DropdownMenu open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-11 min-w-11 rounded-none bg-transparent text-foreground hover:bg-transparent lg:hidden"
                  aria-label={t("primaryNavigation")}
                >
                  <Menu aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 lg:hidden">
                <DropdownMenuItem asChild>
                  <Link to="/shops">{t("nav.salons")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#discover-recommended">{t("nav.services")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#collections">{t("nav.discover")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/#booking-preview">{t("nav.book")}</Link>
                </DropdownMenuItem>
                {!user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => openAuth("signin")}>
                      {t("auth.signIn")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => openAuth("signup")}>
                      {t("auth.signUp")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {isMarketplace && (
            <Button
              asChild
              size="sm"
              className="hidden min-h-11 rounded-[0.65rem] border-0 bg-primary px-[0.9rem] text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground sm:inline-flex"
              aria-label={t("nav.book")}
            >
              <Link to="/#booking-preview">{t("nav.book")}</Link>
            </Button>
          )}
          <LanguageSwitcher />
          <ModeToggle />

          {authLoading ? (
            <Skeleton className="size-10 rounded-full" />
          ) : user ? (
            <>
              {shops.length > 0 && (
                <NotificationBell shopSlug={shopSlug ?? shops[0]?.slug} />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="min-h-11 gap-2 px-1.5 sm:px-2"
                    aria-label={t("account.menuLabel")}
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                      {user.name}
                    </span>
                    <ChevronDown
                      className="hidden size-4 text-muted-foreground sm:block"
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="px-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="truncate text-xs font-normal text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      <Settings2 aria-hidden="true" />
                      {t("account.manage")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{t("account.shops")}</DropdownMenuLabel>
                  {shops.length === 0 ? (
                    <DropdownMenuItem disabled>
                      <Store aria-hidden="true" />
                      {t("account.noShops")}
                    </DropdownMenuItem>
                  ) : (
                    shops.map((shop) => (
                      <DropdownMenuItem
                        key={shop.id}
                        onClick={() => navigate(`/shops/${shop.slug}/admin`)}
                      >
                        <Store aria-hidden="true" />
                        <span className="truncate">{shop.name}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={loggingOut}
                    onClick={() => void handleLogout()}
                  >
                    <LogOut aria-hidden="true" />
                    {loggingOut ? t("account.loggingOut") : t("account.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div
              className={`flex items-center gap-2 ${hasEditorialNav ? "hidden sm:flex" : ""}`}
            >
              <Button
                variant="outline"
                size="sm"
                className={`min-h-11 ${hasEditorialNav ? "rounded-none border-0 bg-transparent px-[0.65rem] text-foreground shadow-none hover:bg-transparent hover:text-primary hover:underline hover:underline-offset-[0.4rem]" : ""}`}
                aria-label={t("auth.signIn")}
                onClick={() => openAuth("signin")}
              >
                <span>{t("auth.signIn")}</span>
              </Button>
              <Button
                size="sm"
                className={`min-h-11 ${hasEditorialNav ? "rounded-none border-0 bg-transparent px-[0.65rem] text-primary shadow-none hover:bg-transparent hover:text-primary hover:underline hover:underline-offset-[0.4rem]" : ""}`}
                aria-label={t("auth.signUp")}
                onClick={() => openAuth("signup")}
              >
                <span>{t("auth.signUp")}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
