import { useSignUp } from '@/hooks/useSignUp';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { type SignUpFormData, signupSchema } from '@/validations/authSchema';
import { CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Field, FieldLabel } from '../ui/field';
import { AlertCircle, EyeOff, Eye, Loader2 } from 'lucide-react';
import { PasswordStrengthBar } from '../ui/password-strength-bar';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
export const SignUpForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const { apiError, onSubmit } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
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
            <FieldLabel className="font-semibold">Name</FieldLabel>
            <Input placeholder="Enter your Name" {...register('name')}></Input>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </Field>
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
            {form.watch('password') && (
              <PasswordStrengthBar value={form.watch('password')} />
            )}
          </Field>
          <Field className="gap-1.5">
            <FieldLabel className="font-semibold">Confirm Password</FieldLabel>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
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
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="terms-checkbox-basic"
              name="terms-checkbox-basic"
              onCheckedChange={(checked) =>
                form.setValue('terms', checked === true)
              }
            />
            {errors.terms && (
              <p className="text-sm text-destructive">{errors.terms.message}</p>
            )}
            <FieldLabel htmlFor="terms-checkbox-basic">
              Accept terms and conditions
            </FieldLabel>
          </Field>
          <Button type="submit" className="w-full">
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
            )}
            {isSubmitting ? 'Creating an account...' : 'Create an account'}
          </Button>
        </CardDescription>
      </form>
    </div>
  );
};
