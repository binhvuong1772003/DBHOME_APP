export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED"
  | "NO_SHOW";

export interface AppointmentStatusConfig {
  labelKey: string;
  cardClassName: string;
  badgeClassName: string;
  timeClassName: string;
}

export const appointmentStatusConfig: Record<
  AppointmentStatus,
  AppointmentStatusConfig
> = {
  CONFIRMED: {
    labelKey: "status.confirmed",
    cardClassName: "border-primary/25 bg-primary/10 text-foreground",
    badgeClassName: "bg-primary/15 text-primary",
    timeClassName: "text-primary",
  },
  PENDING: {
    labelKey: "status.pending",
    cardClassName: "border-chart-3/30 bg-chart-3/10 text-foreground",
    badgeClassName: "bg-chart-3/15 text-chart-3",
    timeClassName: "text-chart-3",
  },
  IN_PROGRESS: {
    labelKey: "status.inProgress",
    cardClassName: "border-secondary/30 bg-secondary/10 text-foreground",
    badgeClassName: "bg-secondary/20 text-secondary",
    timeClassName: "text-secondary",
  },
  DONE: {
    labelKey: "status.done",
    cardClassName: "border-chart-4/25 bg-chart-4/10 text-foreground",
    badgeClassName: "bg-chart-4/15 text-chart-4",
    timeClassName: "text-chart-4",
  },
  CANCELLED: {
    labelKey: "status.cancelled",
    cardClassName:
      "border-destructive/30 bg-destructive/10 text-foreground opacity-75",
    badgeClassName: "bg-destructive/15 text-destructive",
    timeClassName: "text-destructive",
  },
  NO_SHOW: {
    labelKey: "status.noShow",
    cardClassName: "border-border bg-muted/60 text-muted-foreground opacity-80",
    badgeClassName: "bg-muted text-muted-foreground",
    timeClassName: "text-muted-foreground",
  },
};
