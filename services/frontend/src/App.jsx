import { HashRouter, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import CareerSection from './components/CareerSection';
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import portfolioData from './data/portfolio.json';
import './App.css';

function scrollToSection(e, id) {
  e.preventDefault();
  burst(e);
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
  return (
    <div className="portfolio">
      <nav className="navbar">
        <span className="nav-brand">Portfolio</span>
        <div className="nav-links">
          <a href="#intro" onClick={(e) => scrollToSection(e, 'intro')}>소개</a>
          <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')}>기술 스택</a>
          <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>프로젝트</a>
          <a href="#career" onClick={(e) => scrollToSection(e, 'career')}>경력</a>
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
        <p>© 2026 · Built with React · Hosted on GitHub Pages</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
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
  );
}