import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "@/hooks/common/useAsync";
import { useAsyncAction } from "@/hooks/common/useAsyncAction";
import { getStaffs, inviteStaff as inviteStaffRequest, updateStaff as updateStaffRequest } from "../services/staffService";
import type { InviteStaffInput, Staff, StaffListQuery, UpdateStaffInput } from "../types/staff";
import { useTranslation } from "react-i18next";

const emptyPagination = { total: 0, page: 1, limit: 5, totalPages: 1 };

export const useStaff = (query: StaffListQuery) => {
  const { t } = useTranslation("staff");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const { isLoading, error, run } = useAsync();
  const { isLoading: isActionLoading, run: runAction } = useAsyncAction();

  const reload = useCallback(async () => {
    if (!shopSlug) return;
    await run(async () => {
      const response = await getStaffs(shopSlug, query);
      setStaffs(response.data);
      setPagination(response.meta);
    }, t("notifications.loadError"));
  }, [query, run, shopSlug, t]);

  useEffect(() => { void reload(); }, [reload]);

  const inviteStaff = useCallback(async (input: InviteStaffInput): Promise<boolean> => {
    if (!shopSlug) return false;
    const succeeded = await runAction(() => inviteStaffRequest(shopSlug, input), { success: t("notifications.inviteSuccess"), errorFallback: t("notifications.inviteError") });
    return succeeded !== undefined;
  }, [runAction, shopSlug, t]);

  const updateStaff = useCallback(async (staffId: string, input: UpdateStaffInput): Promise<boolean> => {
    if (!shopSlug) return false;
    const updated = await runAction(() => updateStaffRequest(shopSlug, staffId, input), { success: t("notifications.updateSuccess"), errorFallback: t("notifications.updateError") });
    if (!updated) return false;
    setStaffs((current) => current.map((staff) => staff.id === updated.id ? { ...staff, ...updated } : staff));
    return true;
  }, [runAction, shopSlug, t]);

  const deactivateStaff = useCallback((staff: Staff) => updateStaff(staff.id, { isActive: false }), [updateStaff]);

  return { staffs, pagination, isLoading, isActionLoading, error, reload, inviteStaff, updateStaff, deactivateStaff };
};
