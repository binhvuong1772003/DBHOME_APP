import { ThemeProvider } from "@/components/common/providers/ThemeProvider";
import { useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
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
import SalonsPage from "@/features/marketplace-search/components/SalonsPage";

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

function PublicShopRoute({ booking }: { booking?: boolean }) {
  const { user } = useAuth();
  return user ? (
    <ShopProvider>
      <PublicShopPage initialBooking={booking} />
    </ShopProvider>
  ) : (
    <PublicShopPage initialBooking={booking} />
  );
}

function PublicBookingRoute() {
  return <PublicShopRoute booking />;
}

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [hash, pathname, search]);

  return null;
}

export function App() {
  const shopRoutesList = useMemo(() => shopRoutes(), []);

  return (
    <>
      <Toaster />
      <ThemeProvider>
        <Router>
          <ScrollToTop />
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
              <Route
                path="/invite/accept"
                element={<StaffInviteAcceptPage />}
              />
              <Route
                path="/email/verification/resend"
                element={<SendVerifyEmailPage />}
              />

              <Route path="/" element={<HomeRoute />} />
              <Route path="/shops" element={<SalonsPage />} />
              <Route
                path="/shops/:shopSlug/book"
                element={<PublicBookingRoute />}
              />
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
