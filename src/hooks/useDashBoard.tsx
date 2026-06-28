import { getShopDetail } from '@/services/shopService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useShopDashBoard = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!shopSlug) {
      return;
    }
    const fetch = async () => {
      console.log('bắt đầu fetch');
      try {
        const data = await getShopDetail(shopSlug);
        console.log('data:', data);
        setShop(data);
      } catch (err) {
        console.log('lỗi:', err);
        setError('Không tải được dữ liệu shop');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [shopSlug]);
  return { shop, error, isLoading };
};
