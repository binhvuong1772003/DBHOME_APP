import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {
  getTimeOffRequests,
  reviewTimeOffRequest,
} from "../services/workforceService";
import type { AdminTimeOffRequest, TimeOffPagination, TimeOffStatusFilter } from "../types/workforce";

const defaultPagination: TimeOffPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  statusCounts: { PENDING: 0, APPROVED: 0, REJECTED: 0 },
};

export function useAdminTimeOffRequests(page: number, status: TimeOffStatusFilter) {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [requests, setRequests] = useState<AdminTimeOffRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(defaultPagination);

  const refetch = useCallback(async () => {
    if (!shopSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTimeOffRequests(shopSlug, { page, limit: 10, status });
      setRequests(response.data);
      setPagination(response.meta);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load time off requests"));
    } finally {
      setIsLoading(false);
    }
  }, [page, shopSlug, status]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const review = useCallback(async (
    requestId: string,
    input: { status: "APPROVED" | "REJECTED"; rejectReason?: string },
  ) => {
    if (!shopSlug) return false;
    setReviewingId(requestId);
    try {
      await reviewTimeOffRequest(shopSlug, requestId, input);
      await refetch();
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to review time off request"));
      return false;
    } finally {
      setReviewingId(null);
    }
  }, [refetch, shopSlug]);

  return { requests, pagination, isLoading, reviewingId, error, refetch, review };
}
