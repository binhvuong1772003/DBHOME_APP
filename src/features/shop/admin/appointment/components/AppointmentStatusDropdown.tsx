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
  type AppointmentStatus,
} from "@/features/shop/admin/appointment/constants/appointmentStatus";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type ChangeableAppointmentStatus = Exclude<
  AppointmentStatus,
  "PENDING"
>;

interface AppointmentStatusDropdownProps {
  status: AppointmentStatus;
  onStatusChange: (status: ChangeableAppointmentStatus) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

const statusOptions: ChangeableAppointmentStatus[] = [
  "CONFIRMED",
  "IN_PROGRESS",
  "DONE",
  "NO_SHOW",
  "CANCELLED",
];

export function AppointmentStatusDropdown({
  status,
  onStatusChange,
  disabled = false,
  className,
}: AppointmentStatusDropdownProps) {
  const { t } = useTranslation("appointment");
  const config = appointmentStatusConfig[status];
  const statusLabel = t(config.labelKey);

  return (
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
        {statusOptions
          .filter((option) => option !== status)
          .map((option) => (
            <DropdownMenuItem
              key={option}
              className="focus:bg-muted focus:text-foreground"
              onSelect={() => void onStatusChange(option)}
            >
              {t(appointmentStatusConfig[option].labelKey)}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
