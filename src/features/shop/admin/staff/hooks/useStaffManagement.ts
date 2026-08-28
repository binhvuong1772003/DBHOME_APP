import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  const {
    staffs,
    isLoading,
    isActionLoading,
    error,
    reload,
    inviteStaff,
    updateStaff,
    deactivateStaff,
  } = useStaff();
  const {
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    sort,
    setSort,
    page,
    setPage,
    viewMode,
    setViewMode,
    filteredStaffs,
    paginatedStaffs,
    totalPages,
    rangeStart,
    rangeEnd,
  } = useStaffFilter(staffs);
  const stats = useStaffStats(staffs);
  const {
    mode,
    selectedStaff,
    openCreate,
    openEdit,
    openDetail,
    openDeactivate,
    closeDialog,
  } = useStaffDialog();
  const currentUserRole: StaffRole =
    user?.role === "SUPER_ADMIN"
      ? "OWNER"
      : (staffs.find((staff) => staff.userId === user?.id)?.role ?? "STAFF");
  const canChangeRole = currentUserRole === "OWNER";
  const canInvite = currentUserRole === "OWNER";
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
    filteredStaffs,
    paginatedStaffs,
    stats,
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    sort,
    setSort,
    page,
    setPage,
    viewMode,
    setViewMode,
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
    openDeactivate,
    closeDialog,
    handleInvite,
    handleEdit,
    handleDeactivate,
  };
};
