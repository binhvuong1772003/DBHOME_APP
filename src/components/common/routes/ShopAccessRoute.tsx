import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { getShopDetail } from "@/services/shopService";

/**
 * Protects shop-admin pages by asking the API to verify access to this shop.
 * The API is the source of truth; the URL slug and client state are not.
 */
export function ShopAccessRoute({ children }: { children?: ReactNode }) {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!shopSlug) {
      setAllowed(false);
      return () => {
        cancelled = true;
      };
    }

    setAllowed(null);
    getShopDetail(shopSlug)
      .then(() => {
        if (!cancelled) setAllowed(true);
      })
      .catch(() => {
        if (!cancelled) setAllowed(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shopSlug]);

  if (allowed === null) return null;
  if (!allowed) return <Navigate to="/" replace />;

  return children ?? <Outlet />;
}
