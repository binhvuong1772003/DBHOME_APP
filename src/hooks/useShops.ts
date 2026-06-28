import { useState, useEffect } from 'react';
import { getShops } from '@/services/shopService';
interface Shop {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}
export const useShops = () => {
  const [shops, setShop] = useState<Shop[]>([]);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  useEffect(() => {
    const fetch = async () => {
      const data = await getShops();
      setShop(data);
      setCurrentShop(data[0] ?? null);
    };
    fetch();
  }, []);
  return { shops, currentShop, setCurrentShop };
};
