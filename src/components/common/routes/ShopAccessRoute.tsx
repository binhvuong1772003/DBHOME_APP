import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useShopMembership } from "@/features/shop/membership/hooks/useShopMembership";

/**
 * Protects shop-scoped pages using the current user's membership from the API.
 * The API is the source of truth; the URL slug and client state are not.
 */
export function ShopAccessRoute({ children }: { children?: ReactNode }) {
  const { t } = useTranslation("common");
  const { membership, isLoading, error, refetch } = useShopMembership();

  if (isLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6" role="status">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="mx-auto size-12 rounded-full" />
          <Skeleton className="mx-auto h-5 w-44" />
          <span className="sr-only">{t("access.loadingShop")}</span>
        </div>
      </main>
    );
  }

  if (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status === 403 || status === 404) {
      return <Navigate to="/" replace />;
    }

    return (
      <main className="flex min-h-dvh items-center justify-center p-6">
        <Card className="w-full max-w-md border-destructive/25 shadow-sm">
          <CardContent className="flex flex-col items-center px-6 py-8 text-center">
            <AlertCircle className="mb-3 size-6 text-destructive" aria-hidden="true" />
            <h1 className="font-semibold">{t("access.errorTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("access.errorDescription")}
            </p>
            <Button className="mt-4" variant="outline" onClick={() => void refetch()}>
              {t("actions.tryAgain")}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!membership || membership.status !== "ACTIVE") {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
}
