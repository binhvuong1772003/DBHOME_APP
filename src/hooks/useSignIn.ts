import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { SignInRequest } from '@/type/auth';
import { AxiosError } from 'axios';
export const useSignIn = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const onSubmit = async (payload: SignInRequest) => {
    try {
      setLoading(true);
      setApiError('');
      await signIn(payload);
      navigate('/login');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setApiError(error.response?.data?.message || 'Đăng ký thất bại');
      } else {
        setApiError('Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };
  return { loading, apiError, onSubmit };
};
