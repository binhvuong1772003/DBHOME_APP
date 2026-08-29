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

function AuthenticatedProviders() {
  return (
    <ShopProvider>
      <Outlet />
    </ShopProvider>
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

                {/* Protected */}
                <Route element={<PrivateRoute />}>
                  <Route element={<AuthenticatedProviders />}>
                    <Route path="/" element={<div>Home Page</div>} />
                    {shopRoutesList}
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
