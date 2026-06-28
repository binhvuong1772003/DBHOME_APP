import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import axiosClient, { tokenService } from '@/api/axiosClient';
import { Loader2 } from 'lucide-react';

export default function GoogleCallBackPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasCalled = useRef(false);

  //   useEffect(() => {
  //     if (hasCalled.current) return;
  //     hasCalled.current = true;

  //     axiosClient
  //       .post('/auth/token/refresh')
  //       .then(({ data }) => {
  //         tokenService.setToken(data.acessToken);
  //         return axiosClient.get('/auth/me');
  //       })
  //       .then(({ data }) => {
  //         setUser(data.data);
  //         navigate('/');
  //       })
  //       .catch(() => navigate('/auth'));
  //   }, []);
  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const accessToken = new URLSearchParams(window.location.search).get(
      'accessToken'
    );

    if (!accessToken) {
      navigate('/auth');
      return;
    }

    tokenService.setToken(accessToken);
    window.history.replaceState({}, '', '/auth/google/callback'); // xóa token khỏi URL

    axiosClient
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.data);
        navigate('/');
      })
      .catch(() => navigate('/auth'));
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">
        Đang đăng nhập với Google...
      </p>
    </div>
  );
}
