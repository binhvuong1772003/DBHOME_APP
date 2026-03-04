// pages/auth/VerifyEmailPage.tsx
import { VerifyEmailBlock } from '@/components/blocks/verify-email';
import { useEmailVerify } from '@/hooks/useEmailVerify';
import { Navbar } from '@/components/ui/Navbar';
export default function VerifyEmailPage() {
  const { email, isResending, resendSuccess, error, handleResend, handleSkip } =
    useEmailVerify();

  return (
    <div className="relative">
      <Navbar />
      <VerifyEmailBlock
        email={email}
        isResending={isResending}
        resendSuccess={resendSuccess}
        error={error}
        onResend={handleResend}
        onSkip={handleSkip}
      />
    </div>
  );
}
