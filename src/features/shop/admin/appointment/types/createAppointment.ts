export interface CreateAppointmentInput {
  date: string;
  startTime: string;
  customerId: string;
  staffId?: string;
  serviceIds?: string[];
  packageIds?: string[];
  addonIds?: string[];
  note?: string;
  source?: "APP" | "WALK_IN" | "PHONE" | "ZALO" | "WEBSITE";
}
