import { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
export const useEmailVerify = () => {
  const { user, sendEmailVerification } = useAuth();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');
  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setError('');
    try {
      await sendEmailVerification();
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.response?.data.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };
  const handleSkip = () => navigate('/dashboard');
  return {
    email: user?.email,
    isResending,
    resendSuccess,
    error,
    handleResend,
    handleSkip,
  };
};
