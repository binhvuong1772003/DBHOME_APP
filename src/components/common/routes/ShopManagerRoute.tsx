import { Navigate, Outlet, useParams } from "react-router-dom";
import { useShopMembership } from "@/features/shop/membership/hooks/useShopMembership";

export function ShopManagerRoute() {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const { membership } = useShopMembership();

  if (!membership || membership.role === "STAFF") {
    return <Navigate to={`/shops/${shopSlug}/workspace`} replace />;
  }

  return <Outlet />;
}
