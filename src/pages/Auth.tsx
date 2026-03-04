import { SignUpForm } from '@/components/auth/SignUpForm';
import { SignInForm } from '@/components/auth/SignInForm';
import { Button } from '@/components/ui/button';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  Card,
} from '@/components/ui/card';
import { Navbar } from '@/components/ui/Navbar';
import { useState } from 'react';
export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center bg-background px-4">
      <Navbar />
      <div className="max-w-md w-full">
        <Card className="p-6 md:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to SHN</CardTitle>
            <CardDescription className="mt-2 text-base">
              {isSignUp
                ? 'Create an account to get started'
                : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <div className="flex justify-center mt-4">
            <Button
              className={`flex-1 font-semibold transition-all duration-200 hover:brightness-105 ${
                isSignUp
                  ? 'opacity-100 hover:bg-primary'
                  : 'opacity-70 hover:bg-background hover:text-foreground'
              }`}
              variant={isSignUp ? 'default' : 'outline'}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </Button>
            <Button
              className={`flex-1 font-semibold transition-all duration-200 hover:brightness-105 ${
                !isSignUp
                  ? 'opacity-100 hover:bg-primary'
                  : 'opacity-70 hover:bg-background hover:text-foreground'
              }`}
              variant={!isSignUp ? 'default' : 'outline'}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </Button>
          </div>
          {isSignUp ? (
            <SignUpForm className="w-full mt-4" />
          ) : (
            <SignInForm className="w-full mt-4" />
          )}
        </Card>
      </div>
    </div>
  );
}
