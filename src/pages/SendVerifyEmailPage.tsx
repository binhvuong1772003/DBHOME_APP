// pages/auth/VerifyEmailPage.tsx
import { VerifyEmailBlock } from '@/features/auth/components/VerifyEmailBlock';
import { useEmailVerify } from '@/features/auth/hooks/useEmailVerify';
export default function VerifyEmailPage() {
  const { email, isResending, resendSuccess, error, handleResend, handleSkip } =
    useEmailVerify();

  return (
    <VerifyEmailBlock
        email={email}
        isResending={isResending}
        resendSuccess={resendSuccess}
        error={error}
        onResend={handleResend}
        onSkip={handleSkip}
    />
  );
}
