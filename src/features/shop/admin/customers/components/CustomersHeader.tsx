import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CustomersHeader() {
  const { t } = useTranslation("customers");
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <Users className="size-4 text-primary" aria-hidden="true" />
          <span>{t("header.eyebrow")}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t("header.title")}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("header.description")}</p>
      </div>
    </header>
  );
}
