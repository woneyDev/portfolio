import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import CareerSection from './components/CareerSection';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import VerifyEmail from './pages/VerifyEmail';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import portfolioDataKo from './data/portfolio.json';
import portfolioDataEn from './data/portfolio.en.json';
import './App.css';

const MEMBER_ONE_USERNAME = import.meta.env.VITE_MEMBER_ONE_USERNAME;

// 데모용 정적 페이지 — 실제 회원 데이터가 아닌 빌드에 포함된 예시 콘텐츠(portfolio.json)를 보여줍니다.
function StaticDemoPortfolio() {
  const { lang, t } = useLanguage();
  const portfolioData = lang === 'en' ? portfolioDataEn : portfolioDataKo;

  return (
    <div className="portfolio">
      <Navbar sectionIds={{ intro: true }} />
      <main>
        <HeroSection data={portfolioData.hero} />
        <div id="intro" className="scroll-anchor"><IntroSection data={portfolioData.intro} /></div>
        <div id="skills" className="scroll-anchor"><SkillsSection data={portfolioData.skills} /></div>
        <div id="projects" className="scroll-anchor"><ProjectsSection data={portfolioData.projects} /></div>
        <div id="career" className="scroll-anchor"><CareerSection data={portfolioData.career} /></div>
      </main>
      <footer className="footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to={`/@${MEMBER_ONE_USERNAME}`} replace />} />
          <Route path="/demo" element={<StaticDemoPortfolio />} />
          <Route path="/@:username" element={<PublicPortfolio />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}