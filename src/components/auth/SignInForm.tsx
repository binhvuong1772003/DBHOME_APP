import { useSignIn } from '@/hooks/useSignIn';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { type SignInFormData, signInSchema } from '@/validations/authSchema';
import { CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Field, FieldLabel } from '../ui/field';
import { AlertCircle, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
export const SignInForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const { apiError, onSubmit } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <CardDescription className="flex flex-col gap-4">
          {apiError && (
            <Alert variant={'destructive'}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          <Field className="gap-1.5">
            <FieldLabel className="font-semibold">Email</FieldLabel>
            <Input
              placeholder="Enter your email"
              type="email"
              {...register('email')}
            ></Input>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </Field>
          <Field className="gap-1.5">
            <FieldLabel className="font-semibold">Password</FieldLabel>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </Field>
          <Button type="submit" className="w-full">
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
            )}
            {isSubmitting ? 'Sign in...' : 'Sign in'}
          </Button>
        </CardDescription>
      </form>
    </div>
  );
};
