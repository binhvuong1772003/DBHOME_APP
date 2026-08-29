import {
  CalendarCheck,
  CalendarDays,
  CalendarOff,
  Clock3,
  LayoutDashboard,
  UserRound,
  WalletCards,
} from "lucide-react";

export const staffNavigation = [
  { labelKey: "navigation.overview", path: "", icon: LayoutDashboard, emphasized: false },
  { labelKey: "navigation.schedule", path: "/schedule", icon: CalendarDays, emphasized: true },
  { labelKey: "navigation.workSchedule", path: "/work-schedule", icon: CalendarCheck, emphasized: false },
  { labelKey: "navigation.attendance", path: "/attendance", icon: Clock3, emphasized: false },
  { labelKey: "navigation.timeOff", path: "/time-off", icon: CalendarOff, emphasized: false },
  { labelKey: "navigation.payroll", path: "/payroll", icon: WalletCards, emphasized: false },
  { labelKey: "navigation.profile", path: "/profile", icon: UserRound, emphasized: false },
] as const;
