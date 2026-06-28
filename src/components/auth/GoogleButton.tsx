// components/auth/GoogleButton.tsx
export const GoogleButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2 border rounded-md py-2 px-4 hover:bg-muted transition"
    >
      <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
      <span className="text-sm font-medium">Continue with Google</span>
    </button>
  );
};
