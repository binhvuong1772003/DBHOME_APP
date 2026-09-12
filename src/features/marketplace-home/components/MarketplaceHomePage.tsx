import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Check,
  Flower2,
  Hand,
  Heart,
  Images,
  MapPin,
  Quote,
  Search,
  Scissors,
  Sparkles,
  Spade,
  Star,
  Store,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/common/Navbar";
import { useMarketplaceHome } from "../hooks/useMarketplaceHome";
import type {
  MarketplaceBeforeAfter,
  MarketplaceService,
  MarketplaceShop,
  MarketplaceTestimonial,
} from "../types";
import type { ShopType } from "@/type/shop";
import {
  discoveryCategories,
  popularMockServices,
  popularMockShops,
  recommendedMockServices,
  recommendedMockShops,
  type DiscoveryCategory,
  type DiscoveryMockService,
  type DiscoveryMockShop,
} from "../mock/discoveryMockData";

const editorialImages = [
  {
    src: "https://kozynail.ca/assets/home/values/professionalism.jpg",
    alt: "Warm, modern manicure stations in a nail studio",
  },
  {
    src: "https://spaseekers.imgix.net/m/0/studleytreatmentroom.jpg?auto=format&fit=min&h=680&ixlib=gatsbyHook-2.1.3&w=1020",
    alt: "Calm spa treatment room with soft neutral linens",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0639/2741/9138/files/expocosmetica-1312208_1920.jpg?v=1666674181",
    alt: "Nail artist creating a detailed manicure design",
  },
];

const collections = [
  { titleKey: "quietLuxury", image: editorialImages[1] },
  { titleKey: "nailEdit", image: editorialImages[2] },
  { titleKey: "resetRituals", image: editorialImages[0] },
] as const;

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

type HomeTranslate = (key: string, options?: Record<string, unknown>) => string;

const homeShellClass =
  "mx-auto w-[calc(100%_-_3rem)] max-w-[78rem] max-[767px]:w-[calc(100%_-_1.5rem)]";
const homeSectionClass = "py-[clamp(4.5rem,8vw,7rem)] max-[767px]:py-16";
const homeEyebrowClass =
  "relative inline-flex items-center gap-[0.65rem] text-[0.7rem] font-bold uppercase leading-[1.4] tracking-[0.16em] text-primary before:h-px before:w-8 before:bg-current before:content-['']";
const homeSectionTitleClass =
  "mt-[0.55rem] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.05] tracking-[-0.055em] text-foreground text-balance max-[767px]:text-[clamp(2rem,10vw,3rem)]";
const homeDescriptionClass =
  "mt-4 max-w-[39rem] text-[0.9rem] leading-[1.75] text-muted-foreground";
const homeCardClass =
  "min-w-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm";
const homeButtonClass =
  "min-h-11 rounded-[0.8rem] font-semibold touch-manipulation transition-[background-color,border-color,color,box-shadow,transform] duration-[180ms] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-[0.55] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";
const homeLinkClass =
  "inline-flex min-h-11 items-center gap-[0.35rem] font-semibold text-[0.78rem] text-primary touch-manipulation hover:underline hover:underline-offset-[0.2em] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";
const homeStateClass =
  "mt-9 flex min-h-44 items-center justify-center gap-[0.7rem] rounded-[1.2rem] border border-dashed border-border bg-card p-8 text-center text-muted-foreground";
const homeConnectorClass =
  "before:absolute before:top-4 before:-left-[0.9rem] before:h-px before:w-[0.9rem] before:bg-border before:content-[''] max-[767px]:before:top-[-0.5rem] max-[767px]:before:left-4 max-[767px]:before:h-2 max-[767px]:before:w-px";

function formatPrice(price?: number) {
  return typeof price === "number" ? money.format(price) : null;
}

function initials(name?: string | null) {
  return (
    (name ?? "SHN")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SHN"
  );
}

function formatReviewDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function BookingPreview({
  shops,
  services,
  t,
  onOpenShop,
  headingClass,
}: {
  shops: MarketplaceShop[];
  services: MarketplaceService[];
  t: HomeTranslate;
  onOpenShop: (shopSlug: string, serviceId?: string) => void;
  headingClass: string;
}) {
  const [shopSlug, setShopSlug] = useState("");
  const [serviceId, setServiceId] = useState("");
  const selectedShop = shops.find((shop) => shop.slug === shopSlug);
  const shopServices = selectedShop
    ? services.filter((service) => service.shopSlug === selectedShop.slug)
    : [];
  const canContinue = Boolean(selectedShop && serviceId);

  return (
    <section
      id="booking-preview"
      className="border-y border-border bg-accent"
      aria-labelledby="booking-preview-heading"
    >
      <div
        className={`${homeShellClass} grid grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] items-center gap-[clamp(2.5rem,7vw,7rem)] py-[clamp(3.5rem,7vw,5.5rem)] max-[1100px]:grid-cols-1 max-[1100px]:gap-[clamp(2.5rem,7vw,7rem)] max-[767px]:gap-[1.8rem]`}
      >
        <div className="max-w-[31rem] max-[1100px]:max-w-2xl">
          <div className="flex size-[2.85rem] items-center justify-center rounded-2xl border border-border bg-card text-primary">
            <CalendarCheck2 className="size-5" aria-hidden="true" />
          </div>
          <p
            className={`${homeEyebrowClass} mt-[1.4rem] text-accent-foreground`}
          >
            {t("bookingPreview.eyebrow")}
          </p>
          <h2
            id="booking-preview-heading"
            className={`${homeSectionTitleClass} max-w-[14ch] ${headingClass}`}
          >
            {t("bookingPreview.title")}
          </h2>
          <p className="mt-4 text-[0.9rem] leading-[1.75] text-accent-foreground">
            {t("bookingPreview.description")}
          </p>
          <ul className="mt-[1.35rem] grid gap-[0.7rem] text-[0.8rem] text-accent-foreground">
            <li className="flex items-start gap-[0.55rem]">
              <Check
                className="mt-[0.1rem] size-4 shrink-0"
                aria-hidden="true"
              />
              {t("bookingPreview.point1")}
            </li>
            <li className="flex items-start gap-[0.55rem]">
              <Check
                className="mt-[0.1rem] size-4 shrink-0"
                aria-hidden="true"
              />
              {t("bookingPreview.point2")}
            </li>
          </ul>
        </div>

        <div className="rounded-[1.35rem] border border-border bg-card p-[clamp(1.25rem,3vw,1.8rem)] shadow-md">
          <ol className="grid grid-cols-3 gap-[0.9rem] max-[767px]:grid-cols-1 max-[767px]:gap-4">
            <li className="relative min-w-0">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-[0.75rem] font-bold text-primary-foreground">
                1
              </span>
              <p className="mt-[0.6rem] min-h-[2.4rem] text-[0.8rem] font-semibold leading-[1.45] max-[767px]:min-h-0">
                {t("bookingPreview.step1")}
              </p>
              <Select
                value={shopSlug}
                onValueChange={(value) => {
                  setShopSlug(value);
                  setServiceId("");
                }}
                disabled={shops.length === 0}
              >
                <SelectTrigger
                  className="mt-2 min-h-[2.85rem] w-full rounded-[0.8rem] border-input bg-background text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  aria-label={t("bookingPreview.step1")}
                >
                  <SelectValue
                    placeholder={
                      shops.length
                        ? t("bookingPreview.shopPlaceholder")
                        : t("bookingPreview.noShops")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop.id} value={shop.slug}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>
            <li className={`relative min-w-0 ${homeConnectorClass}`}>
              <span
                className={`flex size-8 items-center justify-center rounded-full text-[0.75rem] font-bold ${selectedShop ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </span>
              <p className="mt-[0.6rem] min-h-[2.4rem] text-[0.8rem] font-semibold leading-[1.45] max-[767px]:min-h-0">
                {t("bookingPreview.step2")}
              </p>
              <Select
                value={serviceId}
                onValueChange={setServiceId}
                disabled={!selectedShop || shopServices.length === 0}
              >
                <SelectTrigger
                  className="mt-2 min-h-[2.85rem] w-full rounded-[0.8rem] border-input bg-background text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  aria-label={t("bookingPreview.step2")}
                >
                  <SelectValue
                    placeholder={
                      selectedShop
                        ? shopServices.length
                          ? t("bookingPreview.servicePlaceholder")
                          : t("bookingPreview.noServices")
                        : t("bookingPreview.selectShopFirst")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {shopServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>
            <li className={`relative min-w-0 ${homeConnectorClass}`}>
              <span
                className={`flex size-8 items-center justify-center rounded-full text-[0.75rem] font-bold ${canContinue ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                3
              </span>
              <p className="mt-[0.6rem] min-h-[2.4rem] text-[0.8rem] font-semibold leading-[1.45] max-[767px]:min-h-0">
                {t("bookingPreview.step3")}
              </p>
              <div className="mt-2 flex min-h-[2.85rem] w-full items-center gap-[0.45rem] rounded-[0.8rem] border border-dashed border-input px-3 text-[0.76rem] leading-[1.35] text-muted-foreground">
                <CalendarDays
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{t("bookingPreview.timePlaceholder")}</span>
              </div>
            </li>
          </ol>
          <div className="mt-[1.4rem] flex items-center justify-between gap-4 border-t border-border pt-[1.1rem] max-[767px]:items-stretch max-[767px]:flex-col">
            <p className="max-w-64 text-[0.72rem] leading-normal text-muted-foreground max-[767px]:max-w-none">
              {t("bookingPreview.note")}
            </p>
            <Button
              type="button"
              className={`${homeButtonClass} min-h-[2.85rem] shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground`}
              disabled={!canContinue}
              onClick={() =>
                selectedShop && onOpenShop(selectedShop.slug, serviceId)
              }
            >
              {t("bookingPreview.cta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforeAfterGallery({
  items,
  t,
  headingClass,
}: {
  items: MarketplaceBeforeAfter[];
  t: HomeTranslate;
  headingClass: string;
}) {
  return (
    <section
      id="before-after"
      className={`${homeShellClass} ${homeSectionClass}`}
      aria-labelledby="before-after-heading"
    >
      <div className="flex items-start justify-between gap-8 max-[767px]:flex-col max-[767px]:gap-[0.8rem]">
        <div>
          <p className={homeEyebrowClass}>{t("beforeAfter.eyebrow")}</p>
          <h2
            id="before-after-heading"
            className={`${homeSectionTitleClass} max-w-[19ch] ${headingClass}`}
          >
            {t("beforeAfter.title")}
          </h2>
          <p className={homeDescriptionClass}>{t("beforeAfter.description")}</p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-primary">
          <Images className="size-5" aria-hidden="true" />
        </div>
      </div>
      {items.length === 0 ? (
        <div className={`${homeStateClass} flex-col`}>
          <div className="flex size-11 items-center justify-center rounded-full border border-border text-primary">
            <Images className="size-5" aria-hidden="true" />
          </div>
          <p className="text-[0.85rem] font-semibold text-foreground">
            {t("beforeAfter.emptyTitle")}
          </p>
          <span className="max-w-[34rem] text-[0.8rem] leading-[1.6]">
            {t("beforeAfter.emptyDescription")}
          </span>
        </div>
      ) : (
        <div className="mt-9 grid grid-cols-2 gap-4 max-[767px]:grid-cols-1">
          {items.map((item) => (
            <article key={item.id} className={`${homeCardClass}`}>
              <div className="grid grid-cols-2">
                <figure className="relative min-w-0">
                  <img
                    src={item.beforeUrl}
                    alt={`${item.serviceName ?? t("beforeAfter.defaultService")} — ${t("beforeAfter.before")}`}
                    loading="lazy"
                    width="480"
                    height="480"
                    className="block size-full aspect-square object-cover"
                  />
                  <figcaption className="absolute inset-x-[0.65rem] bottom-[0.65rem] rounded-[0.55rem] bg-card px-[0.6rem] py-[0.45rem] text-[0.68rem] font-bold uppercase tracking-[0.1em] text-foreground">
                    {t("beforeAfter.before")}
                  </figcaption>
                </figure>
                <figure className="relative min-w-0 border-l border-border">
                  <img
                    src={item.afterUrl}
                    alt={`${item.serviceName ?? t("beforeAfter.defaultService")} — ${t("beforeAfter.after")}`}
                    loading="lazy"
                    width="480"
                    height="480"
                    className="block size-full aspect-square object-cover"
                  />
                  <figcaption className="absolute inset-x-[0.65rem] bottom-[0.65rem] rounded-[0.55rem] bg-card px-[0.6rem] py-[0.45rem] text-[0.68rem] font-bold uppercase tracking-[0.1em] text-foreground">
                    {t("beforeAfter.after")}
                  </figcaption>
                </figure>
              </div>
              {(item.serviceName || item.shopName) && (
                <div className="flex items-center justify-between gap-3 px-4 py-[0.9rem] text-[0.78rem] max-[560px]:items-start max-[560px]:flex-col">
                  <strong className="font-semibold">{item.serviceName}</strong>
                  {item.shopSlug ? (
                    <Link
                      to={`/shops/${item.shopSlug}`}
                      className="inline-flex min-h-9 items-center gap-[0.35rem] font-semibold text-primary touch-manipulation hover:underline hover:underline-offset-[0.2em] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                    >
                      {item.shopName}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    item.shopName && <span>{item.shopName}</span>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function TestimonialCard({
  review,
  locale,
  t,
}: {
  review: MarketplaceTestimonial;
  locale: string;
  t: HomeTranslate;
}) {
  return (
    <article
      className={`${homeCardClass} relative flex min-h-[17rem] flex-col p-[1.35rem]`}
    >
      <Quote
        className="absolute right-[1.35rem] top-[1.35rem] size-6 text-primary opacity-50"
        aria-hidden="true"
      />
      <div className="flex min-w-0 items-center gap-[0.7rem]">
        <Avatar className="size-10">
          <AvatarImage
            src={review.customer.avatarUrl ?? undefined}
            alt={review.customer.name}
          />
          <AvatarFallback>{initials(review.customer.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-[0.82rem] font-semibold">
            {review.customer.name}
          </p>
          <time
            className="text-[0.7rem] text-muted-foreground"
            dateTime={review.createdAt}
          >
            {formatReviewDate(review.createdAt, locale)}
          </time>
        </div>
      </div>
      <div
        className="mt-4 flex gap-[0.15rem] text-primary"
        aria-label={`${review.rating} ${t("testimonials.stars")}`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`size-4 ${index < review.rating ? "fill-current" : "text-muted-foreground/40"}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="mt-[0.8rem] line-clamp-4 text-[0.84rem] leading-[1.7] text-muted-foreground">
        {review.comment || t("testimonials.noComment")}
      </p>
      <Link
        to={`/shops/${review.shopSlug}`}
        className={`${homeLinkClass} mt-auto pt-[0.8rem]`}
      >
        {review.shopName}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function LoadingCards({
  count,
  className,
}: {
  count: number;
  className: string;
}) {
  return (
    <div className={className} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          className="min-h-80 rounded-3xl border border-border bg-muted"
        />
      ))}
    </div>
  );
}

type DiscoveryMode = "services" | "salons";

function DiscoveryModeToggle({
  value,
  onChange,
  t,
}: {
  value: DiscoveryMode;
  onChange: (value: DiscoveryMode) => void;
  t: HomeTranslate;
}) {
  return (
    <div
      className="inline-flex min-h-11 items-center rounded-full border border-border bg-card p-1"
      role="group"
      aria-label={t("discovery.toggleLabel")}
    >
      {(["services", "salons"] as const).map((mode) => {
        const selected = value === mode;
        return (
          <button
            key={mode}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(mode)}
            className={`min-h-11 rounded-full px-4 text-[0.76rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 max-[420px]:px-3 ${selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            {t(`discovery.tabs.${mode}`)}
          </button>
        );
      })}
    </div>
  );
}

function DiscoveryServiceCard({
  service,
  t,
}: {
  service: DiscoveryMockService;
  t: HomeTranslate;
}) {
  return (
    <article className={`${homeCardClass} group flex min-w-0 flex-col`}>
      <Link
        to={`/shops/${service.shopSlug}/book`}
        className="relative block aspect-[1.12] overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]"
        aria-label={`${t("discovery.viewAndBook")}: ${service.name}`}
      >
        <img
          src={service.imageUrl}
          alt={service.name}
          loading="lazy"
          width="900"
          height="800"
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        <span className="absolute left-3 top-3 rounded-full border border-border bg-card/95 px-2.5 py-1 text-[0.68rem] font-semibold text-foreground shadow-sm">
          {t("discovery.preview")}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-foreground">
          {service.name}
        </h3>
        <p className="mt-1 text-[0.78rem] font-medium text-foreground/80">
          {service.shopName}
        </p>
        <p className="mt-2 flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{service.location}</span>
        </p>
        <p className="mt-2 line-clamp-2 text-[0.78rem] leading-relaxed text-muted-foreground">
          {service.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <span className="text-[0.8rem] text-muted-foreground">
            {formatPrice(service.price)} · {t("services.duration", { minutes: service.durationMin })}
          </span>
          <Link
            to={`/shops/${service.shopSlug}/book`}
            className={`${homeLinkClass} text-[0.76rem]`}
          >
            {t("discovery.viewAndBook")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function DiscoveryShopCard({
  shop,
  t,
}: {
  shop: DiscoveryMockShop;
  t: HomeTranslate;
}) {
  return (
    <article className={`${homeCardClass} group flex min-w-0 flex-col`}>
      <Link
        to={`/shops/${shop.slug}`}
        className="relative block aspect-[1.45] overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]"
        aria-label={`${t("discovery.viewSalon")}: ${shop.name}`}
      >
        <img
          src={shop.coverUrl}
          alt={shop.name}
          loading="lazy"
          width="1200"
          height="820"
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        <span className="absolute left-3 top-3 rounded-full border border-border bg-card/95 px-2.5 py-1 text-[0.68rem] font-semibold text-foreground shadow-sm">
          {t("discovery.preview")}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-base font-semibold leading-snug text-foreground">
            {shop.name}
          </h3>
          <span className="shrink-0 rounded-full border border-border px-2 py-1 text-[0.65rem] font-semibold text-muted-foreground">
            {t(`salonType.${shop.type.toLowerCase()}`)}
          </span>
        </div>
        <p className="mt-2 flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{shop.location}</span>
        </p>
        <p className="mt-2 line-clamp-2 text-[0.78rem] leading-relaxed text-muted-foreground">
          {shop.description}
        </p>
        <Link
          to={`/shops/${shop.slug}`}
          className={`${homeLinkClass} mt-auto pt-4 text-[0.76rem]`}
        >
          {t("discovery.viewSalon")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function DiscoverySection({
  id,
  titleKey,
  descriptionKey,
  services,
  shops,
  mode,
  onModeChange,
  t,
  headingClass,
}: {
  id: string;
  titleKey: "recommended" | "popular";
  descriptionKey: "recommendedDescription" | "popularDescription";
  services: DiscoveryMockService[];
  shops: DiscoveryMockShop[];
  mode: DiscoveryMode;
  onModeChange: (value: DiscoveryMode) => void;
  t: HomeTranslate;
  headingClass: string;
}) {
  const isServices = mode === "services";
  return (
    <section
      id={id}
      className={`${homeShellClass} ${homeSectionClass}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="flex items-end justify-between gap-8 max-[767px]:items-start max-[767px]:flex-col max-[767px]:gap-5">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className={homeEyebrowClass}>{t(`discovery.${titleKey}.eyebrow`)}</p>
            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[0.65rem] font-semibold text-muted-foreground">
              {t("discovery.preview")}
            </span>
          </div>
          <h2
            id={`${id}-heading`}
            className={`${homeSectionTitleClass} max-w-[19ch] ${headingClass}`}
          >
            {t(`discovery.${titleKey}.title`)}
          </h2>
          <p className={homeDescriptionClass}>{t(`discovery.${descriptionKey}`)}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-4 max-[767px]:w-full max-[767px]:justify-between">
          <DiscoveryModeToggle value={mode} onChange={onModeChange} t={t} />
          <Link
            to={isServices ? "/shops" : "/shops"}
            className={`${homeLinkClass} whitespace-nowrap`}
          >
            {t("discovery.viewAll")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="mt-9 grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[767px]:grid-cols-1">
        {isServices
          ? services.map((service) => (
              <DiscoveryServiceCard key={service.id} service={service} t={t} />
            ))
          : shops.map((shop) => <DiscoveryShopCard key={shop.id} shop={shop} t={t} />)}
      </div>
    </section>
  );
}

function CategoryIcon({ category }: { category: DiscoveryCategory }) {
  const iconProps = { className: "size-6", "aria-hidden": true } as const;
  if (category.icon === "scissors") return <Scissors {...iconProps} />;
  if (category.icon === "flower") return <Flower2 {...iconProps} />;
  if (category.icon === "hand") return <Hand {...iconProps} />;
  if (category.icon === "heart") return <Heart {...iconProps} />;
  return <Sparkles {...iconProps} />;
}

function ExploreCategoriesSection({
  t,
  headingClass,
  onSelect,
}: {
  t: HomeTranslate;
  headingClass: string;
  onSelect: (shopType: ShopType) => void;
}) {
  return (
    <section
      id="discover-categories"
      className="border-y border-border bg-muted"
      aria-labelledby="discover-categories-heading"
    >
      <div className={`${homeShellClass} ${homeSectionClass}`}>
        <div className="flex items-end justify-between gap-8 max-[767px]:items-start max-[767px]:flex-col max-[767px]:gap-3">
          <div>
            <p className={homeEyebrowClass}>{t("discovery.categories.eyebrow")}</p>
            <h2
              id="discover-categories-heading"
              className={`${homeSectionTitleClass} max-w-[18ch] ${headingClass}`}
            >
              {t("discovery.categories.title")}
            </h2>
            <p className={homeDescriptionClass}>{t("discovery.categories.description")}</p>
          </div>
          <Sparkles className="size-10 shrink-0 text-primary" aria-hidden="true" />
        </div>
        <div className="mt-9 grid grid-cols-5 gap-3 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2">
          {discoveryCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.shopType)}
              className="group flex min-h-32 flex-col items-start justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 motion-reduce:transition-none max-[560px]:min-h-28"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <CategoryIcon category={category} />
              </span>
              <span className="mt-4 text-sm font-semibold text-foreground">
                {t(`discovery.categories.items.${category.labelKey}`)}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-primary">
                {t("discovery.categories.explore")}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function MarketplaceHomePage() {
  const { t, i18n } = useTranslation("marketplace");
  const navigate = useNavigate();
  const {
    shops,
    services,
    loading,
    testimonials,
    testimonialsLoading,
    testimonialsError,
  } = useMarketplaceHome();
  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [recommendedMode, setRecommendedMode] = useState<DiscoveryMode>("services");
  const [popularMode, setPopularMode] = useState<DiscoveryMode>("services");

  const visibleShops = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    return query
      ? shops.filter((shop) =>
          [shop.name, shop.address, shop.city, shop.district]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query),
        )
      : shops;
  }, [locationQuery, shops]);

  const visibleServices = useMemo(() => {
    const query = serviceQuery.trim().toLowerCase();
    return query
      ? services.filter((service) =>
          `${service.name} ${service.description ?? ""} ${service.shopName}`
            .toLowerCase()
            .includes(query),
        )
      : services;
  }, [serviceQuery, services]);

  const scrollToSection = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const search = serviceQuery.trim();
    const city = locationQuery.trim();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    navigate(`/shops${params.toString() ? `?${params.toString()}` : ""}`);
  };
  const searchCategory = (shopType: ShopType) => {
    navigate(`/shops?type=${shopType}`);
  };
  const openSelectedShop = (shopSlug: string, serviceId?: string) =>
    navigate(`/shops/${shopSlug}/book`, {
      state: serviceId ? { openBookingServiceId: serviceId } : undefined,
    });
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const isEnglish = i18n.resolvedLanguage?.startsWith("en");
  const homeLanguageClass = isEnglish
    ? "font-['Inter',sans-serif]"
    : "font-sans";
  const headingClass = isEnglish ? "font-serif" : "font-sans";
  const beforeAfterItems: MarketplaceBeforeAfter[] = [];

  return (
    <div
      className={`${homeLanguageClass} min-h-dvh overflow-x-clip bg-background text-foreground`}
    >
      <Navbar />
      <main>
        <div className="flex min-h-[calc(100svh-4.5rem)] flex-col">
          <section
            className="flex flex-1 flex-col bg-background"
            aria-labelledby="home-heading"
          >
            <div
              className={`${homeShellClass} grid flex-1 grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-[clamp(2.5rem,5vw,5rem)] pt-[clamp(0.75rem,2vw,1.75rem)] max-[1100px]:grid-cols-1 max-[1100px]:gap-[clamp(2.5rem,5vw,5rem)] max-[1100px]:pt-[clamp(0.75rem,2vw,1.75rem)] max-[767px]:gap-8 max-[767px]:pt-8 max-[767px]:pb-2`}
            >
              <div className="max-w-[38rem] max-[1100px]:max-w-[46rem]">
                <p className={homeEyebrowClass}>{t("eyebrow")}</p>
                <h1
                  id="home-heading"
                  className={`${headingClass} mt-5 max-w-[12ch] text-[clamp(2.9rem,5.7vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-foreground text-balance max-[767px]:max-w-[13ch] max-[767px]:text-[clamp(2.65rem,13vw,4.2rem)]`}
                >
                  {t("hero.title")}
                </h1>
                <p className="mt-6 max-w-[35rem] text-base leading-[1.8] text-muted-foreground max-[767px]:text-[0.92rem]">
                  {t("hero.description")}
                </p>
                <form
                  onSubmit={submitSearch}
                  className="mt-8 grid grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)_auto] gap-2 rounded-[1.1rem] border border-border bg-card p-[0.45rem] shadow-sm max-[560px]:grid-cols-1 max-[560px]:rounded-2xl"
                  role="search"
                >
                  <label className="flex min-h-[3.15rem] min-w-0 items-center gap-[0.65rem] rounded-[0.8rem] bg-muted px-[0.9rem] focus-within:outline-2 focus-within:outline-ring focus-within:outline-offset-1">
                    <Search
                      className="size-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <Input
                      aria-label={t("search.serviceLabel")}
                      value={serviceQuery}
                      onChange={(event) => setServiceQuery(event.target.value)}
                      placeholder={t("search.servicePlaceholder")}
                      className="h-11 min-w-0 border-0 bg-transparent px-0 shadow-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground placeholder:opacity-90"
                    />
                  </label>
                  <label className="flex min-h-[3.15rem] min-w-0 items-center gap-[0.65rem] rounded-[0.8rem] bg-muted px-[0.9rem] focus-within:outline-2 focus-within:outline-ring focus-within:outline-offset-1">
                    <MapPin
                      className="size-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <Input
                      aria-label={t("search.locationLabel")}
                      value={locationQuery}
                      onChange={(event) => setLocationQuery(event.target.value)}
                      placeholder={t("search.locationPlaceholder")}
                      className="h-11 min-w-0 border-0 bg-transparent px-0 shadow-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground placeholder:opacity-90"
                    />
                  </label>
                  <Button
                    type="submit"
                    className={`${homeButtonClass} inline-flex h-[3.15rem] min-h-[3.15rem] items-center justify-center gap-2 whitespace-nowrap rounded-[0.8rem] bg-primary px-[1.15rem] leading-none text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground max-[560px]:w-full`}
                  >
                    {t("search.submit")}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </form>
                <div className="mt-4 flex flex-wrap gap-[0.7rem] max-[560px]:flex-col">
                  <Button
                    type="button"
                    size="lg"
                    className={`${homeButtonClass} min-h-[2.9rem] bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground max-[560px]:w-full`}
                    onClick={() => scrollToSection("discover-recommended")}
                  >
                    {t("hero.primaryCta")}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className={`${homeButtonClass} min-h-[2.9rem] border-border bg-transparent text-foreground shadow-none hover:bg-transparent hover:text-foreground max-[560px]:w-full`}
                    onClick={() => navigate("/shops")}
                  >
                    {t("hero.secondaryCta")}
                  </Button>
                </div>
                <div
                  className="mt-[1.3rem] flex flex-wrap gap-x-[1.3rem] gap-y-3 text-[0.78rem] text-muted-foreground"
                  aria-label={t("hero.description")}
                >
                  {[t("hero.point1"), t("hero.point2"), t("hero.point3")].map(
                    (point) => (
                      <span
                        key={point}
                        className="inline-flex items-center gap-[0.4rem]"
                      >
                        <Check
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                        {point}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div
                className="grid min-h-[30rem] grid-cols-[minmax(0,1.12fr)_minmax(10rem,0.88fr)] gap-[0.85rem] max-[1100px]:min-h-[28rem] max-[767px]:min-h-[25rem] max-[560px]:grid-cols-[minmax(0,1.12fr)_minmax(6rem,0.88fr)] max-[560px]:min-h-[23rem]"
                aria-label={t("hero.cardLabel")}
              >
                <figure className="min-h-full overflow-hidden rounded-[1.7rem] border border-border bg-muted shadow-md max-[767px]:rounded-3xl">
                  <img
                    src={editorialImages[0].src}
                    alt={editorialImages[0].alt}
                    width="860"
                    height="980"
                    className="block size-full object-cover"
                  />
                </figure>
                <div className="grid grid-rows-[minmax(15rem,1fr)_auto] gap-[0.85rem] max-[560px]:grid-rows-[minmax(10rem,1fr)_auto]">
                  <figure className="min-h-[15rem] overflow-hidden rounded-[1.35rem] border border-border bg-muted shadow-md max-[767px]:rounded-3xl">
                    <img
                      src={editorialImages[1].src}
                      alt={editorialImages[1].alt}
                      width="560"
                      height="620"
                      loading="lazy"
                      className="block size-full object-cover"
                    />
                  </figure>
                  <div className="flex items-start gap-[0.8rem] rounded-[1.1rem] border border-border bg-card p-[1.1rem] shadow-sm max-[767px]:p-[0.9rem]">
                    <Spade
                      className="mt-[0.15rem] size-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-primary">
                        {t("hero.cardLabel")}
                      </p>
                      <strong className="mt-[0.35rem] block text-[0.84rem] font-semibold leading-normal max-[560px]:text-[0.74rem]">
                        {t("hero.cardTitle")}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="border-b border-border bg-muted"
            aria-label={t("footer.dataNote")}
          >
            <div
              className={`${homeShellClass} grid grid-cols-[minmax(10rem,0.7fr)_minmax(10rem,0.7fr)_minmax(0,1.6fr)] items-center gap-4 py-[0.6rem] max-[767px]:grid-cols-2`}
            >
              <div className="flex min-w-0 items-center gap-[0.65rem]">
                <Store
                  className="size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="flex min-w-0 items-baseline gap-[0.45rem]">
                  <strong className="text-[1.35rem] font-bold leading-none text-foreground">
                    {loading ? "—" : visibleShops.length}
                  </strong>
                  <small className="truncate text-[0.7rem] text-muted-foreground">
                    {t("salons.available")}
                  </small>
                </span>
              </div>
              <div className="flex min-w-0 items-center gap-[0.65rem]">
                <Sparkles
                  className="size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="flex min-w-0 items-baseline gap-[0.45rem]">
                  <strong className="text-[1.35rem] font-bold leading-none text-foreground">
                    {loading ? "—" : visibleServices.length}
                  </strong>
                  <small className="truncate text-[0.7rem] text-muted-foreground">
                    {t("serviceMenu")}
                  </small>
                </span>
              </div>
              <div className="flex min-w-0 items-center justify-end gap-[0.65rem] text-right text-[0.78rem] leading-normal text-foreground max-[767px]:col-span-full max-[767px]:justify-start max-[767px]:text-left">
                <CalendarCheck2
                  className="size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{t("footer.dataNote")}</span>
              </div>
            </div>
          </section>
        </div>

        <DiscoverySection
          id="discover-recommended"
          titleKey="recommended"
          descriptionKey="recommendedDescription"
          services={recommendedMockServices}
          shops={recommendedMockShops}
          mode={recommendedMode}
          onModeChange={setRecommendedMode}
          t={t}
          headingClass={headingClass}
        />

        <DiscoverySection
          id="discover-popular"
          titleKey="popular"
          descriptionKey="popularDescription"
          services={popularMockServices}
          shops={popularMockShops}
          mode={popularMode}
          onModeChange={setPopularMode}
          t={t}
          headingClass={headingClass}
        />

        <ExploreCategoriesSection
          t={t}
          headingClass={headingClass}
          onSelect={searchCategory}
        />

        <BeforeAfterGallery
          items={beforeAfterItems}
          t={t}
          headingClass={headingClass}
        />
        <BookingPreview
          shops={shops}
          services={services}
          t={t}
          onOpenShop={openSelectedShop}
          headingClass={headingClass}
        />

        <section
          className={`${homeShellClass} ${homeSectionClass}`}
          aria-labelledby="testimonials-heading"
        >
          <div className="flex items-start justify-between gap-8 max-[767px]:flex-col max-[767px]:gap-[0.8rem]">
            <div>
              <p className={homeEyebrowClass}>{t("testimonials.eyebrow")}</p>
              <h2
                id="testimonials-heading"
                className={`${homeSectionTitleClass} max-w-[19ch] ${headingClass}`}
              >
                {t("testimonials.title")}
              </h2>
              <p className={homeDescriptionClass}>
                {t("testimonials.description")}
              </p>
            </div>
            <Quote
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-primary"
              aria-hidden="true"
            />
          </div>
          {testimonialsLoading ? (
            <LoadingCards
              count={3}
              className="mt-[2.3rem] grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[767px]:grid-cols-1"
            />
          ) : testimonialsError ? (
            <div className={`${homeStateClass} flex-wrap`} role="alert">
              <Quote className="size-5 text-primary" aria-hidden="true" />
              <p className="text-[0.85rem] font-semibold text-foreground">
                {t("testimonials.unavailable")}
              </p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className={`${homeStateClass} flex-col`}>
              <Quote className="size-5 text-primary" aria-hidden="true" />
              <p className="text-[0.85rem] font-semibold text-foreground">
                {t("testimonials.empty")}
              </p>
            </div>
          ) : (
            <div className="mt-[2.3rem] grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[767px]:grid-cols-1">
              {testimonials.map((review) => (
                <TestimonialCard
                  key={review.id}
                  review={review}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          )}
        </section>

        <section
          id="collections"
          className={`${homeSectionClass} border-y border-border bg-muted`}
          aria-labelledby="collections-heading"
        >
          <div
            className={`${homeShellClass} grid grid-cols-[minmax(12rem,0.72fr)_minmax(0,1.28fr)] items-end gap-10 max-[1100px]:grid-cols-1`}
          >
            <div className="max-w-96">
              <p className={homeEyebrowClass}>{t("collections.eyebrow")}</p>
              <h2
                id="collections-heading"
                className={`${homeSectionTitleClass} max-w-[19ch] ${headingClass}`}
              >
                {t("collections.title")}
              </h2>
              <p className={homeDescriptionClass}>
                {t("collections.description")}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-[0.8rem] max-[767px]:grid-cols-[repeat(3,minmax(9rem,1fr))] max-[767px]:overflow-x-auto max-[767px]:pb-[0.35rem]">
              {collections.map((collection) => (
                <article
                  key={collection.titleKey}
                  className="group relative min-h-[19rem] overflow-hidden rounded-[1.2rem] border border-border bg-muted max-[767px]:min-h-[15rem]"
                >
                  <img
                    src={collection.image.src}
                    alt={collection.image.alt}
                    loading="lazy"
                    width="560"
                    height="680"
                    className="block size-full object-cover transition-transform duration-450 ease-in-out group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                  <div className="absolute inset-x-[0.7rem] bottom-[0.7rem] rounded-[0.85rem] border border-border bg-card p-[0.8rem] text-foreground shadow-sm">
                    <h3
                      className={`${headingClass} text-[0.82rem] font-semibold`}
                    >
                      {t(`collections.${collection.titleKey}.title`)}
                    </h3>
                    <p className="mt-[0.2rem] text-[0.72rem] leading-[1.45] text-muted-foreground">
                      {t(`collections.${collection.titleKey}.description`)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="py-[clamp(4.5rem,8vw,7rem)]"
          aria-labelledby="final-cta-heading"
        >
          <div
            className={`${homeShellClass} flex items-end justify-between gap-8 rounded-4xl border border-border bg-card p-[clamp(1.5rem,5vw,3.5rem)] shadow-md max-[767px]:items-start max-[767px]:flex-col`}
          >
            <div>
              <p className={homeEyebrowClass}>{t("finalCta.eyebrow")}</p>
              <h2
                id="final-cta-heading"
                className={`${homeSectionTitleClass} max-w-[16ch] ${headingClass}`}
              >
                {t("finalCta.title")}
              </h2>
              <p className={homeDescriptionClass}>
                {t("finalCta.description")}
              </p>
            </div>
            <Button
              type="button"
              size="lg"
              className={`${homeButtonClass} min-h-[2.9rem] shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground max-[767px]:w-full`}
              onClick={() => navigate("/shops")}
            >
              {t("finalCta.action")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-card">
        <div
          className={`${homeShellClass} flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6 text-[0.75rem] text-muted-foreground max-[767px]:items-start max-[767px]:flex-col`}
        >
          <div className="flex items-center gap-[0.7rem]">
            <strong className="text-[0.95rem] font-semibold tracking-[0.08em] text-primary">
              SHN
            </strong>
            <span>{t("footer.tagline")}</span>
          </div>
          <nav
            className="flex flex-wrap gap-x-5 gap-y-3"
            aria-label={t("primaryNavigation")}
          >
            <Link
              className="touch-manipulation hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
              to="/#discover-recommended"
            >
              {t("nav.services")}
            </Link>
            <Link
              className="touch-manipulation hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
              to="/shops"
            >
              {t("nav.salons")}
            </Link>
            <Link
              className="touch-manipulation hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
              to="/#booking-preview"
            >
              {t("bookingPreview.cta")}
            </Link>
          </nav>
          <p>{t("footer.dataNote")}</p>
        </div>
      </footer>
    </div>
  );
}
