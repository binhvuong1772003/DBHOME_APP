import { env } from "@/config/env";

export const GoogleButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${env.apiUrl}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-background px-4 text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <img src="https://www.google.com/favicon.ico" alt="" className="size-4" aria-hidden="true" />
      <span className="text-sm font-medium">Continue with Google</span>
    </button>
  );
};
