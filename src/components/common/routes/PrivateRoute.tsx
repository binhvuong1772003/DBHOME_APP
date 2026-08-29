import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
export const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/auth" replace />;

  if (!user.isVerified) {
    return <Navigate to="/email/verification/resend" replace />;
  }

  return <Outlet />;
};
