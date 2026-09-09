import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CalendarDays, ChevronDown, Clock3, Copy, ExternalLink, Mail, MapPin, Phone, RefreshCw, Scissors, Star, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/common/Navbar";
import { getPublicShopReviews } from "../services/publicShopService";
import { usePublicShop } from "../hooks/usePublicShop";
import { PublicBookingSheet, type PublicBookingDraft } from "./PublicBookingSheet";
import type { PublicShopPage as PublicShopData, PublicShopReview } from "../types";

const BOOKING_DRAFT_KEY = "shn:public-booking-draft";
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function initials(name?: string | null) {
  return (name ?? "SHN").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "SHN";
}

function SafeImage({ src, alt, className, fallback, loading = "lazy" }: { src?: string | null; alt: string; className?: string; fallback: React.ReactNode; loading?: "lazy" | "eager" }) {
  const [failed, setFailed] = useState(!src);
  if (failed || !src) return <div className={className}>{fallback}</div>;
  return <img src={src} alt={alt} className={className} loading={loading} onError={() => setFailed(true)} />;
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
    const weekday = new Intl.DateTimeFormat("en-US", { timeZone: shop.timezone, weekday: "short" }).format(new Date());
    const day = dayNames.findIndex((name) => name.startsWith(weekday));
    const backendDay = day === 0 ? 7 : day;
    return getDisplayBusinessHours(shop).find((item) => item.dayOfWeek === day || item.dayOfWeek === backendDay) ?? null;
  } catch {
    return null;
  }
}

function getOpenState(shop: PublicShopData): boolean | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: shop.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const weekday = parts.find((part) => part.type === "weekday")?.value;
    const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
    const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
    const day = dayNames.findIndex((name) => name.startsWith(weekday ?? ""));
    const hours = getDisplayBusinessHours(shop).find((item) => item.dayOfWeek === day || (item.dayOfWeek === 7 && day === 0));
    if (!hours || hours.isClosed) return false;
    const current = hour * 60 + minute;
    const [openHour, openMinute] = hours.openTime.split(":").map(Number);
    const [closeHour, closeMinute] = hours.closeTime.split(":").map(Number);
    return current >= openHour * 60 + openMinute && current < closeHour * 60 + closeMinute;
  } catch {
    return null;
  }
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}

