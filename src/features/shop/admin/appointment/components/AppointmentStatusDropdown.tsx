import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  appointmentStatusConfig,
  appointmentTransitions,
  type AppointmentStatus,
  type AppointmentStatusUpdate,
  type AppointmentTransitionStatus,
} from "@/features/shop/admin/appointment/constants/appointmentStatus";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CancelAppointmentDialog } from "./CancelAppointmentDialog";

export type ChangeableAppointmentStatus = AppointmentTransitionStatus;

interface AppointmentStatusDropdownProps {
  status: AppointmentStatus;
  onStatusChange: (
    input: AppointmentStatusUpdate,
  ) => void | Promise<boolean | void>;
  disabled?: boolean;
  className?: string;
}

export function AppointmentStatusDropdown({
  status,
  onStatusChange,
  disabled = false,
  className,
}: AppointmentStatusDropdownProps) {
  const { t } = useTranslation("appointment");
  const [cancelOpen, setCancelOpen] = useState(false);
  const config = appointmentStatusConfig[status];
  const statusLabel = t(config.labelKey);
  const statusOptions = appointmentTransitions[status];

  if (!statusOptions.length) {
    return (
      <span
        className={cn(
          "inline-flex h-9 items-center rounded-xl px-3 text-xs font-semibold",
          config.badgeClassName,
          className,
        )}
      >
        {statusLabel}
      </span>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            aria-label={t("status.change", { status: statusLabel })}
            className={cn(
              "h-9 rounded-xl px-3 text-xs font-semibold",
              config.badgeClassName,
              className,
            )}
          >
            {statusLabel}
            <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              className="focus:bg-muted focus:text-foreground"
              onSelect={() => {
                if (option === "CANCELLED") setCancelOpen(true);
                else void onStatusChange({ status: option });
              }}
            >
              {t(appointmentStatusConfig[option].labelKey)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {cancelOpen ? (
        <CancelAppointmentDialog
          open={cancelOpen}
          isSubmitting={disabled}
          onOpenChange={setCancelOpen}
          onConfirm={async (cancelReason) => {
            return await onStatusChange({
              status: "CANCELLED",
              cancelReason,
            });
          }}
        />
      ) : null}
    </>
  );
}
