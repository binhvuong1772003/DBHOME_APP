import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { SignInRequest } from '@/type/auth';
import { AxiosError } from 'axios';
import { getShops } from '@/services/shopService';
export const useSignIn = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const onSubmit = async (payload: SignInRequest) => {
    try {
      setLoading(true);
      setApiError('');
      const signedInUser = await signIn(payload);
      const pendingInvite = sessionStorage.getItem('pending_staff_invite');
      let staffShop;
      if (['STAFF', 'SHOP_MEMBER'].includes(signedInUser?.role?.toUpperCase() ?? '')) {
        try {
          staffShop = (await getShops())[0];
        } catch {
          staffShop = undefined;
        }
      }
      navigate(pendingInvite || (staffShop ? `/shops/${staffShop.slug}/workspace` : '/'));
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setApiError(error.response?.data?.error?.message || error.response?.data?.message || 'Đăng nhập thất bại');
      } else {
        setApiError('Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };
  return { loading, apiError, onSubmit };
};
