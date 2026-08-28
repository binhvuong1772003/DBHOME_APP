import { useCallback, useState } from "react";
import type { Staff, StaffDialogMode } from "../types/staff";

export const useStaffDialog = () => {
  const [mode, setMode] = useState<StaffDialogMode>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const openCreate = useCallback(() => {
    setSelectedStaff(null);
    setMode("CREATE");
  }, []);

  const openEdit = useCallback((staff: Staff) => {
    setSelectedStaff(staff);
    setMode("EDIT");
  }, []);

  const openDetail = useCallback((staff: Staff) => {
    setSelectedStaff(staff);
    setMode("DETAIL");
  }, []);

  const openDeactivate = useCallback((staff: Staff) => {
    setSelectedStaff(staff);
    setMode("DEACTIVATE");
  }, []);

  const closeDialog = useCallback(() => {
    setMode(null);
    setSelectedStaff(null);
  }, []);

  return {
    mode,
    selectedStaff,
    openCreate,
    openEdit,
    openDetail,
    openDeactivate,
    closeDialog,
  };
};
