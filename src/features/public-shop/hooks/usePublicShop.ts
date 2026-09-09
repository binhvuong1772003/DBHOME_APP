import { useCallback, useEffect, useState } from "react";
import { getPublicShop } from "../services/publicShopService";
import type { PublicShopPage } from "../types";

export function usePublicShop(shopSlug?: string) {
  const [shop, setShop] = useState<PublicShopPage | null>(null);
  const [loading, setLoading] = useState(Boolean(shopSlug));
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    if (!shopSlug) {
      return;
    }
    let cancelled = false;
    // Start the request state before the async boundary so route changes show
    // the skeleton immediately instead of briefly rendering stale content.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(false);
    void getPublicShop(shopSlug)
      .then((data) => {
        if (!cancelled) setShop(data);
      })
      .catch(() => {
        if (!cancelled) {
          setShop(null);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt, shopSlug]);

  return { shop, loading, error, retry };
}
