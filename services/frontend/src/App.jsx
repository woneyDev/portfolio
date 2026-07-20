import { lazy, Suspense } from 'react';
import { HashRouter, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import DemoAccessGuard from './components/DemoAccessGuard';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import MyPage from './pages/MyPage';
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

// 신한투자증권 데모 화면 목록: routeKey -> 컴포넌트. 화면이 늘어날 때 이 배열에만 추가하면 됩니다.
const DEMO_SCREEN_ROUTES = [
  { routeKey: 'shinhan-half-year-balance', Component: lazy(() => import('./pages/demo/screens/SemiAnnualBalanceScreen')) },
  { routeKey: 'shinhan-agent-notice', Component: lazy(() => import('./pages/demo/screens/AgentNoticeScreen')) },
  { routeKey: 'shinhan-dormant-assets', Component: lazy(() => import('./pages/demo/screens/DormantAssetsScreen')) },
  { routeKey: 'shinhan-terms-change-notice', Component: lazy(() => import('./pages/demo/screens/TermsChangeNoticeScreen')) },
  { routeKey: 'shinhan-wrap-report-domestic-basic', Component: lazy(() => import('./pages/demo/screens/WrapReportDomesticBasicScreen')) },
  { routeKey: 'shinhan-wrap-report-domestic-simple', Component: lazy(() => import('./pages/demo/screens/WrapReportDomesticSimpleScreen')) },
  { routeKey: 'shinhan-wrap-report-overseas-basic', Component: lazy(() => import('./pages/demo/screens/WrapReportOverseasBasicScreen')) },
  { routeKey: 'shinhan-wrap-report-overseas-asset', Component: lazy(() => import('./pages/demo/screens/WrapReportOverseasAssetScreen')) },
  { routeKey: 'shinhan-wrap-report-ema-domestic', Component: lazy(() => import('./pages/demo/screens/WrapReportEmaDomesticScreen')) },
  { routeKey: 'shinhan-wrap-report-ema-overseas', Component: lazy(() => import('./pages/demo/screens/WrapReportEmaOverseasScreen')) },
  { routeKey: 'shinhan-mmw-cma-report', Component: lazy(() => import('./pages/demo/screens/MmwCmaReportScreen')) },
  { routeKey: 'shinhan-trust-report', Component: lazy(() => import('./pages/demo/screens/TrustReportScreen')) },
  { routeKey: 'shinhan-trust-quarterly-report', Component: lazy(() => import('./pages/demo/screens/TrustQuarterlyReportScreen')) },
  { routeKey: 'shinhan-fund-return-report', Component: lazy(() => import('./pages/demo/screens/FundReturnReportScreen')) },
  { routeKey: 'shinhan-pension-fund-report', Component: lazy(() => import('./pages/demo/screens/PensionFundReportScreen')) },
  { routeKey: 'shinhan-retirement-pension-report', Component: lazy(() => import('./pages/demo/screens/RetirementPensionReportScreen')) },
  { routeKey: 'shinhan-legal-education-dc', Component: lazy(() => import('./pages/demo/screens/LegalEducationDCScreen')) },
  { routeKey: 'shinhan-legal-education-irp', Component: lazy(() => import('./pages/demo/screens/LegalEducationIRPScreen')) },
  { routeKey: 'shinhan-withholding-statement', Component: lazy(() => import('./pages/demo/screens/WithholdingStatementScreen')) },
  { routeKey: 'shinhan-customer-info-disclosure-notice', Component: lazy(() => import('./pages/demo/screens/CustomerInfoDisclosureNoticeScreen')) },
];

const MEMBER_ONE_USERNAME = import.meta.env.VITE_MEMBER_ONE_USERNAME;

// GitHub Pages(정적 호스팅, 서버 라우팅 설정 불가)는 "#" 방식(HashRouter)이 필수라 기본값으로 둔다.
// 반면 우리가 직접 운영하는 서버(VPS)는 nginx가 모든 경로를 index.html로 돌려보내주므로(try_files),
// "#" 없는 깨끗한 주소(BrowserRouter)를 쓸 수 있다 — 빌드 시 VITE_ROUTER_MODE=browser로 전환한다.
const Router = import.meta.env.VITE_ROUTER_MODE === 'browser' ? BrowserRouter : HashRouter;

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={`/@${MEMBER_ONE_USERNAME}`} replace />} />
          <Route path="/demo" element={<StaticDemoPortfolio />} />
          <Route
            path="/project-demo/shinhan-monthly-balance"
            element={
              <DemoAccessGuard>
                <Suspense fallback={null}>
                  <ShinhanMonthlyBalance />
                </Suspense>
              </DemoAccessGuard>
            }
          />
          {DEMO_SCREEN_ROUTES.map(({ routeKey, Component }) => (
            <Route
              key={routeKey}
              path={`/project-demo/${routeKey}`}
              element={
                <DemoAccessGuard>
                  <Suspense fallback={null}>
                    <Component />
                  </Suspense>
                </DemoAccessGuard>
              }
            />
          ))}
          {/* react-router는 ":param" 앞에 "/"가 있어야만 동적 구간으로 인식해서 "/@:username"은 항상 매칭 실패한다.
              그래서 "@아이디" 전체를 한 구간(:handle)으로 받은 뒤 PublicPortfolio에서 "@" 접두사를 검사해 벗겨낸다. */}
          <Route path="/:handle" element={<PublicPortfolio />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<LoginRequired />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
