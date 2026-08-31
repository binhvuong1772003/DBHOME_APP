import { useCallback, useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  InviteStaffInput,
  StaffRole,
  UpdateStaffInput,
} from "../types/staff";
import { useStaff } from "./useStaff";
import { useStaffDialog } from "./useStaffDialog";
import { useStaffFilter } from "./useStaffFilter";
import { useStaffStats } from "./useStaffStats";

export const useStaffManagement = () => {
  const { user } = useAuth();
  const filter = useStaffFilter();
  const staffQuery = useMemo(() => ({
    page: filter.page,
    limit: 5,
    search: filter.debouncedSearch || undefined,
    role: filter.role === "ALL" ? undefined : filter.role,
    status: filter.status === "ALL" ? undefined : filter.status,
    sort: filter.sort,
  }), [filter.debouncedSearch, filter.page, filter.role, filter.sort, filter.status]);
  const {
    staffs,
    pagination,
    isLoading,
    isActionLoading,
    error,
    reload,
    inviteStaff,
    updateStaff,
    deactivateStaff,
  } = useStaff(staffQuery);
  const filteredStaffs = staffs;
  const paginatedStaffs = staffs;
  const totalPages = pagination.totalPages;
  const page = pagination.page;
  const rangeStart = pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1;
  const rangeEnd = Math.min(page * pagination.limit, pagination.total);
  const stats = useStaffStats(staffs);
  const {
    mode,
    selectedStaff,
    openCreate,
    openEdit,
    openDetail,
    openSchedule,
    openDeactivate,
    closeDialog,
  } = useStaffDialog();
  const currentUserRole: StaffRole =
    user?.role === "SUPER_ADMIN"
      ? "OWNER"
      : (staffs.find((staff) => staff.userId === user?.id)?.role ?? "STAFF");
  const canChangeRole = currentUserRole === "OWNER";
  // Managers can invite staff, while only owners can invite managers.
  const canInvite =
    currentUserRole === "OWNER" || currentUserRole === "MANAGER";
  const canEditStaff =
    currentUserRole === "OWNER" || currentUserRole === "MANAGER";

  const handleInvite = useCallback(
    async (input: InviteStaffInput): Promise<boolean> => {
      if (!canInvite) return false;
      const succeeded = await inviteStaff(input);
      if (succeeded) closeDialog();
      return succeeded;
    },
    [canInvite, closeDialog, inviteStaff],
  );

  const handleEdit = useCallback(
    async (input: UpdateStaffInput): Promise<boolean> => {
      if (!selectedStaff || !canEditStaff) return false;
      const allowedInput: UpdateStaffInput = canChangeRole
        ? input
        : { isActive: input.isActive };
      if (
        allowedInput.isActive === undefined &&
        allowedInput.role === undefined
      ) {
        return false;
      }
      const succeeded = await updateStaff(selectedStaff.id, allowedInput);
      if (succeeded) closeDialog();
      return succeeded;
    },
    [canChangeRole, canEditStaff, closeDialog, selectedStaff, updateStaff],
  );

  const handleDeactivate = useCallback(async (): Promise<boolean> => {
    if (!selectedStaff || !canEditStaff) return false;
    const succeeded = await deactivateStaff(selectedStaff);
    if (succeeded) closeDialog();
    return succeeded;
  }, [canEditStaff, closeDialog, deactivateStaff, selectedStaff]);

  return {
    staffs,
    pagination,
    filteredStaffs,
    paginatedStaffs,
    stats,
    ...filter,
    totalPages,
    rangeStart,
    rangeEnd,
    isLoading,
    isActionLoading,
    error,
    reload,
    currentUserRole,
    canInvite,
    canChangeRole,
    canEditStaff,
    mode,
    selectedStaff,
    openCreate,
    openEdit,
    openDetail,
    openSchedule,
    openDeactivate,
    closeDialog,
    handleInvite,
    handleEdit,
    handleDeactivate,
  };
};
