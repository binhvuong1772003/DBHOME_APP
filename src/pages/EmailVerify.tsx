import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import axiosClient, { tokenService } from "@/api/axiosClient";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import type { User } from "@/type/auth";
export default function EmailVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const verify = async () => {
      try {
        const { data } = await axiosClient.post<{
          success: boolean;
          accessToken: string;
          user: User;
        }>(`/auth/email/verify?token=${token}`);

        tokenService.setToken(data.accessToken);
        setUser(data.user);

        if (!cancelled) {
          setStatus("success");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    };
    verify();
    return () => {
      cancelled = true;
    };
  }, [token, navigate, setUser]);

  const content = {
    loading: {
      icon: Loader2,
      title: "Verifying your email",
      description:
        "Please wait while we securely confirm your activation link.",
      iconClass: "animate-spin text-primary",
    },
    success: {
      icon: CheckCircle2,
      title: "Email verified",
      description: "Your account is ready. We are taking you back to sign in.",
      iconClass: "text-primary",
    },
    error: {
      icon: AlertCircle,
      title: "Link unavailable",
      description:
        "This verification link is invalid or has expired. Request a new link and try again.",
      iconClass: "text-destructive",
    },
  }[status];
  const Icon = content.icon;

  return (
    <AuthLayout eyebrow="Email verification">
      <div role="status" aria-live="polite">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <Icon className={`size-6 ${content.iconClass}`} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {content.description}
        </p>
      </div>
    </AuthLayout>
  );
}
