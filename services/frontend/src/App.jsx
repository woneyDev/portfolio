import { lazy, Suspense } from 'react';
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

// 프로젝트 둘러보기 데모 화면은 별도 청크로 지연 로딩합니다.
// (이 화면 전용 스타일이 포트폴리오 본문 스타일과 섞이지 않도록 분리)
const ShinhanMonthlyBalance = lazy(() => import('./pages/demo/ShinhanMonthlyBalance'));

const MEMBER_ONE_USERNAME = import.meta.env.VITE_MEMBER_ONE_USERNAME;

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to={`/@${MEMBER_ONE_USERNAME}`} replace />} />
          <Route path="/demo" element={<StaticDemoPortfolio />} />
          <Route
            path="/project-demo/shinhan-monthly-balance"
            element={
              <Suspense fallback={null}>
                <ShinhanMonthlyBalance />
              </Suspense>
            }
          />
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
