import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse, PaginatedApiResponse } from "@/api/apiResponse";
import type { InviteStaffInput, Staff, StaffListQuery, StaffListResponse, StaffScheduleResponse, StaffServiceAssignment, UpdateStaffInput } from "../types/staff";
import type { StaffAttendance, StaffTimeOffPage } from "../types/staffOperations";

export const getStaffs = async (shopSlug: string, query: StaffListQuery): Promise<StaffListResponse> => {
  const params = Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== "ALL"),
  );
  const { data: response } = await axiosClient.get<PaginatedApiResponse<Staff[], StaffListResponse["meta"]>>(
    `/api/shops/${shopSlug}/staff`,
    { params },
  );
  return { data: response.data, meta: response.meta };
};

export const inviteStaff = async (
  shopSlug: string,
  input: InviteStaffInput,
): Promise<void> => {
  await axiosClient.post(`/api/shops/${shopSlug}/staff/invite`, input);
};

export const updateStaff = async (
  shopSlug: string,
  staffId: string,
  input: UpdateStaffInput,
): Promise<Staff> => {
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<Staff>>(
    `/api/shops/${shopSlug}/staff/${staffId}/info`,
    input,
  );
  return response.data;
};

export const getStaffSchedule = async (
  shopSlug: string,
  staffId: string,
): Promise<StaffScheduleResponse> => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<StaffScheduleResponse>>(
    `/api/shops/${shopSlug}/staff/${staffId}/schedule`,
  );
  return response.data;
};

export const updateStaffSchedule = async (
  shopSlug: string,
  staffId: string,
  schedule: StaffScheduleResponse["schedule"],
): Promise<StaffScheduleResponse["schedule"]> => {
  const payload = schedule.map(({ dayOfWeek, startTime, endTime, isOff }) => ({
    dayOfWeek,
    startTime,
    endTime,
    isOff,
  }));
  const { data: response } = await axiosClient.put<ApiSuccessResponse<StaffScheduleResponse["schedule"]>>(
    `/api/shops/${shopSlug}/staff/${staffId}/schedule`,
    payload,
  );
  return response.data;
};

export const getStaffDetail = async (shopSlug: string, staffId: string): Promise<Staff> => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<Staff>>(`/api/shops/${shopSlug}/staff/${staffId}/info`);
  return response.data;
};

export const getStaffServices = async (shopSlug: string, staffId: string): Promise<StaffServiceAssignment[]> => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<StaffServiceAssignment[]>>(
    `/api/shops/${shopSlug}/staff/${staffId}/services`,
  );
  return response.data;
};

export const updateStaffServices = async (
  shopSlug: string,
  staffId: string,
  serviceIds: string[],
): Promise<StaffServiceAssignment[]> => {
  const { data: response } = await axiosClient.put<ApiSuccessResponse<StaffServiceAssignment[]>>(
    `/api/shops/${shopSlug}/staff/${staffId}/services`,
    { serviceIds },
  );
  return response.data;
};

export const getStaffAttendance = async (shopSlug: string, staffId: string, from: string, to: string): Promise<StaffAttendance[]> => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<StaffAttendance[]>>(`/api/shops/${shopSlug}/attendance`, { params: { staffId, from, to } });
  return response.data;
};

export const getStaffTimeOff = async (shopSlug: string, staffId: string, page = 1, status?: "PENDING" | "APPROVED" | "REJECTED"): Promise<StaffTimeOffPage> => {
  const { data: response } = await axiosClient.get<PaginatedApiResponse<StaffTimeOffPage["data"], StaffTimeOffPage["meta"]>>(`/api/shops/${shopSlug}/staff/off-days`, { params: { staffId, page, limit: 10, status } });
  return { data: response.data, meta: response.meta };
};
