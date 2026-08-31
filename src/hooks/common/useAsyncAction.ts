import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export function useAsyncAction() {
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(
    async <R>(
      fn: () => Promise<R>,
      messages: { success?: string; errorFallback?: string } = {},
    ): Promise<R | undefined> => {
      setIsLoading(true);
      try {
        const result = await fn();
        if (messages.success) toast.success(messages.success);
        return result;
      } catch (err) {
        toast.error(getApiErrorMessage(err, messages.errorFallback));
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, run };
}
