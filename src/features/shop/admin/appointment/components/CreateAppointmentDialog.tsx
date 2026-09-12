import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCustomers } from "@/features/shop/admin/customers/services/customerService";
import type { CustomerListItem } from "@/features/shop/admin/customers/types/customer";
import type { Staff } from "@/features/shop/admin/staff/types/staff";
import type { Service } from "@/types/service";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { createManagerAppointment } from "../services/appointmentService";

interface CreateAppointmentDialogProps {
  shopSlug: string;
  open: boolean;
  selectedDate: string;
  staffs: Staff[];
  services: Service[];
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void> | void;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function CreateAppointmentDialog({
  shopSlug,
  open,
  selectedDate,
  staffs,
  services,
  onOpenChange,
  onCreated,
}: CreateAppointmentDialogProps) {
  const { t } = useTranslation("appointment");
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [staffId, setStaffId] = useState("unassigned");
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState("09:00");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === customerId),
    [customerId, customers],
  );

  useEffect(() => {
    if (!open) return;
    setDate(selectedDate);
    setCustomerId("");
    setCustomerSearch("");
    setStaffId("unassigned");
    setStartTime("09:00");
    setServiceIds([]);
    setNote("");
    setError("");
  }, [open, selectedDate]);

  useEffect(() => {
    if (!open || !shopSlug) return;
    let cancelled = false;
    setIsLoadingCustomers(true);
    const timer = window.setTimeout(() => {
      void getCustomers(shopSlug, {
        page: 1,
        limit: 20,
        search: customerSearch.trim() || undefined,
        sort: "RECENT_VISIT",
        retention: "ALL",
      })
        .then((response) => {
          if (!cancelled) setCustomers(response.data ?? []);
        })
        .catch((requestError: unknown) => {
          if (!cancelled) {
            setCustomers([]);
            setError(
              getApiErrorMessage(requestError, t("create.loadCustomersError")),
            );
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoadingCustomers(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [customerSearch, open, shopSlug, t]);

  const submit = async () => {
    if (!customerId || !date || !startTime || serviceIds.length === 0) {
      setError(t("create.validation"));
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await createManagerAppointment(shopSlug, {
        customerId,
        date,
        startTime,
        staffId: staffId === "unassigned" ? undefined : staffId,
        serviceIds,
        note: note.trim() || undefined,
        source: "PHONE",
      });
      await onCreated();
      onOpenChange(false);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t("create.submitError")));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className="max-h-[min(90dvh,48rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="appointment-customer-search">{t("create.customer")}</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="appointment-customer-search"
                value={customerSearch}
                onChange={(event) => setCustomerSearch(event.target.value)}
                placeholder={t("create.customerPlaceholder")}
                className="pl-9"
              />
            </div>
            <div className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-border p-1">
              {isLoadingCustomers ? (
                <p className="p-3 text-sm text-muted-foreground">{t("create.loadingCustomers")}</p>
              ) : customers.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">{t("create.noCustomers")}</p>
              ) : (
                customers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${customer.id === customerId ? "bg-primary/10" : ""}`}
                    onClick={() => setCustomerId(customer.id)}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src={customer.avatarUrl ?? undefined} alt="" />
                      <AvatarFallback>{initials(customer.name) || <UserRound className="size-4" aria-hidden="true" />}</AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{customer.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{customer.phone ?? customer.email}</span>
                  </button>
                ))
              )}
            </div>
            {selectedCustomer ? <p className="text-xs text-primary">{t("create.selectedCustomer", { name: selectedCustomer.name })}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment-date">{t("create.date")}</Label>
            <Input id="appointment-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointment-start-time">{t("create.startTime")}</Label>
            <Input id="appointment-start-time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>{t("create.staff")}</Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger className="min-h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">{t("details.unassigned")}</SelectItem>
                {staffs.filter((staff) => staff.isActive).map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>{staff.nickname || staff.user?.name || staff.user?.email || staff.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>{t("create.services")}</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <label key={service.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 hover:bg-muted">
                  <Checkbox
                    checked={serviceIds.includes(service.id)}
                    onCheckedChange={(checked) => setServiceIds((current) => checked ? [...new Set([...current, service.id])] : current.filter((id) => id !== service.id))}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">{service.name}</span>
                  <span className="text-xs text-muted-foreground">{service.durationMin} {t("details.minutesShort")}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="appointment-note">{t("create.note")}</Label>
            <Textarea id="appointment-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} placeholder={t("create.notePlaceholder")} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" className="min-h-11" disabled={isSubmitting} onClick={() => onOpenChange(false)}>{t("cancelDialog.keep")}</Button>
          <Button type="button" className="min-h-11" disabled={isSubmitting} onClick={() => void submit()}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            {isSubmitting ? t("create.submitting") : t("create.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
