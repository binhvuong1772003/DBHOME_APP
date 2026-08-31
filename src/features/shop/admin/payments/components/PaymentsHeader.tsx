import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PaymentsHeader() {
  const { t } = useTranslation("payments");
  return (
    <header className="flex items-start gap-3">
      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card text-primary shadow-sm">
        <CreditCard className="size-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("eyebrow")}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </div>
    </header>
  );
}
