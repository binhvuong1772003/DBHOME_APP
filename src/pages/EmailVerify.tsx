// src/pages/EmailVerify.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';

export default function EmailVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error'
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        await axiosClient.post(`/auth/email/verify?token=${token}`);
        if (!cancelled) {
          setStatus('success');
          setTimeout(() => navigate('/auth'), 2000);
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {status === 'loading' && <p>Đang xác thực...</p>}
      {status === 'success' && (
        <p>✅ Xác thực thành công! Đang chuyển hướng...</p>
      )}
      {status === 'error' && <p>❌ Link không hợp lệ hoặc đã hết hạn.</p>}
    </div>
  );
}
