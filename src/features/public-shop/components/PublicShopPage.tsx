import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Star,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/common/Navbar";
import { getPublicShopReviews } from "../services/publicShopService";
import { usePublicShop } from "../hooks/usePublicShop";
import { PublicBookingSheet } from "./PublicBookingSheet";
import type {
  PublicBookingDraft,
  PublicShopPage as PublicShopData,
  PublicShopReview,
  PublicShopService,
} from "../types";

const BOOKING_DRAFT_KEY = "shn:public-booking-draft";
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function initials(name?: string | null) {
  return (
    (name ?? "SHN")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "SHN"
  );
}

function SafeImage({
  src,
  alt,
  className,
  fallback,
  loading = "lazy",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(!src);
  if (failed || !src) return <div className={className}>{fallback}</div>;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}

function formatAddress(shop: PublicShopData) {
  return [shop.address, shop.district, shop.city].filter(Boolean).join(", ");
}

function getDisplayBusinessHours(shop: PublicShopData) {
  if (shop.businessHours.length) return shop.businessHours;
  return Array.from({ length: 7 }, (_, day) => {
    const backendDay = day === 0 ? 7 : day;
    return {
      dayOfWeek: backendDay,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      isClosed: !shop.workDays.includes(backendDay),
    };
  });
}

function getTodayBusinessHours(shop: PublicShopData) {
  try {
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: shop.timezone,
      weekday: "short",
    }).format(new Date());
    const day = dayNames.findIndex((name) => name.startsWith(weekday));
    const backendDay = day === 0 ? 7 : day;
    return (
      getDisplayBusinessHours(shop).find(
        (item) => item.dayOfWeek === day || item.dayOfWeek === backendDay,
      ) ?? null
    );
  } catch {
    return null;
  }
}

