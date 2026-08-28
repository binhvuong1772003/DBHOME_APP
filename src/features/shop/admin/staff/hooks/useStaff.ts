import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "@/hooks/useAsync";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import {
  getStaffs,
  inviteStaff as inviteStaffRequest,
  updateStaff as updateStaffRequest,
} from "../services/staffService";
import type { InviteStaffInput, Staff, UpdateStaffInput } from "../types/staff";

export const useStaff = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const { isLoading, error, run } = useAsync<void>();
  const { isLoading: isActionLoading, run: runAction } = useAsyncAction();

  const reload = useCallback(async () => {
    if (!shopSlug) return;
    await run(async () => {
      const records = await getStaffs(shopSlug);
      setStaffs(records);
    }, "Unable to load staff list");
  }, [run, shopSlug]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const inviteStaff = useCallback(
    async (input: InviteStaffInput): Promise<boolean> => {
      if (!shopSlug) return false;
      const succeeded = await runAction(
        async () => {
          await inviteStaffRequest(shopSlug, input);
          return true;
        },
        {
          success: "Staff invitation sent",
          errorFallback: "Unable to invite staff",
        },
      );
      return succeeded ?? false;
    },
    [runAction, shopSlug],
  );

  const updateStaff = useCallback(
    async (staffId: string, input: UpdateStaffInput): Promise<boolean> => {
      if (!shopSlug) return false;
      const updated = await runAction(
        () => updateStaffRequest(shopSlug, staffId, input),
        {
          success: "Staff updated",
          errorFallback: "Unable to update staff",
        },
      );
      if (!updated) return false;
      setStaffs((current) =>
        current.map((staff) =>
          staff.id === updated.id ? { ...staff, ...updated } : staff,
        ),
      );
      return true;
    },
    [runAction, shopSlug],
  );

  const deactivateStaff = useCallback(
    (staff: Staff): Promise<boolean> =>
      updateStaff(staff.id, { isActive: false }),
    [updateStaff],
  );

  return {
    staffs,
    isLoading,
    isActionLoading,
    error,
    reload,
    inviteStaff,
    updateStaff,
    deactivateStaff,
  };
};
