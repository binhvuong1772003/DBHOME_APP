export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type AppointmentTransitionStatus = Exclude<AppointmentStatus, "PENDING">;

export interface AppointmentStatusUpdate {
  status: AppointmentTransitionStatus;
  staffId?: string;
  cancelReason?: string;
  reason?: string;
  internalNote?: string;
}

export const appointmentTransitions: Record<
  AppointmentStatus,
  AppointmentTransitionStatus[]
> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED", "NO_SHOW"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export interface AppointmentStatusConfig {
  labelKey: string;
  cardClassName: string;
  badgeClassName: string;
  statusClassName: string;
  timeClassName: string;
}

export const appointmentStatusConfig: Record<
  AppointmentStatus,
  AppointmentStatusConfig
> = {
  CONFIRMED: {
    labelKey: "status.confirmed",
    cardClassName: "border-border bg-muted text-foreground",
    badgeClassName: "bg-muted text-foreground",
    statusClassName: "border-border bg-muted text-foreground",
    timeClassName: "text-foreground",
  },
  PENDING: {
    labelKey: "status.pending",
    cardClassName: "border-warning/30 bg-warning/10 text-foreground",
    badgeClassName: "bg-warning/15 text-warning",
    statusClassName: "border-warning/30 bg-warning/10 text-warning",
    timeClassName: "text-warning",
  },
  IN_PROGRESS: {
    labelKey: "status.inProgress",
    cardClassName: "border-primary/25 bg-primary/10 text-foreground",
    badgeClassName: "bg-primary/15 text-primary",
    statusClassName: "border-primary/25 bg-primary/10 text-primary",
    timeClassName: "text-primary",
  },
  COMPLETED: {
    labelKey: "status.completed",
    cardClassName: "border-success/30 bg-success/10 text-foreground",
    badgeClassName: "bg-success/15 text-success",
    statusClassName: "border-success/30 bg-success/10 text-success",
    timeClassName: "text-success",
  },
  CANCELLED: {
    labelKey: "status.cancelled",
    cardClassName:
      "border-destructive/30 bg-destructive/10 text-foreground opacity-75",
    badgeClassName: "bg-destructive/15 text-destructive",
    statusClassName: "border-destructive/30 bg-destructive/10 text-destructive",
    timeClassName: "text-destructive",
  },
  NO_SHOW: {
    labelKey: "status.noShow",
    cardClassName: "border-border bg-muted/60 text-muted-foreground opacity-80",
    badgeClassName: "bg-muted text-muted-foreground",
    statusClassName: "border-border bg-muted/60 text-muted-foreground",
    timeClassName: "text-muted-foreground",
  },
};
