import { Badge } from "@/components/ui/badge";
import type { PaymentMethod } from "../types/payment";

export function PaymentMethodBadge({ method, label }: { method: PaymentMethod; label: string }) {
  return (
    <Badge data-method={method} className="whitespace-nowrap border-border bg-background font-normal text-foreground">
      {label}
    </Badge>
  );
}
