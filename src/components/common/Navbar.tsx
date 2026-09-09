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

  const isMarketplace = location.pathname === "/";
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
      className={`sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 shadow-xs ${className ? "" : "backdrop-blur"} ${className}`.trim()}
    >
      <div
        className={`relative flex min-h-16 w-full items-center gap-3 px-3 sm:px-5 lg:px-6 ${isMarketplace ? "shn-home-nav__inner" : ""}`}
      >
        <Link
          to="/"
          className="shn-home-nav__brand group flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="SHN"
        >
          <span className="shn-home-nav__brand-mark flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-xs">
            S
          </span>
          <span className="shn-home-nav__brand-copy min-w-0">
            <span className="shn-home-nav__brand-name block truncate text-base font-extrabold tracking-wide text-primary">
              SHN APP
            </span>
            <span className="shn-home-nav__brand-subtitle hidden truncate text-[11px] text-muted-foreground lg:block">
              {t("brandSubtitle")}
            </span>
          </span>
        </Link>

        {isMarketplace && (
          <nav
            className="shn-home-nav__links hidden items-center text-sm lg:flex"
            aria-label={t("primaryNavigation")}
          >
            <Link
              to="/#salons"
              className="shn-home-nav__link px-3 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("nav.salons")}
            </Link>
            <Link
              to="/#services"
              className="shn-home-nav__link px-3 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("nav.services")}
            </Link>
            <Link
              to="/#collections"
              className="shn-home-nav__link px-3 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("nav.discover")}
            </Link>
          </nav>
        )}

        <div className="shn-home-nav__actions flex items-center gap-2">
          {isMarketplace && (
            <DropdownMenu open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shn-home-nav__menu-button min-h-11 min-w-11 lg:hidden"
                  aria-label={t("primaryNavigation")}
                >
                  <Menu aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 lg:hidden">
                <DropdownMenuItem asChild>
                  <Link to="/#salons">{t("nav.salons")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/#services">{t("nav.services")}</Link>
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
              className="shn-home-nav__book-button min-h-11 px-2.5 sm:px-3"
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
            <div className="shn-home-nav__auth flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="shn-home-nav__sign-in min-h-11"
                aria-label={t("auth.signIn")}
                onClick={() => openAuth("signin")}
              >
                <span className="shn-home-nav__auth-text">
                  {t("auth.signIn")}
                </span>
              </Button>
              <Button
                size="sm"
                className="shn-home-nav__sign-up min-h-11"
                aria-label={t("auth.signUp")}
                onClick={() => openAuth("signup")}
              >
                <span className="shn-home-nav__auth-text">
                  {t("auth.signUp")}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
