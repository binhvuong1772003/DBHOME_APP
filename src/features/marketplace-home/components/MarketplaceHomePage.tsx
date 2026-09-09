import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Check,
  Clock3,
  Images,
  MapPin,
  Quote,
  Search,
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
import "./marketplace-home.css";

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

function ShopAvatar({
  shop,
  className = "size-10",
}: {
  shop: MarketplaceShop;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={shop.logoUrl ?? undefined} alt={shop.name} />
      <AvatarFallback>{initials(shop.name)}</AvatarFallback>
    </Avatar>
  );
}

function SalonLocation({
  shop,
  fallback,
}: {
  shop: MarketplaceShop;
  fallback: string;
}) {
  const location = [shop.address, shop.district, shop.city]
    .filter(Boolean)
    .join(", ");

  return (
    <span className="shn-home__location">
      <MapPin className="size-4" aria-hidden="true" />
      <span>{location || fallback}</span>
    </span>
  );
}

function SalonType({ shop, t }: { shop: MarketplaceShop; t: HomeTranslate }) {
  return (
    <span className="shn-home__salon-type">
      <Store className="size-4" aria-hidden="true" />
      {t(`salonType.${shop.type?.toLowerCase() ?? "combo"}`)}
    </span>
  );
}

function SalonCard({ shop, t }: { shop: MarketplaceShop; t: HomeTranslate }) {
  return (
    <article className="shn-home__salon-card">
      <div className="shn-home__salon-card-image">
        {shop.coverUrl ? (
          <img
            src={shop.coverUrl}
            alt={`${shop.name} cover`}
            loading="lazy"
            width="720"
            height="420"
          />
        ) : (
          <div className="shn-home__image-fallback">
            <Store className="size-8" aria-hidden="true" />
            <span>{t("salonCoverNotSet")}</span>
          </div>
        )}
      </div>
      <div className="shn-home__salon-card-content">
        <SalonType shop={shop} t={t} />
        <div className="shn-home__salon-card-heading">
          <ShopAvatar
            shop={shop}
            className="size-11 shrink-0 border border-border"
          />
          <h3>{shop.name}</h3>
        </div>
        <SalonLocation shop={shop} fallback={t("salonLocationNotSet")} />
        <div className="shn-home__salon-card-footer">
          <span>{t("salonServiceMenu")}</span>
          <Link to={`/shops/${shop.slug}`} className="shn-home__link">
            {t("exploreMenu")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ServiceCard({
  service,
  t,
}: {
  service: MarketplaceService;
  t: HomeTranslate;
}) {
  const price = formatPrice(service.basePrice);

  return (
    <article className="shn-home__service-card">
      <div className="shn-home__service-image">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name}
            loading="lazy"
            width="640"
            height="420"
          />
        ) : (
          <div className="shn-home__image-fallback">
            <Sparkles className="size-8" aria-hidden="true" />
            <span>{t("serviceImageNotSet")}</span>
          </div>
        )}
      </div>
      <div className="shn-home__service-content">
        <p className="shn-home__service-shop">{service.shopName}</p>
        <h3>{service.name}</h3>
        {service.description && (
          <p className="shn-home__service-description">{service.description}</p>
        )}
        <div className="shn-home__service-meta">
          <span>
            <Clock3 className="size-4" aria-hidden="true" />
            {t("services.duration", { minutes: service.durationMin })}
          </span>
          {price && <span className="shn-home__service-price">{price}</span>}
        </div>
        <Link
          to={`/shops/${service.shopSlug}`}
          state={{ openBookingServiceId: service.id }}
          className="shn-home__link shn-home__service-link"
        >
          {t("services.viewService")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function BookingPreview({
  shops,
  services,
  t,
  onOpenShop,
}: {
  shops: MarketplaceShop[];
  services: MarketplaceService[];
  t: HomeTranslate;
  onOpenShop: (shopSlug: string, serviceId?: string) => void;
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
      className="shn-home__booking"
      aria-labelledby="booking-preview-heading"
    >
      <div className="shn-home__shell shn-home__booking-grid">
        <div className="shn-home__booking-copy">
          <div className="shn-home__booking-icon">
            <CalendarCheck2 className="size-5" aria-hidden="true" />
          </div>
          <p className="shn-home__eyebrow shn-home__eyebrow--dark">
            {t("bookingPreview.eyebrow")}
          </p>
          <h2 id="booking-preview-heading">{t("bookingPreview.title")}</h2>
          <p>{t("bookingPreview.description")}</p>
          <ul className="shn-home__booking-points">
            <li>
              <Check className="size-4" aria-hidden="true" />
              {t("bookingPreview.point1")}
            </li>
            <li>
              <Check className="size-4" aria-hidden="true" />
              {t("bookingPreview.point2")}
            </li>
          </ul>
        </div>

        <div className="shn-home__booking-form">
          <ol className="shn-home__booking-steps">
            <li className="shn-home__booking-step">
              <span className="shn-home__step-number">1</span>
              <p>{t("bookingPreview.step1")}</p>
              <Select
                value={shopSlug}
                onValueChange={(value) => {
                  setShopSlug(value);
                  setServiceId("");
                }}
                disabled={shops.length === 0}
              >
                <SelectTrigger
                  className="shn-home__select"
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
            <li className="shn-home__booking-step">
              <span
                className={`shn-home__step-number ${selectedShop ? "" : "shn-home__step-number--muted"}`}
              >
                2
              </span>
              <p>{t("bookingPreview.step2")}</p>
              <Select
                value={serviceId}
                onValueChange={setServiceId}
                disabled={!selectedShop || shopServices.length === 0}
              >
                <SelectTrigger
                  className="shn-home__select"
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
            <li className="shn-home__booking-step">
              <span
                className={`shn-home__step-number ${canContinue ? "" : "shn-home__step-number--muted"}`}
              >
                3
              </span>
              <p>{t("bookingPreview.step3")}</p>
              <div className="shn-home__time-placeholder">
                <CalendarDays className="size-4" aria-hidden="true" />
                <span>{t("bookingPreview.timePlaceholder")}</span>
              </div>
            </li>
          </ol>
          <div className="shn-home__booking-actions">
            <p>{t("bookingPreview.note")}</p>
            <Button
              type="button"
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
}: {
  items: MarketplaceBeforeAfter[];
  t: HomeTranslate;
}) {
  return (
    <section
      id="before-after"
      className="shn-home__shell shn-home__section"
      aria-labelledby="before-after-heading"
    >
      <div className="shn-home__section-heading shn-home__section-heading--split">
        <div>
          <p className="shn-home__eyebrow">{t("beforeAfter.eyebrow")}</p>
          <h2 id="before-after-heading">{t("beforeAfter.title")}</h2>
          <p>{t("beforeAfter.description")}</p>
        </div>
        <div className="shn-home__section-mark">
          <Images className="size-5" aria-hidden="true" />
        </div>
      </div>
      {items.length === 0 ? (
        <div className="shn-home__empty-state">
          <div className="shn-home__empty-icon">
            <Images className="size-5" aria-hidden="true" />
          </div>
          <p>{t("beforeAfter.emptyTitle")}</p>
          <span>{t("beforeAfter.emptyDescription")}</span>
        </div>
      ) : (
        <div className="shn-home__before-after-grid">
          {items.map((item) => (
            <article key={item.id} className="shn-home__before-after-card">
              <div className="shn-home__before-after-images">
                <figure>
                  <img
                    src={item.beforeUrl}
                    alt={`${item.serviceName ?? t("beforeAfter.defaultService")} — ${t("beforeAfter.before")}`}
                    loading="lazy"
                    width="480"
                    height="480"
                  />
                  <figcaption>{t("beforeAfter.before")}</figcaption>
                </figure>
                <figure>
                  <img
                    src={item.afterUrl}
                    alt={`${item.serviceName ?? t("beforeAfter.defaultService")} — ${t("beforeAfter.after")}`}
                    loading="lazy"
                    width="480"
                    height="480"
                  />
                  <figcaption>{t("beforeAfter.after")}</figcaption>
                </figure>
              </div>
              {(item.serviceName || item.shopName) && (
                <div className="shn-home__before-after-meta">
                  <strong>{item.serviceName}</strong>
                  {item.shopSlug ? (
                    <Link to={`/shops/${item.shopSlug}`}>
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
    <article className="shn-home__testimonial">
      <Quote className="shn-home__quote-icon size-6" aria-hidden="true" />
      <div className="shn-home__testimonial-author">
        <Avatar className="size-10">
          <AvatarImage
            src={review.customer.avatarUrl ?? undefined}
            alt={review.customer.name}
          />
          <AvatarFallback>{initials(review.customer.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p>{review.customer.name}</p>
          <time dateTime={review.createdAt}>
            {formatReviewDate(review.createdAt, locale)}
          </time>
        </div>
      </div>
      <div
        className="shn-home__testimonial-rating"
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
      <p className="shn-home__testimonial-comment">
        {review.comment || t("testimonials.noComment")}
      </p>
      <Link
        to={`/shops/${review.shopSlug}`}
        className="shn-home__testimonial-link"
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
        <Skeleton key={index} className="shn-home__skeleton-card" />
      ))}
    </div>
  );
}

export default function MarketplaceHomePage() {
  const { t, i18n } = useTranslation("marketplace");
  const navigate = useNavigate();
  const {
    shops,
    services,
    loading,
    error,
    retry,
    testimonials,
    testimonialsLoading,
    testimonialsError,
  } = useMarketplaceHome();
  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

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
    scrollToSection(serviceQuery.trim() ? "services" : "salons");
  };
  const openSelectedShop = (shopSlug: string, serviceId?: string) =>
    navigate(`/shops/${shopSlug}`, {
      state: serviceId ? { openBookingServiceId: serviceId } : undefined,
    });
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const homeLanguageClass = i18n.resolvedLanguage?.startsWith("en")
    ? "shn-home--en"
    : "shn-home--vi";
  const beforeAfterItems: MarketplaceBeforeAfter[] = [];

  return (
    <div className={`shn-home ${homeLanguageClass}`}>
      <Navbar className="shn-home-nav" />
      <main>
        <div className="shn-home__first-view">
          <section className="shn-home__hero" aria-labelledby="home-heading">
            <div className="shn-home__shell shn-home__hero-grid">
              <div className="shn-home__hero-copy">
                <p className="shn-home__eyebrow">{t("eyebrow")}</p>
                <h1 id="home-heading" className="shn-home__hero-title">
                  {t("hero.title")}
                </h1>
                <p className="shn-home__hero-description">
                  {t("hero.description")}
                </p>
                <form
                  onSubmit={submitSearch}
                  className="shn-home__search"
                  role="search"
                >
                  <label className="shn-home__search-field">
                    <Search className="size-5" aria-hidden="true" />
                    <Input
                      aria-label={t("search.serviceLabel")}
                      value={serviceQuery}
                      onChange={(event) => setServiceQuery(event.target.value)}
                      placeholder={t("search.servicePlaceholder")}
                    />
                  </label>
                  <label className="shn-home__search-field">
                    <MapPin className="size-5" aria-hidden="true" />
                    <Input
                      aria-label={t("search.locationLabel")}
                      value={locationQuery}
                      onChange={(event) => setLocationQuery(event.target.value)}
                      placeholder={t("search.locationPlaceholder")}
                    />
                  </label>
                  <Button type="submit" className="shn-home__search-button">
                    {t("search.submit")}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </form>
                <div className="shn-home__cta-row">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => scrollToSection("services")}
                  >
                    {t("hero.primaryCta")}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection("salons")}
                  >
                    {t("hero.secondaryCta")}
                  </Button>
                </div>
                <div
                  className="shn-home__trust"
                  aria-label={t("hero.description")}
                >
                  {[t("hero.point1"), t("hero.point2"), t("hero.point3")].map(
                    (point) => (
                      <span key={point}>
                        <Check className="size-4" aria-hidden="true" />
                        {point}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div
                className="shn-home__hero-art"
                aria-label={t("hero.cardLabel")}
              >
                <figure className="shn-home__hero-image shn-home__hero-image--main">
                  <img
                    src={editorialImages[0].src}
                    alt={editorialImages[0].alt}
                    width="860"
                    height="980"
                  />
                </figure>
                <div className="shn-home__hero-aside">
                  <figure className="shn-home__hero-image shn-home__hero-image--detail">
                    <img
                      src={editorialImages[1].src}
                      alt={editorialImages[1].alt}
                      width="560"
                      height="620"
                      loading="lazy"
                    />
                  </figure>
                  <div className="shn-home__hero-note">
                    <Spade className="size-5" aria-hidden="true" />
                    <div>
                      <p>{t("hero.cardLabel")}</p>
                      <strong>{t("hero.cardTitle")}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="shn-home__summary"
            aria-label={t("footer.dataNote")}
          >
            <div className="shn-home__shell shn-home__summary-inner">
              <div className="shn-home__summary-item">
                <Store className="size-5" aria-hidden="true" />
                <span>
                  <strong>{loading ? "—" : visibleShops.length}</strong>
                  <small>{t("salons.available")}</small>
                </span>
              </div>
              <div className="shn-home__summary-item">
                <Sparkles className="size-5" aria-hidden="true" />
                <span>
                  <strong>{loading ? "—" : visibleServices.length}</strong>
                  <small>{t("serviceMenu")}</small>
                </span>
              </div>
              <div className="shn-home__summary-note">
                <CalendarCheck2 className="size-5" aria-hidden="true" />
                <span>{t("footer.dataNote")}</span>
              </div>
            </div>
          </section>
        </div>

        <section
          id="services"
          className="shn-home__shell shn-home__section"
          aria-labelledby="services-heading"
        >
          <div className="shn-home__section-heading">
            <div>
              <p className="shn-home__eyebrow">{t("services.eyebrow")}</p>
              <h2 id="services-heading">{t("services.title")}</h2>
              <p>{t("services.description")}</p>
            </div>
            <span className="shn-home__section-count">
              {visibleServices.length} {t("services.viewAll")}
            </span>
          </div>
          {loading ? (
            <LoadingCards
              count={4}
              className="shn-home__service-grid shn-home__service-grid--loading"
            />
          ) : visibleServices.length === 0 ? (
            <div className="shn-home__empty-state">
              <Sparkles className="size-5" aria-hidden="true" />
              <p>{t("states.noServices")}</p>
            </div>
          ) : (
            <div className="shn-home__service-grid">
              {visibleServices.map((service) => (
                <ServiceCard
                  key={`${service.shopSlug}-${service.id}`}
                  service={service}
                  t={t}
                />
              ))}
            </div>
          )}
        </section>

        <section
          id="salons"
          className="shn-home__section shn-home__section--sage"
          aria-labelledby="salons-heading"
        >
          <div className="shn-home__shell">
            <div className="shn-home__section-heading">
              <div>
                <p className="shn-home__eyebrow">{t("salons.eyebrow")}</p>
                <h2 id="salons-heading">{t("salons.title")}</h2>
                <p>{t("salons.description")}</p>
              </div>
              <span className="shn-home__section-count">
                {visibleShops.length} {t("salons.available")}
              </span>
            </div>
            {error ? (
              <div className="shn-home__state-card" role="alert">
                <Store className="size-5" aria-hidden="true" />
                <p>{t("states.loadError")}</p>
                <Button type="button" variant="outline" onClick={retry}>
                  {t("states.retry")}
                </Button>
              </div>
            ) : loading ? (
              <LoadingCards
                count={3}
                className="shn-home__salon-grid shn-home__salon-grid--loading"
              />
            ) : visibleShops.length === 0 ? (
              <div className="shn-home__empty-state">
                <Store className="size-5" aria-hidden="true" />
                <p>{t("states.noSalons")}</p>
              </div>
            ) : (
              <div className="shn-home__salon-grid">
                {visibleShops.slice(0, 6).map((shop) => (
                  <SalonCard key={shop.id} shop={shop} t={t} />
                ))}
              </div>
            )}
          </div>
        </section>

        <BeforeAfterGallery items={beforeAfterItems} t={t} />
        <BookingPreview
          shops={shops}
          services={services}
          t={t}
          onOpenShop={openSelectedShop}
        />

        <section
          className="shn-home__shell shn-home__section"
          aria-labelledby="testimonials-heading"
        >
          <div className="shn-home__section-heading shn-home__section-heading--split">
            <div>
              <p className="shn-home__eyebrow">{t("testimonials.eyebrow")}</p>
              <h2 id="testimonials-heading">{t("testimonials.title")}</h2>
              <p>{t("testimonials.description")}</p>
            </div>
            <Quote className="shn-home__section-mark" aria-hidden="true" />
          </div>
          {testimonialsLoading ? (
            <LoadingCards
              count={3}
              className="shn-home__testimonial-grid shn-home__testimonial-grid--loading"
            />
          ) : testimonialsError ? (
            <div className="shn-home__state-card" role="alert">
              <Quote className="size-5" aria-hidden="true" />
              <p>{t("testimonials.unavailable")}</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="shn-home__empty-state">
              <Quote className="size-5" aria-hidden="true" />
              <p>{t("testimonials.empty")}</p>
            </div>
          ) : (
            <div className="shn-home__testimonial-grid">
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
          className="shn-home__section shn-home__section--blush"
          aria-labelledby="collections-heading"
        >
          <div className="shn-home__shell shn-home__collections">
            <div className="shn-home__collection-copy">
              <p className="shn-home__eyebrow">{t("collections.eyebrow")}</p>
              <h2 id="collections-heading">{t("collections.title")}</h2>
              <p>{t("collections.description")}</p>
            </div>
            <div className="shn-home__collection-grid">
              {collections.map((collection) => (
                <article
                  key={collection.titleKey}
                  className="shn-home__collection"
                >
                  <img
                    src={collection.image.src}
                    alt={collection.image.alt}
                    loading="lazy"
                    width="560"
                    height="680"
                  />
                  <div className="shn-home__collection-label">
                    <h3>{t(`collections.${collection.titleKey}.title`)}</h3>
                    <p>{t(`collections.${collection.titleKey}.description`)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="shn-home__final-cta"
          aria-labelledby="final-cta-heading"
        >
          <div className="shn-home__shell shn-home__final-card">
            <div>
              <p className="shn-home__eyebrow">{t("finalCta.eyebrow")}</p>
              <h2 id="final-cta-heading">{t("finalCta.title")}</h2>
              <p>{t("finalCta.description")}</p>
            </div>
            <Button
              type="button"
              size="lg"
              onClick={() => scrollToSection("salons")}
            >
              {t("finalCta.action")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>
      <footer className="shn-home__footer">
        <div className="shn-home__shell shn-home__footer-inner">
          <div>
            <strong>SHN</strong>
            <span>{t("footer.tagline")}</span>
          </div>
          <nav aria-label={t("primaryNavigation")}>
            <Link to="/#services">{t("nav.services")}</Link>
            <Link to="/#salons">{t("nav.salons")}</Link>
            <Link to="/#booking-preview">{t("bookingPreview.cta")}</Link>
          </nav>
          <p>{t("footer.dataNote")}</p>
        </div>
      </footer>
    </div>
  );
}
