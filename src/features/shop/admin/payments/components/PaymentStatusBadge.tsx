import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "../types/payment";

const statusClasses: Record<PaymentStatus, string> = {
  PAID: "border-primary/25 bg-primary/10 text-primary",
  PENDING: "border-border bg-muted text-muted-foreground",
  PARTIAL: "border-secondary/30 bg-secondary/15 text-secondary-foreground",
  REFUNDED: "border-destructive/25 bg-destructive/10 text-destructive",
};

export function PaymentStatusBadge({ status, label }: { status: PaymentStatus; label: string }) {
  return <Badge className={cn("whitespace-nowrap", statusClasses[status])}>{label}</Badge>;
}
