import type { PaginationMeta } from "@/api/apiResponse";

export type CustomerRetentionStatus = "NEW" | "RETURNING";
export type CustomerSort = "SPEND_DESC" | "VISITS_DESC" | "RECENT_VISIT" | "LONGEST_INACTIVE" | "NEWEST";
export type CustomerRetentionFilter = "ALL" | "NEW" | "RETURNING";

export interface CustomerNextAppointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface CustomerListItem {
  id: string;
  shopCustomerId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  customerSince: string;
  lastVisitAt?: string | null;
  daysSinceLastVisit?: number | null;
  totalVisits: number;
  totalBookings: number;
  totalSpent: number;
  averageSpend: number;
  retentionStatus: CustomerRetentionStatus;
  nextAppointment?: CustomerNextAppointment | null;
}

export interface CustomerSummary {
  totalCustomers: number;
  returningCustomers: number;
  newCustomers: number;
  neverVisited: number;
}

export interface CustomerListMeta extends PaginationMeta { summary: CustomerSummary }
export interface CustomerListQuery {
  page: number;
  limit: number;
  search?: string;
  sort: CustomerSort;
  retention: CustomerRetentionFilter;
  hasUpcomingAppointment?: boolean;
  lastVisitBefore?: string;
}

export interface CustomerAppointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  services: Array<{ id: string; serviceName: string; priceAtBooking: number; durationMin: number }>;
  staff?: { id: string; name: string; avatarUrl?: string | null } | null;
  payment?: {
    id: string;
    amount: number;
    paidAmount: number;
    method: string;
    status: string;
    paidAt?: string | null;
    createdAt: string;
  } | null;
}

export interface CustomerDetail extends CustomerListItem {
  customer: { id: string; name: string; email: string; avatarUrl?: string | null; createdAt: string };
  firstVisitAt?: string | null;
  note?: string | null;
  mostBookedServices: Array<{ name: string; visits: number }>;
  mostVisitedStaff: Array<{ id: string; name: string; visits: number }>;
  appointments: CustomerAppointment[];
  upcomingAppointments: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    services: Array<{ id: string; serviceName: string }>;
    staff?: { id: string; name: string } | null;
  }>;
}
