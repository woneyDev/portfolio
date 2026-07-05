import { HashRouter, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import CareerSection from './components/CareerSection';
import PrivateRoute from './components/PrivateRoute';
import LanguageSwitcher from './components/LanguageSwitcher';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import portfolioDataKo from './data/portfolio.json';
import portfolioDataEn from './data/portfolio.en.json';
import './App.css';

const NAVBAR_HEIGHT = 56;

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function animatedScrollTo(targetY, duration = 700) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutQuad(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function scrollToSection(e, id) {
  e.preventDefault();
  burst(e);
  const el = document.getElementById(id);
  if (!el) return;
  const targetY = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  animatedScrollTo(targetY);
}

function burst(e) {
  const colors = ['#2563eb', '#60a5fa', '#93c5fd', '#3b82f6', '#1d4ed8'];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'nav-particle';
    document.body.appendChild(p);
    const angle = (i / count) * 360;
    const dist = 28 + Math.random() * 22;
    p.style.left = e.clientX + 'px';
    p.style.top = e.clientY + 'px';
    p.style.setProperty('--dx', `${Math.cos((angle * Math.PI) / 180) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin((angle * Math.PI) / 180) * dist}px`);
    p.style.background = colors[i % colors.length];
    setTimeout(() => p.remove(), 650);
  }
}

function Portfolio() {
  const { lang, t } = useLanguage();
  const portfolioData = lang === 'en' ? portfolioDataEn : portfolioDataKo;

  return (
    <div className="portfolio">
      <nav className="navbar">
        <span className="nav-brand">Portfolio</span>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#intro" onClick={(e) => scrollToSection(e, 'intro')}>{t.nav.intro}</a>
            <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')}>{t.nav.skills}</a>
            <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>{t.nav.projects}</a>
            <a href="#career" onClick={(e) => scrollToSection(e, 'career')}>{t.nav.career}</a>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>
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
          <Route path="/" element={<Portfolio />} />
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