import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const allowedWhenLoggedIn = ['/email/verification/resend', '/email/verify'];

  if (user && !allowedWhenLoggedIn.includes(location.pathname)) {
    if (!user.isVerified) {
      return <Navigate to="/email/verification/resend" replace />;
    }
    return <Navigate to="" replace />;
  }

  return <>{children}</>;
};
