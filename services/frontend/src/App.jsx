import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import StaticDemoPortfolio from './pages/StaticDemoPortfolio';
import VerifyEmail from './pages/VerifyEmail';
import OAuthCallback from './pages/OAuthCallback';
import LoginRequired from './pages/LoginRequired';
import { LanguageProvider } from './i18n/LanguageContext';
import './App.css';

const MEMBER_ONE_USERNAME = import.meta.env.VITE_MEMBER_ONE_USERNAME;

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to={`/@${MEMBER_ONE_USERNAME}`} replace />} />
          <Route path="/demo" element={<StaticDemoPortfolio />} />
          <Route path="/@:username" element={<PublicPortfolio />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<LoginRequired />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}