function getOpenState(shop: PublicShopData): boolean | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: shop.timezone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const weekday = parts.find((part) => part.type === "weekday")?.value;
    const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
    const minute = Number(
      parts.find((part) => part.type === "minute")?.value ?? 0,
    );
    const day = dayNames.findIndex((name) => name.startsWith(weekday ?? ""));
    const hours = getDisplayBusinessHours(shop).find(
      (item) => item.dayOfWeek === day || (item.dayOfWeek === 7 && day === 0),
    );
    if (!hours || hours.isClosed) return false;
    const current = hour * 60 + minute;
    const [openHour, openMinute] = hours.openTime.split(":").map(Number);
    const [closeHour, closeMinute] = hours.closeTime.split(":").map(Number);
    return (
      current >= openHour * 60 + openMinute &&
      current < closeHour * 60 + closeMinute
    );
  } catch {
    return null;
  }
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function formatMoney(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function ReviewItem({
  review,
  locale,
  t,
}: {
  review: PublicShopReview;
  locale: string;
  t: (key: string) => string;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar className="size-10 shrink-0 border border-border/80">
          <AvatarImage
            src={review.customer.avatarUrl ?? undefined}
            alt={review.customer.name}
          />
          <AvatarFallback>{initials(review.customer.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <p className="truncate font-semibold">{review.customer.name}</p>
            <time
              className="text-xs text-muted-foreground"
              dateTime={review.createdAt}
            >
              {formatDate(review.createdAt, locale)}
            </time>
          </div>
          <div
            className="mt-1 flex items-center gap-0.5 text-primary"
            aria-label={`${review.rating} ${t("reviews.stars")}`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`size-3.5 ${index < review.rating ? "fill-current" : "text-muted-foreground/30"}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {review.comment}
        </p>
      )}
      {review.replyContent && (
        <div className="mt-4 rounded-xl bg-muted/60 p-3 text-sm">
          <p className="font-semibold text-foreground">
            {t("reviews.shopReply")}
          </p>
          <p className="mt-1 line-clamp-2 leading-6 text-muted-foreground">
            {review.replyContent}
          </p>
        </div>
      )}
    </article>
  );
}

function StatusBadge({
  openState,
  t,
  className = "",
}: {
  openState: boolean | null;
  t: (key: string) => string;
  className?: string;
}) {
  if (openState === null) return null;
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${openState ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200" : "border-white/30 bg-black/25 text-white backdrop-blur-sm"} ${className}`}
    >
      <span
        className={`size-1.5 rounded-full ${openState ? "bg-emerald-500" : "bg-white/70"}`}
        aria-hidden="true"
      />
      {openState ? t("shop.openNow") : t("shop.closedNow")}
    </Badge>
  );
}

export default function PublicShopPage({
  initialBooking = false,
}: {
  initialBooking?: boolean;
}) {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { t, i18n } = useTranslation("publicShop");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const { shop, loading, error, retry } = usePublicShop(shopSlug);
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(initialBooking);
  const [bookingServiceId, setBookingServiceId] = useState<string>();
  const [restoredDraft, setRestoredDraft] = useState<PublicBookingDraft | null>(
    null,
  );
  const [reviews, setReviews] = useState<PublicShopReview[]>([]);
  const [reviewsMeta, setReviewsMeta] = useState<{
    page: number;
    hasNext: boolean;
  } | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("all");

  const serviceGroups = useMemo(() => {
    if (!shop) return [];
    const groups = new Map<
      string,
      { label: string; services: PublicShopService[] }
    >();
    shop.services.forEach((service) => {
      const label =
        service.category?.name?.trim() || t("services.categoryFallback");
      const key = service.category?.id ?? "uncategorized";
      const group = groups.get(key) ?? { label, services: [] };
      group.services.push(service);
      groups.set(key, group);
    });
    return Array.from(groups.entries()).map(([key, group]) => ({
      key,
      ...group,
    }));
  }, [shop, t]);

  const activeServiceCategory =
    selectedServiceCategory === "all" ||
    serviceGroups.some((group) => group.key === selectedServiceCategory)
      ? selectedServiceCategory
      : "all";
  const visibleServices =
    activeServiceCategory === "all"
      ? (shop?.services ?? [])
      : (serviceGroups.find((group) => group.key === activeServiceCategory)
          ?.services ?? []);

  useEffect(() => {
    if (!shop) return;
    setReviews(shop.reviews);
    setReviewsMeta({
      page: 1,
      hasNext: shop.rating.count > shop.reviews.length,
    });
    const stored = sessionStorage.getItem(BOOKING_DRAFT_KEY);
    if (!stored) return;
    try {
      const draft = JSON.parse(stored) as PublicBookingDraft;
      if (draft.shopSlug === shop.slug) {
        setRestoredDraft(draft);
        setBookingOpen(true);
      }
    } catch {
      // Remove malformed state instead of blocking the public shop page.
    } finally {
      sessionStorage.removeItem(BOOKING_DRAFT_KEY);
    }
  }, [shop]);

  useEffect(() => {
    const state = location.state as { openBookingServiceId?: string } | null;
    if (!shop || !state?.openBookingServiceId) return;
    setBookingServiceId(state.openBookingServiceId);
    setBookingOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, shop]);

  const openBooking = (serviceId?: string) => {
    navigate(`/shops/${shop?.slug ?? shopSlug}/book`, {
      state: serviceId ? { openBookingServiceId: serviceId } : undefined,
    });
  };

  const handleBookingOpenChange = (open: boolean) => {
    setBookingOpen(open);
    if (!open) {
      setBookingServiceId(undefined);
      setRestoredDraft(null);
      if (shop) navigate(`/shops/${shop.slug}`, { replace: true });
    }
  };

  const handleRequireAuth = (draft: PublicBookingDraft) => {
    sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
    navigate(`/auth?mode=signin`, { state: { from: location.pathname } });
  };

  const loadMoreReviews = async () => {
    if (!shop || reviewsLoading || !reviewsMeta?.hasNext) return;
    setReviewsLoading(true);
    setReviewsError("");
    try {
      const next = await getPublicShopReviews(shop.slug, {
        page: reviewsMeta.page + 1,
        limit: 8,
      });
      setReviews((current) => [...current, ...next.items]);
      setReviewsMeta({ page: next.meta.page, hasNext: next.meta.hasNext });
    } catch {
      setReviewsError(t("reviews.loadError"));
    } finally {
      setReviewsLoading(false);
    }
  };

  const address = shop ? formatAddress(shop) : "";
  const openState = shop ? getOpenState(shop) : null;
  const displayBusinessHours = shop ? getDisplayBusinessHours(shop) : [];
  const todayBusinessHours = shop ? getTodayBusinessHours(shop) : null;
  const typeLabel = shop
    ? t(`shopTypes.${shop.type?.toLowerCase() ?? "combo"}`)
    : "";
  const reviewAverage = shop?.rating.average;
  const mapUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : "";

  if (loading) {
    return (
      <div className="min-h-dvh overflow-x-clip bg-background font-sans text-foreground">
        <Navbar className="shn-home-nav" />
        <main className="mx-auto w-full max-w-[1360px] space-y-6 px-4 py-5 sm:px-6 lg:px-8">
          <Skeleton className="h-[25rem] rounded-[1.75rem]" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
            <div className="space-y-5">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-dvh overflow-x-clip bg-background font-sans text-foreground">
        <Navbar className="shn-home-nav" />
        <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <AlertCircle aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight">
            {t("states.notFoundTitle")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("states.notFoundDescription")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" variant="outline" onClick={retry}>
              <RefreshCw className="size-4" aria-hidden="true" />
              {t("states.retry")}
            </Button>
            <Button asChild>
              <Link to="/">{t("states.backHome")}</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (bookingOpen) {
    return (
      <PublicBookingSheet
        shop={shop}
        open={bookingOpen}
        onOpenChange={handleBookingOpenChange}
        initialServiceId={bookingServiceId}
        restoredDraft={restoredDraft}
        onRequireAuth={handleRequireAuth}
      />
    );
  }

  return (
    <div className="min-h-dvh overflow-x-clip bg-background font-sans text-foreground">
      <Navbar className="shn-home-nav" />
      <main>
        <section className="border-b border-border/70 bg-background">
          <div className="mx-auto w-full max-w-[1360px] px-4 pb-4 pt-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-muted shadow-[0_18px_45px_rgba(39,49,42,0.10)]">
              <div className="relative min-h-[27rem] sm:min-h-[31rem] lg:min-h-[34rem]">
                <SafeImage
                  src={shop.coverUrl}
                  alt={`${shop.name} cover`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  fallback={
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,color-mix(in_srgb,var(--secondary)_70%,transparent),transparent_28%),linear-gradient(135deg,var(--muted),var(--accent))]" />
                  }
                />
                <div
                  className="absolute inset-0 bg-linear-to-b from-black/20 via-black/10 to-black/80"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-6">
                  <Link
                    to="/"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-black/20 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    {t("states.backHome")}
                  </Link>
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/30 bg-black/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    {typeLabel}
                  </Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0">
                  <div className="ml-0 flex w-full max-w-none flex-col items-start gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-5 sm:px-7 sm:pb-7 lg:px-10">
                    <div className="flex min-w-0 w-full items-end gap-4 sm:flex-1 sm:gap-5">
                      <Avatar className="size-20 shrink-0 border-4 border-background bg-card text-xl shadow-xl sm:size-24 sm:text-2xl lg:size-28">
                        <AvatarImage
                          src={shop.logoUrl ?? undefined}
                          alt={shop.name}
                        />
                        <AvatarFallback className="font-serif font-semibold text-primary">
                          {initials(shop.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 max-w-3xl flex-1 text-white">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge openState={openState} t={t} />
                          <span className="text-sm text-white/75">
                            {shop.services.length} {t("services.available")}
                          </span>
                        </div>
                        <h1 className="mt-2 max-w-4xl font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.04em] drop-shadow-sm sm:text-4xl lg:text-5xl">
                          {shop.name}
                        </h1>
                        {shop.description && (
                          <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                            {shop.description}
                          </p>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
                          {shop.rating.count > 0 && (
                            <span className="inline-flex items-center gap-1.5 font-medium">
                              <span
                                className="flex items-center gap-0.5 text-secondary"
                                aria-label={`${reviewAverage?.toFixed(1)} ${t("reviews.stars")}`}
                              >
                                <Star
                                  className="size-4 fill-current"
                                  aria-hidden="true"
                                />
                              </span>
                              {reviewAverage?.toFixed(1)}{" "}
                              <span className="font-normal text-white/65">
                                ({shop.rating.count})
                              </span>
                            </span>
                          )}
                          {address && (
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                              <MapPin
                                className="size-4 shrink-0 text-secondary"
                                aria-hidden="true"
                              />
                              <span className="truncate">{address}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="lg"
                      className="min-h-12 w-full shrink-0 rounded-xl px-5 shadow-lg sm:mb-1 sm:w-auto"
                      onClick={() => openBooking()}
                    >
                      <CalendarDays className="size-4" aria-hidden="true" />
                      {t("actions.book")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <nav
              className="flex items-center gap-1 overflow-x-auto py-2"
              aria-label={t("navigation.label")}
            >
              <a
                href="#services"
                className="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t("navigation.services")}
              </a>
              <a
                href="#reviews"
                className="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t("navigation.reviews")}
              </a>
              <a
                href="#information"
                className="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t("navigation.information")}
              </a>
              <span className="ml-auto hidden shrink-0 items-center gap-2 text-xs text-muted-foreground sm:inline-flex">
                <Clock3 className="size-3.5 text-primary" aria-hidden="true" />
                {todayBusinessHours?.isClosed
                  ? t("information.closed")
                  : todayBusinessHours
                    ? `${todayBusinessHours.openTime} – ${todayBusinessHours.closeTime}`
                    : t("information.hoursUnavailable")}
              </span>
            </nav>
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-12 lg:px-8 lg:py-9">
          <div className="min-w-0 space-y-10">
            <section
              id="services"
              className="scroll-mt-24"
              aria-labelledby="services-heading"
            >
              <div className="flex items-end justify-between gap-4 border-b border-border/80 pb-4">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {t("services.eyebrow")}
                  </p>
                  <h2
                    id="services-heading"
                    className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
                  >
                    {t("services.title")}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {t("services.description")}
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm font-medium text-muted-foreground sm:block">
                  {shop.services.length} {t("services.available")}
                </span>
              </div>
              {shop.services.length === 0 ? (
                <Card className="mt-5 border-dashed">
                  <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    {t("services.empty")}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div
                    className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    role="tablist"
                    aria-label={t("services.categories")}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeServiceCategory === "all"}
                      className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${activeServiceCategory === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                      onClick={() => setSelectedServiceCategory("all")}
                    >
                      {t("services.allCategories")}
                    </button>
                    {serviceGroups.map((group) => (
                      <button
                        key={group.key}
                        type="button"
                        role="tab"
                        aria-selected={activeServiceCategory === group.key}
                        className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${activeServiceCategory === group.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                        onClick={() => setSelectedServiceCategory(group.key)}
                      >
                        {group.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3">
                    {visibleServices.map((service) => (
                      <article
                        key={service.id}
                        className="flex min-h-[8.25rem] min-w-0 items-start justify-between gap-5 rounded-3xl border border-border/70 bg-card px-5 py-5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:items-center sm:px-6"
                      >
                        <div className="min-w-0">
                          <h3 className="font-sans text-base font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-lg">
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                              {service.description}
                            </p>
                          )}
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 className="size-3.5" aria-hidden="true" />
                              {service.durationMin} {t("services.minutes")}
                            </span>
                            <span className="font-semibold text-foreground">
                              {typeof service.basePrice === "number"
                                ? `${t("services.from")} ${formatMoney(service.basePrice, locale)}`
                                : t("services.priceOnRequest")}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="min-h-11 shrink-0 rounded-xl border-primary/25 bg-background/70 px-3 text-xs text-primary hover:bg-primary hover:text-primary-foreground sm:px-4 sm:text-sm"
                          onClick={() => openBooking(service.id)}
                        >
                          {t("actions.bookService")}
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Button>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section
              id="reviews"
              className="scroll-mt-24"
              aria-labelledby="reviews-heading"
            >
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-4">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {t("reviews.eyebrow")}
                  </p>
                  <h2
                    id="reviews-heading"
                    className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
                  >
                    {t("reviews.title")}
                  </h2>
                </div>
                {shop.rating.count > 0 && (
                  <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-2 shadow-sm">
                    <div
                      className="flex items-center gap-0.5 text-primary"
                      aria-label={`${reviewAverage?.toFixed(1)} ${t("reviews.stars")}`}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`size-4 ${index < Math.round(reviewAverage ?? 0) ? "fill-current" : "text-muted-foreground/30"}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="font-semibold">
                      {reviewAverage?.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({shop.rating.count})
                    </span>
                  </div>
                )}
              </div>
              {shop.rating.count === 0 ? (
                <Card className="mt-5 border-dashed">
                  <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    {t("reviews.empty")}
                  </CardContent>
                </Card>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <ReviewItem
                      key={review.id}
                      review={review}
                      locale={locale}
                      t={t}
                    />
                  ))}
                  {reviewsError && (
                    <Alert variant="destructive" className="sm:col-span-2">
                      <AlertCircle className="size-4" aria-hidden="true" />
                      <AlertDescription>{reviewsError}</AlertDescription>
                    </Alert>
                  )}
                  {reviewsMeta?.hasNext && (
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11 w-full sm:col-span-2"
                      onClick={() => void loadMoreReviews()}
                      disabled={reviewsLoading}
                    >
                      {reviewsLoading && <Loader2Icon />}
                      {reviewsLoading
                        ? t("reviews.loadingMore")
                        : t("reviews.loadMore")}
                    </Button>
                  )}
                </div>
              )}
            </section>

            <section
              id="information"
              className="scroll-mt-24"
              aria-labelledby="information-heading"
            >
              <div className="border-b border-border/80 pb-4">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {t("information.eyebrow")}
                  </p>
                  <h2
                    id="information-heading"
                    className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
                  >
                    {t("information.title")}
                  </h2>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      {t("information.location")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-5 pt-0">
                    {address ? (
                      <>
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block break-words text-sm leading-6 text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {address}
                        </a>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              void navigator.clipboard?.writeText(address)
                            }
                          >
                            <Copy className="size-4" aria-hidden="true" />
                            {t("information.copy")}
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href={mapUrl} target="_blank" rel="noreferrer">
                              <ExternalLink
                                className="size-4"
                                aria-hidden="true"
                              />
                              {t("information.directions")}
                            </a>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t("information.addressUnavailable")}
                      </p>
                    )}
                    {(shop.phone || shop.email) && (
                      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border/70 pt-3 text-sm text-muted-foreground">
                        {shop.phone && (
                          <a
                            href={`tel:${shop.phone}`}
                            className="inline-flex min-h-11 items-center gap-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Phone className="size-4" aria-hidden="true" />
                            {shop.phone}
                          </a>
                        )}
                        {shop.email && (
                          <a
                            href={`mailto:${shop.email}`}
                            className="inline-flex min-h-11 items-center gap-2 break-all hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Mail className="size-4" aria-hidden="true" />
                            {shop.email}
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Clock3
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      {t("information.hours")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {t("bookingCard.hoursToday")}
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {todayBusinessHours?.isClosed
                          ? t("information.closed")
                          : todayBusinessHours
                            ? `${todayBusinessHours.openTime} – ${todayBusinessHours.closeTime}`
                            : t("information.hoursUnavailable")}
                      </p>
                    </div>
                    <details className="group mt-3 border-t border-border/70 pt-2">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                        <span>{t("information.hours")}</span>
                        <ChevronDown
                          className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-sm">
                        {displayBusinessHours.map((hours) => (
                          <div
                            key={hours.dayOfWeek}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="text-muted-foreground">
                              {t(
                                `days.${hours.dayOfWeek === 7 ? 0 : hours.dayOfWeek}`,
                              )}
                            </span>
                            <span
                              className={
                                hours.isClosed
                                  ? "text-muted-foreground"
                                  : "font-medium"
                              }
                            >
                              {hours.isClosed
                                ? t("information.closed")
                                : `${hours.openTime} – ${hours.closeTime}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden border-primary/25 shadow-[0_16px_36px_rgba(39,49,42,0.08)] ring-1 ring-primary/10">
              <CardHeader className="bg-accent/55 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
                    <CalendarDays className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="font-serif text-xl">
                      {t("bookingCard.title")}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {t("bookingCard.description")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5 sm:p-6">
                <div className="rounded-xl border border-border/80 bg-background p-3.5">
                  <div className="flex items-start gap-3">
                    <Clock3
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {t("bookingCard.hoursToday")}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {todayBusinessHours?.isClosed
                          ? t("information.closed")
                          : todayBusinessHours
                            ? `${todayBusinessHours.openTime} – ${todayBusinessHours.closeTime}`
                            : t("information.hoursUnavailable")}
                      </p>
                    </div>
                    <StatusBadge
                      openState={openState}
                      t={t}
                      className="shrink-0 text-[11px]"
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-border/80 bg-background p-3.5">
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {t("information.location")}
                      </p>
                      {address ? (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block text-sm font-medium leading-5 text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {address}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t("information.addressUnavailable")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <UserRound
                    className="mt-1 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{t("bookingCard.staff")}</span>
                </div>
                <Separator />
                <Button
                  type="button"
                  size="lg"
                  className="min-h-12 w-full rounded-xl shadow-sm"
                  onClick={() => openBooking()}
                >
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {t("actions.book")}
                </Button>
                <p className="text-center text-xs leading-5 text-muted-foreground">
                  {t("bookingCard.note")}
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Loader2Icon() {
  return <RefreshCw className="size-4 animate-spin" aria-hidden="true" />;
}
