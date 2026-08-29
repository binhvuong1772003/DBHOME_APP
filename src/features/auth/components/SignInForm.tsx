import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSignIn } from '@/features/auth/hooks/useSignIn';
import { cn } from '@/lib/utils';
import { type SignInFormData, signInSchema } from '@/validations/authSchema';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export const SignInForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { apiError, onSubmit } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5" noValidate>
        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        <Field className="gap-2">
          <FieldLabel htmlFor="signin-email" className="font-medium">Email address</FieldLabel>
          <Input id="signin-email" autoComplete="email" placeholder="you@example.com" type="email" className="h-11" aria-invalid={!!errors.email} {...register('email')} />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="signin-password" className="font-medium">Password</FieldLabel>
          <div className="relative">
            <Input id="signin-password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="h-11 pr-11" aria-invalid={!!errors.password} {...register('password')} />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </button>
          </div>
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
};
