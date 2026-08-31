import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/features/shop/admin/financial-report/utils/formatCurrency";

interface BreakdownSource {
  services: Array<{
    id: string;
    serviceName: string;
    priceAtBooking: number;
    selectedValues: Array<{
      id: string;
      priceAtBooking: number;
      optionValue: { name: string };
    }>;
  }>;
  packages: Array<{
    id: string;
    priceAtBooking: number;
    package: { name: string };
    addons?: Array<{
      id: string;
      extraPrice: number;
      addon: { name: string };
    }>;
  }>;
  addons: Array<{
    id: string;
    priceAtBooking: number;
    addon: { name: string };
  }>;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
}

export function PaymentBreakdown({ source }: { source: BreakdownSource }) {
  const { t, i18n } = useTranslation("payments");
  const rows = [
    ...source.services.flatMap((service) => [
      { id: service.id, name: service.serviceName, price: service.priceAtBooking },
      ...service.selectedValues.map((value) => ({
        id: value.id,
        name: t("detail.option", { name: value.optionValue.name }),
        price: value.priceAtBooking,
      })),
    ]),
    ...source.packages.flatMap((item) => [
      { id: item.id, name: t("detail.package", { name: item.package.name }), price: item.priceAtBooking },
      ...(item.addons ?? []).map((addon) => ({
        id: addon.id,
        name: t("detail.addon", { name: addon.addon.name }),
        price: addon.extraPrice,
      })),
    ]),
    ...source.addons.map((item) => ({
      id: item.id,
      name: t("detail.addon", { name: item.addon.name }),
      price: item.priceAtBooking,
    })),
  ];

  return (
    <div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-start justify-between gap-4 text-sm">
            <div>
              <p>{row.name}</p>
              <p className="text-xs text-muted-foreground">{t("detail.quantity")}: 1</p>
            </div>
            <p className="shrink-0 font-medium tabular-nums">{formatCurrency(row.price, i18n.language)}</p>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <dl className="space-y-2 text-sm">
        <TotalRow label={t("detail.subtotal")} value={source.subtotal} locale={i18n.language} />
        {source.discountAmount > 0 ? <TotalRow label={t("detail.discount")} value={-source.discountAmount} locale={i18n.language} /> : null}
        <TotalRow label={t("detail.total")} value={source.totalAmount} locale={i18n.language} strong />
      </dl>
    </div>
  );
}

function TotalRow({ label, value, locale, strong }: { label: string; value: number; locale: string; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between font-semibold" : "flex justify-between text-muted-foreground"}>
      <dt>{label}</dt>
      <dd className="tabular-nums text-foreground">{formatCurrency(value, locale)}</dd>
    </div>
  );
}
