import { getListService } from '@/services/serviceService';
import type { Service } from '@/types/service';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useServiceManagement = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceList, setServiceList] = useState<Service[] | null>(null);
  useEffect(() => {
    if (!shopSlug) {
      console.log('return vì shopSlug null');
      return;
    }
    const fetch = async () => {
      try {
        const data = await getListService(shopSlug);
        console.log('data:', data);
        setServiceList(data);
      } catch (err) {
        console.log('lỗi:', err);
        setError('Không tải được dữ liệu shop');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [shopSlug]);
  return { serviceList, isLoading, error };
};
