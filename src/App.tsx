import { ThemeProvider } from "@/components/common/providers/ThemeProvider";
import { useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopContext";
import AuthPage from "./pages/Auth";
import EmailVerifyPage from "./pages/EmailVerify";
import SendVerifyEmailPage from "./pages/SendVerifyEmailPage";
import { PublicRoute } from "@/components/common/routes/PublicRoute";
import { PrivateRoute } from "@/components/common/routes/PrivateRoute";
import GoogleCallBackPage from "./pages/GoogleCallback";
import { shopRoutes } from "./routes/shop.routes";
import { Toaster } from "sonner";
import StaffInviteAcceptPage from "./pages/StaffInviteAccept";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import PublicShopPage from "@/features/public-shop/components/PublicShopPage";

function AuthenticatedProviders() {
  return (
    <ShopProvider>
      <Outlet />
    </ShopProvider>
  );
}

function HomeRoute() {
  const { user } = useAuth();
  return user ? (
    <ShopProvider>
      <HomePage />
    </ShopProvider>
  ) : (
    <HomePage />
  );
}

function PublicShopRoute() {
  const { user } = useAuth();
  return user ? (
    <ShopProvider>
      <PublicShopPage />
    </ShopProvider>
  ) : (
    <PublicShopPage />
  );
}

export function App() {
  const shopRoutesList = useMemo(() => shopRoutes(), []);

  return (
    <>
      <Toaster />
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
                {/* Public */}
                <Route
                  path="/auth"
                  element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/google/callback"
                  element={<GoogleCallBackPage />}
                />
                <Route path="/email/verify" element={<EmailVerifyPage />} />
                <Route path="/invite/accept" element={<StaffInviteAcceptPage />} />
                <Route
                  path="/email/verification/resend"
                  element={<SendVerifyEmailPage />}
                />

                <Route path="/" element={<HomeRoute />} />
                <Route path="/shops/:shopSlug" element={<PublicShopRoute />} />

                {/* Protected */}
                <Route element={<PrivateRoute />}>
                  <Route element={<AuthenticatedProviders />}>
                    {shopRoutesList}
                    <Route path="/account" element={<AccountPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