function formatMoney(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

function ReviewItem({ review, locale, t }: { review: PublicShopReview; locale: string; t: (key: string) => string }) {
  return <article className="space-y-2.5 rounded-xl border border-border/70 bg-card p-4"><div className="flex items-start gap-3"><Avatar className="size-9"><AvatarImage src={review.customer.avatarUrl ?? undefined} alt={review.customer.name} /><AvatarFallback>{initials(review.customer.name)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium">{review.customer.name}</p><time className="text-xs text-muted-foreground" dateTime={review.createdAt}>{formatDate(review.createdAt, locale)}</time></div><div className="mt-1 flex items-center gap-0.5 text-primary" aria-label={`${review.rating} ${t("reviews.stars")}`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < review.rating ? "fill-current" : "text-muted-foreground/30"}`} aria-hidden="true" />)}</div></div></div>{review.comment && <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>}{review.replyContent && <div className="rounded-lg bg-muted/50 p-3 text-sm"><p className="font-medium">{t("reviews.shopReply")}</p><p className="mt-1 line-clamp-2 leading-6 text-muted-foreground">{review.replyContent}</p></div>}</article>;
}

export default function PublicShopPage() {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { t, i18n } = useTranslation("publicShop");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const { shop, loading, error, retry } = usePublicShop(shopSlug);
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string>();
  const [restoredDraft, setRestoredDraft] = useState<PublicBookingDraft | null>(null);
  const [reviews, setReviews] = useState<PublicShopReview[]>([]);
  const [reviewsMeta, setReviewsMeta] = useState<{ page: number; hasNext: boolean } | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    if (!shop) return;
    setReviews(shop.reviews);
    setReviewsMeta({ page: 1, hasNext: shop.rating.count > shop.reviews.length });
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
    setBookingServiceId(serviceId);
    setBookingOpen(true);
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
      const next = await getPublicShopReviews(shop.slug, { page: reviewsMeta.page + 1, limit: 8 });
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
  const typeLabel = shop ? t(`shopTypes.${shop.type?.toLowerCase() ?? "combo"}`) : "";
  const reviewAverage = shop?.rating.average;
  const mapUrl = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "";

  if (loading) return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"><Skeleton className="h-64 rounded-2xl" /><div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]"><div className="space-y-5"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-72 rounded-xl" /></div><Skeleton className="h-80 rounded-xl" /></div></main></div>;

  if (error || !shop) return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center"><div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"><AlertCircle aria-hidden="true" /></div><h1 className="mt-5 text-2xl font-semibold">{t("states.notFoundTitle")}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{t("states.notFoundDescription")}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Button type="button" variant="outline" onClick={retry}><RefreshCw className="size-4" aria-hidden="true" />{t("states.retry")}</Button><Button asChild><Link to="/">{t("states.backHome")}</Link></Button></div></main></div>;

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <Navbar />
      <main>
        <section className="border-b border-border/70 bg-background">
          <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10">
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-muted shadow-md">
              <div className="relative h-52 sm:h-64 lg:h-72">
                <SafeImage
                  src={shop.coverUrl}
                  alt={`${shop.name} cover`}
                  className="h-full w-full object-cover"
                  loading="eager"
                  fallback={
                    <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                      <StoreMark />
                    </div>
                  }
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground/25 to-transparent" aria-hidden="true" />
              </div>
              <div className="relative flex flex-col gap-5 px-3 pb-3 pt-0 sm:flex-row sm:items-end sm:gap-6 sm:px-6">
                <Avatar className="-mt-9 size-20 shrink-0 border-4 border-background bg-card shadow-md sm:size-24">
                  <AvatarImage src={shop.logoUrl ?? undefined} alt={shop.name} />
                  <AvatarFallback className="text-xl font-semibold sm:text-2xl">{initials(shop.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{typeLabel}</Badge>
                    {openState !== null && <Badge variant={openState ? "default" : "outline"} className={openState ? "border-primary bg-primary px-2.5 py-1 font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/20" : "border-border bg-muted text-muted-foreground"}>{openState ? t("shop.openNow") : t("shop.closedNow")}</Badge>}
                  </div>
                  <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">{shop.name}</h1>
                  {shop.description && <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{shop.description}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    {shop.rating.count > 0 && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        <span className="flex items-center gap-0.5 text-primary" aria-label={`${reviewAverage?.toFixed(1)} ${t("reviews.stars")}`}>
                          <Star className="size-4 fill-current" aria-hidden="true" />
                        </span>
                        {reviewAverage?.toFixed(1)} <span className="font-normal text-muted-foreground">({shop.rating.count})</span>
                      </span>
                    )}
                    {address && <span className="inline-flex min-w-0 items-center gap-1.5 text-muted-foreground"><MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" /><span className="truncate">{address}</span></span>}
                  </div>
                </div>
                <Button type="button" size="lg" className="min-h-12 w-full shrink-0 shadow-sm sm:mb-1 sm:w-auto sm:min-w-44" onClick={() => openBooking()}>
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {t("actions.book")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-10 lg:px-8 lg:py-10">
          <div className="min-w-0 space-y-12">
            <section id="services" className="scroll-mt-8" aria-labelledby="services-heading">
              <div className="flex items-end justify-between gap-4">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t("services.eyebrow")}</p>
                  <h2 id="services-heading" className="mt-2 text-3xl font-semibold tracking-tight">{t("services.title")}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t("services.description")}</p>
                </div>
                <span className="hidden text-sm font-medium text-muted-foreground sm:block">{shop.services.length} {t("services.available")}</span>
              </div>
              {shop.services.length === 0 ? <Card className="mt-5 border-dashed"><CardContent className="py-12 text-center text-sm text-muted-foreground">{t("services.empty")}</CardContent></Card> : <div className="mt-5 grid gap-4 sm:grid-cols-2">{shop.services.map((service) => <Card key={service.id} className="group flex h-full flex-col overflow-hidden border-border/80 bg-card shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md"><SafeImage src={service.imageUrl} alt={service.name} className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" fallback={<div className="flex aspect-[16/9] w-full items-center justify-center bg-muted text-primary"><ScissorsMark /></div>} /><CardContent className="flex flex-1 flex-col p-4"><div className="min-w-0"><h3 className="text-base font-semibold sm:text-lg">{service.name}</h3>{service.description && <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{service.description}</p>}<div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />{service.durationMin} {t("services.minutes")}</span>{typeof service.basePrice === "number" ? <span className="font-medium text-foreground">{formatMoney(service.basePrice, locale)}</span> : <span>{t("services.priceOnRequest")}</span>}</div></div><Button type="button" variant="outline" className="mt-4 min-h-11 w-full sm:w-auto sm:self-start" onClick={() => openBooking(service.id)}>{t("actions.bookService")}<ArrowRight className="size-4" aria-hidden="true" /></Button></CardContent></Card>)}</div>}
            </section>

            <section id="reviews" className="scroll-mt-8" aria-labelledby="reviews-heading">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t("reviews.eyebrow")}</p>
                  <h2 id="reviews-heading" className="mt-2 text-3xl font-semibold tracking-tight">{t("reviews.title")}</h2>
                </div>
                {shop.rating.count > 0 && <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-2 shadow-sm"><div className="flex items-center gap-0.5 text-primary" aria-label={`${reviewAverage?.toFixed(1)} ${t("reviews.stars")}`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-4 ${index < Math.round(reviewAverage ?? 0) ? "fill-current" : "text-muted-foreground/30"}`} aria-hidden="true" />)}</div><span className="font-semibold">{reviewAverage?.toFixed(1)}</span><span className="text-sm text-muted-foreground">({shop.rating.count})</span></div>}
              </div>
              {shop.rating.count === 0 ? <Card className="mt-5 border-dashed"><CardContent className="py-12 text-center text-sm text-muted-foreground">{t("reviews.empty")}</CardContent></Card> : <div className="mt-5 grid gap-3 sm:grid-cols-2">{reviews.map((review) => <ReviewItem key={review.id} review={review} locale={locale} t={t} />)}{reviewsError && <Alert variant="destructive" className="sm:col-span-2"><AlertCircle className="size-4" aria-hidden="true" /><AlertDescription>{reviewsError}</AlertDescription></Alert>}{reviewsMeta?.hasNext && <Button type="button" variant="outline" className="min-h-11 w-full sm:col-span-2" onClick={() => void loadMoreReviews()} disabled={reviewsLoading}>{reviewsLoading && <Loader2Icon />}{reviewsLoading ? t("reviews.loadingMore") : t("reviews.loadMore")}</Button>}</div>}
            </section>

            <section id="information" className="scroll-mt-8" aria-labelledby="information-heading">
              <div className="border-l-2 border-primary pl-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t("information.eyebrow")}</p><h2 id="information-heading" className="mt-2 text-3xl font-semibold tracking-tight">{t("information.title")}</h2></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader className="p-5 pb-3"><CardTitle className="flex items-center gap-2 text-base"><MapPin className="size-4 text-primary" aria-hidden="true" />{t("information.location")}</CardTitle></CardHeader>
                  <CardContent className="space-y-3 p-5 pt-0">
                    {address ? <><a href={mapUrl} target="_blank" rel="noreferrer" className="block break-words text-sm leading-6 text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{address}</a><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" size="sm" onClick={() => void navigator.clipboard?.writeText(address)}><Copy className="size-4" aria-hidden="true" />{t("information.copy")}</Button><Button asChild variant="outline" size="sm"><a href={mapUrl} target="_blank" rel="noreferrer"><ExternalLink className="size-4" aria-hidden="true" />{t("information.directions")}</a></Button></div></> : <p className="text-sm text-muted-foreground">{t("information.addressUnavailable")}</p>}
                    {(shop.phone || shop.email) && <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border/70 pt-3 text-sm text-muted-foreground">{shop.phone && <a href={`tel:${shop.phone}`} className="inline-flex min-h-11 items-center gap-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Phone className="size-4" aria-hidden="true" />{shop.phone}</a>}{shop.email && <a href={`mailto:${shop.email}`} className="inline-flex min-h-11 items-center gap-2 break-all hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Mail className="size-4" aria-hidden="true" />{shop.email}</a>}</div>}
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="p-5 pb-3"><CardTitle className="flex items-center gap-2 text-base"><Clock3 className="size-4 text-primary" aria-hidden="true" />{t("information.hours")}</CardTitle></CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="rounded-lg bg-muted/40 p-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("bookingCard.hoursToday")}</p><p className="mt-1 text-sm font-medium">{todayBusinessHours?.isClosed ? t("information.closed") : todayBusinessHours ? `${todayBusinessHours.openTime} – ${todayBusinessHours.closeTime}` : t("information.hoursUnavailable")}</p></div>
                    <details className="group mt-3 border-t border-border/70 pt-2">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"><span>{t("information.hours")}</span><ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-sm">{displayBusinessHours.map((hours) => <div key={hours.dayOfWeek} className="flex items-center justify-between gap-2"><span className="text-muted-foreground">{t(`days.${hours.dayOfWeek === 7 ? 0 : hours.dayOfWeek}`)}</span><span className={hours.isClosed ? "text-muted-foreground" : "font-medium"}>{hours.isClosed ? t("information.closed") : `${hours.openTime} – ${hours.closeTime}`}</span></div>)}</div>
                    </details>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Card className="overflow-hidden border-primary/30 shadow-md ring-1 ring-primary/10">
              <CardHeader className="border-b border-border/70 bg-muted/35 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CalendarDays className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle>{t("bookingCard.title")}</CardTitle>
                    <CardDescription className="mt-1">{t("bookingCard.description")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5 sm:p-6">
                <div className="grid gap-3">
                  <div className="rounded-xl border border-border/80 bg-background p-3.5">
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("bookingCard.hoursToday")}</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {todayBusinessHours?.isClosed ? t("information.closed") : todayBusinessHours ? `${todayBusinessHours.openTime} – ${todayBusinessHours.closeTime}` : t("information.hoursUnavailable")}
                        </p>
                      </div>
                      {openState !== null && <Badge variant={openState ? "default" : "outline"} className={openState ? "shrink-0 border-primary bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/20" : "shrink-0 border-border bg-muted text-xs text-muted-foreground"}>{openState ? t("shop.openNow") : t("shop.closedNow")}</Badge>}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-background p-3.5">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t("information.location")}</p>
                        {address ? <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-1 block text-sm font-medium leading-5 text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{address}</a> : <p className="mt-1 text-sm text-muted-foreground">{t("information.addressUnavailable")}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground"><UserRound className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{t("bookingCard.staff")}</span></div>
                <Separator />
                <Button type="button" size="lg" className="min-h-12 w-full shadow-sm" onClick={() => openBooking()}><CalendarDays className="size-4" aria-hidden="true" />{t("actions.book")}</Button>
                <p className="text-center text-xs text-muted-foreground">{t("bookingCard.note")}</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <PublicBookingSheet shop={shop} open={bookingOpen} onOpenChange={setBookingOpen} initialServiceId={bookingServiceId} restoredDraft={restoredDraft} onRequireAuth={handleRequireAuth} />
    </div>
  );
}

function StoreMark() {
  return <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-2xl font-semibold shadow-sm">S</div>;
}

function ScissorsMark() {
  return <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card"><Scissors aria-hidden="true" /></div>;
}

function Loader2Icon() {
  return <RefreshCw className="size-4 animate-spin" aria-hidden="true" />;
}
