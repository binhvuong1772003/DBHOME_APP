import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useShopMembership } from "@/features/shop/membership/hooks/useShopMembership";
import {
  createTimeOffRequest,
  getMyTimeOffRequests,
} from "../services/timeOffService";
import type { CreateTimeOffRequestInput } from "../services/timeOffService";
import type { TimeOffRequest } from "../types/workspace";

interface TimeOffState {
  requestKey: string | null;
  requests: TimeOffRequest[] | null;
  error: Error | null;
}

const initialState: TimeOffState = {
  requestKey: null,
  requests: null,
  error: null,
};

function normalizeError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Unable to load time off requests");
}

export function useTimeOffRequests() {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { membership, isLoading: isMembershipLoading } = useShopMembership();
  const staffId = membership?.staffId;
  const requestKey = shopSlug && staffId ? `${shopSlug}:${staffId}` : null;
  const [state, setState] = useState<TimeOffState>(initialState);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);
  const clearCreateError = useCallback(() => setCreateError(null), []);

  useEffect(() => {
    let cancelled = false;
    if (!shopSlug || !staffId || !requestKey) return;

    getMyTimeOffRequests(shopSlug)
      .then((requests) => {
        if (cancelled) return;
        setState({ requestKey, requests, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({ requestKey, requests: null, error: normalizeError(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, shopSlug, staffId]);

  const refetch = useCallback(async () => {
    if (!shopSlug || !staffId || !requestKey) return;

    setState({ requestKey, requests: null, error: null });
    try {
      const requests = await getMyTimeOffRequests(shopSlug);
      setState({ requestKey, requests, error: null });
    } catch (error) {
      setState({ requestKey, requests: null, error: normalizeError(error) });
    }
  }, [requestKey, shopSlug, staffId]);

  const submitRequest = useCallback(
    async (input: CreateTimeOffRequestInput) => {
      if (!shopSlug || !staffId || !requestKey) {
        throw new Error("Current staff membership is unavailable");
      }

      setIsCreating(true);
      setCreateError(null);
      try {
        const created = await createTimeOffRequest(shopSlug, staffId, input);
        setState((current) => ({
          requestKey,
          requests: [created, ...(current.requests ?? [])],
          error: null,
        }));
      } catch (error) {
        const normalizedError = normalizeError(error);
        setCreateError(normalizedError);
        throw normalizedError;
      } finally {
        setIsCreating(false);
      }
    },
    [requestKey, shopSlug, staffId],
  );

  const belongsToCurrentRequest = state.requestKey === requestKey;
  const requests = belongsToCurrentRequest ? state.requests : null;
  const error = belongsToCurrentRequest ? state.error : null;

  return {
    requests: requests ?? [],
    isLoading:
      isMembershipLoading ||
      Boolean(requestKey && (!belongsToCurrentRequest || (!requests && !error))),
    error,
    refetch,
    submitRequest,
    isCreating,
    createError,
    clearCreateError,
  };
}
