import { SignUpForm } from '@/features/auth/components/SignUpForm';
import { SignInForm } from '@/features/auth/components/SignInForm';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GoogleButton } from '@/features/auth/components/GoogleButton';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const inviteMode = searchParams.has('invite');
  const requestedMode = searchParams.get('mode');
  const [isSignUp, setIsSignUp] = useState(() => !inviteMode && requestedMode !== 'signin');
  return (
    <AuthLayout>
      <div>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {isSignUp ? 'Start organizing your service business in minutes.' : 'Sign in to continue to your SHN workspace.'}
        </p>

        <div className="mt-8 rounded-xl bg-muted p-1" role="tablist" aria-label="Authentication mode">
          <div className="grid grid-cols-2 gap-1">
            <Button
              type="button"
              role="tab"
              aria-selected={isSignUp}
              variant="ghost"
              className={isSignUp ? 'bg-card text-foreground shadow-sm hover:bg-card' : 'text-muted-foreground'}
              onClick={() => setIsSignUp(true)}
            >
              Create account
            </Button>
            <Button
              type="button"
              role="tab"
              aria-selected={!isSignUp}
              variant="ghost"
              className={!isSignUp ? 'bg-card text-foreground shadow-sm hover:bg-card' : 'text-muted-foreground'}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </Button>
          </div>
        </div>
          {isSignUp ? (
            <SignUpForm className="mt-7 w-full" />
          ) : (
            <SignInForm className="mt-7 w-full" />
          )}
          <div className="my-7 flex items-center gap-4" aria-hidden="true">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <GoogleButton />
      </div>
    </AuthLayout>
  );
}
