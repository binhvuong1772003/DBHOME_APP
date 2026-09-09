import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CustomersHeader } from "./CustomersHeader";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerSummary } from "./CustomerSummary";
import { CustomerTable } from "./CustomerTable";
import { useCustomers } from "../hooks/useCustomers";

export function CustomersPageContent() {
  const { t, i18n } = useTranslation("customers");
  const customers = useCustomers();
  const navigate = useNavigate();
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  return <main className="min-h-full bg-background text-foreground"><div className="mx-auto w-full max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8"><CustomersHeader /><CustomerSummary summary={customers.meta.summary} isLoading={customers.isLoading && customers.items.length === 0} /><CustomerFilters search={customers.search} retention={customers.retention} sort={customers.sort} hasUpcomingAppointment={customers.hasUpcomingAppointment} lastVisitBefore={customers.lastVisitBefore} onSearch={customers.setSearch} onRetention={customers.setRetention} onSort={customers.setSort} onUpcoming={customers.setUpcoming} onLastVisit={customers.setLastVisit} onReset={customers.resetFilters} />{customers.error ? <Alert variant="destructive"><AlertCircle aria-hidden="true" /><AlertTitle>{t("loadError")}</AlertTitle><AlertDescription><p>{customers.error}</p><Button type="button" className="mt-3 min-h-11" size="sm" variant="outline" onClick={() => void customers.refetch()}>{t("retry")}</Button></AlertDescription></Alert> : <CustomerTable customers={customers.items} meta={customers.meta} locale={locale} isLoading={customers.isLoading} onSelect={(customerId) => navigate(`/shops/${customers.shopSlug}/admin/customers/${customerId}`)} onPageChange={customers.setPage} />}</div></main>;
}
