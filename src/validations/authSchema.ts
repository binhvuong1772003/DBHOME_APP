import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type SignUpFormData = z.infer<typeof signupSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
