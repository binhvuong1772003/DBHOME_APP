import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AuthBackgroundShape from '@/assets/svg/auth-background-shape';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/logo.png';
interface Props {
  email?: string;
  isResending: boolean;
  resendSuccess: boolean;
  error: string;
  onResend: () => void;
  onSkip: () => void;
}
export const VerifyEmailBlock = ({
  email,
  isResending,
  resendSuccess,
  error,
  onResend,
  onSkip,
}: Props) => {
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>
      <Card className="z-10 w-full sm:max-w-md border-none shadow-md">
        <CardHeader className="gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-25" />
            <span className="text-2xl font-extrabold">SHN APP</span>
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-base">
            An activation link has been sent to <strong>{email}</strong>. Please
            check your inbox and click on the link to complete the activation
            process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resendSuccess && (
            <p className="text-center text-sm text-green-500">
              Email sent successfully
            </p>
          )}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <Button className="w-full" onClick={onSkip}>
            Skip for now
          </Button>
          <p className="text-center text-muted-foreground">
            Didn't get the mail{' '}
            <button
              onClick={onResend}
              disabled={isResending}
              className="text-foreground hover:underline disabled:opacity-50"
            >
              {isResending ? (
                <Loader2 className="inline w-3 h-3 animate-spin" />
              ) : (
                'Resend'
              )}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
