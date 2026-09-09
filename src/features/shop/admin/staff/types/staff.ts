export type StaffRole = "OWNER" | "MANAGER" | "STAFF";

export type StaffDisplayStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export type StaffRoleFilter = "ALL" | StaffRole;

export type StaffStatusFilter = "ALL" | StaffDisplayStatus;

export type StaffSort = "RECENT" | "NAME_ASC" | "NAME_DESC" | "REVENUE";

export interface StaffListQuery {
  page: number;
  limit: number;
  search?: string;
  role?: StaffRoleFilter;
  status?: StaffStatusFilter;
  sort?: StaffSort;
}

export interface StaffListResponse {
  data: Staff[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type StaffViewMode = "LIST" | "GRID";

export interface StaffSchedule {
  id?: string;
  shopStaffId?: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isOff?: boolean;
  shift?: string;
}

export interface StaffScheduleDay {
  id: string;
  shopStaffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOff: boolean;
}

export interface StaffScheduleOffDay {
  id: string;
  shopStaffId: string;
  offDate: string;
  offDateEnd?: string | null;
  reason?: string | null;
  rejectReason?: string | null;
  approvedBy?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface StaffScheduleResponse {
  shopId: string;
  staffId: string;
  schedule: StaffScheduleDay[];
  offDays: StaffScheduleOffDay[];
}

export interface StaffUser {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
}

export interface Staff {
  id: string;
  shopId: string;
  userId: string;
  nickname?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  role: StaffRole;
  isActive: boolean;
  joinedAt: string;
  leftAt?: string;
  notes?: string;
  totalServiced: number;
  avgRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
  user?: StaffUser;
  schedule?: StaffSchedule | null;
  isOnLeave?: boolean;
  appointmentsToday?: number;
  revenueToday?: number;
}

export interface InviteStaffInput {
  invitedEmail: string;
  role: StaffRole;
}

export interface UpdateStaffInput {
  role?: StaffRole;
  isActive?: boolean;
}

export interface StaffServiceAssignment {
  id: string;
  shopStaffId: string;
  serviceId: string;
  isActive: boolean;
  service: import("@/types/service").Service;
}

export interface StaffStats {
  total: number;
  active: number;
  inactive: number;
  manager: number;
  owner: number;
  staff: number;
  workingToday: number;
  onLeave: number;
  shiftCount: number;
  joinedThisMonth: number;
  returningTomorrow: number;
}

export type StaffDialogMode =
  | "CREATE"
  | "EDIT"
  | "DETAIL"
  | "SCHEDULE"
  | "DEACTIVATE"
  | "SERVICES"
  | null;
