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

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />
            <Route
              path="/email/verification/resend"
              element={<SendVerifyEmailPage />}
            />
            <Route path="/email/verify" element={<EmailVerifyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
