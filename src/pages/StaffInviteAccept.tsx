import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { acceptStaffInvite } from "@/features/shop/admin/staff/services/staffInviteService";
import { Button } from "@/components/ui/button";

const PENDING_INVITE_KEY = "pending_staff_invite";

export default function StaffInviteAcceptPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const accepted = useRef(false);
  const token = searchParams.get("token");
  const shopSlug = searchParams.get("shopSlug");

  useEffect(() => {
    if (loading || accepted.current) return;

    if (!token || !shopSlug) {
      setError("Link lời mời không hợp lệ hoặc đã thiếu thông tin shop.");
      return;
    }

    if (!user) {
      sessionStorage.setItem(
        PENDING_INVITE_KEY,
        `${window.location.pathname}${window.location.search}`,
      );
      navigate(`/auth?invite=1`, { replace: true });
      return;
    }

    accepted.current = true;
    acceptStaffInvite(shopSlug, token)
      .then(() => {
        sessionStorage.removeItem(PENDING_INVITE_KEY);
        navigate(`/shops/${encodeURIComponent(shopSlug)}/admin`, {
          replace: true,
        });
      })
      .catch((requestError: any) => {
        accepted.current = false;
        setError(
          requestError?.response?.data?.message ??
            "Không thể xác thực lời mời. Link có thể đã hết hạn hoặc đã được sử dụng.",
        );
      });
  }, [loading, navigate, shopSlug, token, user]);

  if (!error) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3">
        <Loader2 className="size-5 animate-spin" />
        <span>Đang xác thực lời mời...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-destructive">{error}</p>
      <Button asChild>
        <Link to="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}
