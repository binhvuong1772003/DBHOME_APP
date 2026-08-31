import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "react-router-dom";
import { ShopMembershipContext } from "@/context/ShopMembershipContextValue";
import { getCurrentShopMembership } from "@/features/shop/membership/services/shopMembershipService";
import type { ShopMembership } from "@/features/shop/membership/types/shopMembership";

interface MembershipState {
  shopSlug: string | null;
  membership: ShopMembership | null;
  isLoading: boolean;
  error: Error | null;
}

const initialState: MembershipState = {
  shopSlug: null,
  membership: null,
  isLoading: true,
  error: null,
};

function normalizeError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Unable to load the current shop membership");
}

export function ShopMembershipProvider({ children }: { children: ReactNode }) {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [state, setState] = useState<MembershipState>(initialState);
  const requestIdRef = useRef(0);

  const refetch = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!shopSlug) {
      setState({
        shopSlug: null,
        membership: null,
        isLoading: false,
        error: null,
      });
      return;
    }

    setState({
      shopSlug,
      membership: null,
      isLoading: true,
      error: null,
    });

    try {
      const membership = await getCurrentShopMembership(shopSlug);
      if (requestId !== requestIdRef.current) return;

      setState({
        shopSlug,
        membership,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      setState({
        shopSlug,
        membership: null,
        isLoading: false,
        error: normalizeError(error),
      });
    }
  }, [shopSlug]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    if (!shopSlug) return;

    getCurrentShopMembership(shopSlug)
      .then((membership) => {
        if (requestId !== requestIdRef.current) return;

        setState({
          shopSlug,
          membership,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (requestId !== requestIdRef.current) return;

        setState({
          shopSlug,
          membership: null,
          isLoading: false,
          error: normalizeError(error),
        });
      });

    return () => {
      requestIdRef.current += 1;
    };
  }, [shopSlug]);

  const value = useMemo(() => {
    const belongsToCurrentShop = state.shopSlug === (shopSlug ?? null);

    return {
      membership: belongsToCurrentShop ? state.membership : null,
      isLoading: belongsToCurrentShop ? state.isLoading : true,
      error: belongsToCurrentShop ? state.error : null,
      refetch,
    };
  }, [refetch, shopSlug, state]);

  return (
    <ShopMembershipContext.Provider value={value}>
      {children}
    </ShopMembershipContext.Provider>
  );
}
