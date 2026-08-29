import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSignUp } from '@/features/auth/hooks/useSignUp';
import { cn } from '@/lib/utils';
import { type SignUpFormData, signupSchema } from '@/validations/authSchema';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { PasswordStrengthBar } from '@/features/auth/components/PasswordStrengthBar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export const SignUpForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { apiError, onSubmit } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignUpFormData>({ resolver: zodResolver(signupSchema) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;
  const password = useWatch({ control: form.control, name: 'password' });

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4" noValidate>
        {apiError && <Alert variant="destructive"><AlertCircle className="size-4 shrink-0" aria-hidden="true" /><AlertDescription>{apiError}</AlertDescription></Alert>}
        <Field className="gap-2">
          <FieldLabel htmlFor="signup-name" className="font-medium">Full name</FieldLabel>
          <Input id="signup-name" autoComplete="name" placeholder="Your full name" className="h-11" aria-invalid={!!errors.name} {...register('name')} />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="signup-email" className="font-medium">Email address</FieldLabel>
          <Input id="signup-email" autoComplete="email" placeholder="you@example.com" type="email" className="h-11" aria-invalid={!!errors.email} {...register('email')} />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="signup-password" className="font-medium">Password</FieldLabel>
          <div className="relative">
            <Input id="signup-password" autoComplete="new-password" type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" className="h-11 pr-11" aria-invalid={!!errors.password} {...register('password')} />
            <button type="button" aria-label={showPassword ? 'Hide passwords' : 'Show passwords'} className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </button>
          </div>
          <FieldError>{errors.password?.message}</FieldError>
          {password && <PasswordStrengthBar value={password} />}
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="signup-confirm-password" className="font-medium">Confirm password</FieldLabel>
          <Input id="signup-confirm-password" autoComplete="new-password" type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" className="h-11" aria-invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </Field>
        <Field orientation="horizontal" className="items-start gap-2">
          <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" aria-invalid={!!errors.terms} onCheckedChange={(checked) => form.setValue('terms', checked === true)} />
          <div className="grid gap-1">
            <FieldLabel htmlFor="terms-checkbox-basic" className="font-normal leading-5">Accept terms and conditions</FieldLabel>
            <FieldError>{errors.terms?.message}</FieldError>
          </div>
        </Field>
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Creating an account...' : 'Create an account'}
        </Button>
      </form>
    </div>
  );
};
