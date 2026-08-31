import { useContext } from "react";
import { ShopMembershipContext } from "@/context/ShopMembershipContextValue";

export function useShopMembership() {
  const context = useContext(ShopMembershipContext);

  if (!context) {
    throw new Error(
      "useShopMembership must be used within ShopMembershipProvider",
    );
  }

  return context;
}
