import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { SignUpRequest } from '@/type/auth';
import { flushSync } from 'react-dom';
import { AxiosError } from 'axios';
export const useSignUp = () => {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const onSubmit = async (payload: SignUpRequest) => {
    try {
      setLoading(true);
      setApiError('');
      await signup(payload); // context tự setUser bên trong
      flushSync(() => {}); // flush render trước
      console.log('navigate to resend'); // ← có log này không?
      navigate('/email/verification/resend');
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
