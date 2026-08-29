import { AlertCircle, CheckCircle2, Loader2, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

interface Props {
  email?: string;
  isResending: boolean;
  resendSuccess: boolean;
  error: string;
  onResend: () => void;
  onSkip: () => void;
}

export const VerifyEmailBlock = ({ email, isResending, resendSuccess, error, onResend, onSkip }: Props) => (
  <AuthLayout eyebrow="One last step">
    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <MailCheck className="size-6" aria-hidden="true" />
    </div>
    <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Check your inbox</h1>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">
      We sent an activation link to <strong className="font-semibold text-foreground">{email || 'your email address'}</strong>. Open it to finish setting up your account.
    </p>
    <div className="mt-7 space-y-4">
      {resendSuccess && (
        <Alert><CheckCircle2 className="size-4 text-primary" aria-hidden="true" /><AlertDescription>Email sent successfully. Please check your inbox.</AlertDescription></Alert>
      )}
      {error && (
        <Alert variant="destructive"><AlertCircle className="size-4" aria-hidden="true" /><AlertDescription>{error}</AlertDescription></Alert>
      )}
      <Button size="lg" className="w-full" onClick={onSkip}>Continue for now</Button>
      <div className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive the email?{' '}
        <button type="button" onClick={onResend} disabled={isResending} className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
          {isResending ? <><Loader2 className="mr-1 inline size-3.5 animate-spin" aria-hidden="true" />Sending...</> : 'Resend email'}
        </button>
      </div>
    </div>
  </AuthLayout>
);
