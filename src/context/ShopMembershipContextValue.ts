import { createContext } from "react";
import type { ShopMembership } from "@/features/shop/membership/types/shopMembership";

export interface ShopMembershipContextValue {
  membership: ShopMembership | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const ShopMembershipContext =
  createContext<ShopMembershipContextValue | null>(null);
