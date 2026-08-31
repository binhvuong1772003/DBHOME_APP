import { useState, useCallback } from "react";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export function useAsync<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <R = T>(
      fn: () => Promise<R>,
      fallbackMessage?: string,
    ): Promise<R | undefined> => {
      setIsLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        setError(getApiErrorMessage(err, fallbackMessage));
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, error, run };
}
