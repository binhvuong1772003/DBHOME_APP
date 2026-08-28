import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { getShops } from "@/services/shopService";

interface Shop {
  id: string;
  name: string;
  slug: string;
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
      value={{ shops, currentShop, setCurrentShop, loading }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within ShopProvider");
  }
  return context;
};
