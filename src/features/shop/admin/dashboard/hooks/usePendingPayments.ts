import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useShopMembership } from "@/features/shop/membership/hooks/useShopMembership";
import { getPayments } from "@/features/shop/admin/payments/services/paymentService";
import { useAsync } from "@/hooks/common/useAsync";

/**
 * Payment management is manager-only in the API. The dashboard therefore only
 * requests this signal after membership is known to have that access, avoiding
 * a noisy 403 for staff users.
 */
export function usePendingPayments() {
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const { membership, isLoading: isMembershipLoading } = useShopMembership();
  const { isLoading, error, run } = useAsync();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const canViewPayments = membership?.role !== "STAFF" && Boolean(membership);

  useEffect(() => {
    if (isMembershipLoading || !canViewPayments || !shopSlug) return;

    run(async () => {
      const result = await getPayments(shopSlug, {
        page: 1,
        limit: 1,
        status: "PENDING",
      });
      const count = result.meta.summary.statusCounts.PENDING ?? result.meta.total;
      setPendingCount(count);
      return result;
    }, "Không tải được thanh toán đang chờ");
  }, [canViewPayments, isMembershipLoading, requestVersion, run, shopSlug]);

  return {
    pendingCount,
    isLoading: isMembershipLoading || (canViewPayments && isLoading),
    error: canViewPayments ? error : null,
    canViewPayments,
    retry: () => setRequestVersion((version) => version + 1),
  };
}
