import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { getShops } from "@/services/shopService";

export interface Shop {
  id: string;
  name: string;
  slug: string;
  type?: "NAIL" | "SPA" | "HAIR" | "COMBO" | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  timezone: string;
}

interface ShopContextValue {
  shops: Shop[];
  currentShop: Shop | null;
  setCurrentShop: (shop: Shop | null) => void;
  loading: boolean;
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const routeShopSlug = useMemo(
    () => location.pathname.match(/^\/shops\/([^/]+)/)?.[1],
    [location.pathname],
  );
  const routeShop = useMemo(
    () => shops.find((shop) => shop.slug === routeShopSlug) ?? null,
    [routeShopSlug, shops],
  );
  const resolvedCurrentShop = routeShopSlug ? routeShop : currentShop;

  useEffect(() => {
    let cancelled = false;

    const fetchShops = async () => {
      try {
        const data = await getShops();
        if (!cancelled) {
          setShops(data);
          setCurrentShop(data[0] ?? null);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchShops();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shops,
        currentShop: resolvedCurrentShop,
        setCurrentShop,
        loading,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// Context hooks intentionally live next to their provider so consumers keep a
// single import path; the refresh rule is only relevant to component exports.
// eslint-disable-next-line react-refresh/only-export-components
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within ShopProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOptionalShopContext = () => useContext(ShopContext);
