import { ThemeProvider } from './components/theme-provider';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/Auth';
import EmailVerifyPage from './pages/EmailVerify';
import SendVerifyEmailPage from './pages/SendVerifyEmailPage';
import { PublicRoute } from './components/routes/PublicRoute';
import { PrivateRoute } from './components/routes/PrivateRoute';
import GoogleCallBackPage from './pages/GoogleCallback';
import { shopRoutes } from './routes/shop.routes';
import { Toaster } from 'sonner';

export function App() {
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
              <Route
                path="/email/verification/resend"
                element={<SendVerifyEmailPage />}
              />

              {/* Protected */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<div>Home Page</div>} />
                {shopRoutes()}
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
