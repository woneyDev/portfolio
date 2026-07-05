import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api-client';
import { useLanguage } from '../i18n/LanguageContext';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import CareerSection from '../components/CareerSection';

function groupSkillsByCategory(flatSkills) {
  const grouped = new Map();
  for (const skill of flatSkills) {
    if (!grouped.has(skill.category)) grouped.set(skill.category, []);
    grouped.get(skill.category).push(skill.name);
  }
  return Array.from(grouped, ([category, items]) => ({ category, items }));
}

export default function PublicPortfolio() {
  const { username } = useParams();
  const { t } = useLanguage();
  const [portfolio, setPortfolio] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | not-found | error

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    api.getPortfolioByUsername(username)
      .then((data) => {
        if (!cancelled) {
          setPortfolio(data);
          setStatus('ready');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(err.message?.includes('404') ? 'not-found' : 'error');
      });

    return () => { cancelled = true; };
  }, [username]);

  return (
    <div className="portfolio">
      <Navbar sectionIds={{ intro: false }} />
      <main>
        {status === 'loading' && <div className="section"><p>불러오는 중...</p></div>}
        {status === 'not-found' && <div className="section"><p>&quot;{username}&quot; 회원을 찾을 수 없습니다.</p></div>}
        {status === 'error' && <div className="section"><p>포트폴리오를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p></div>}
        {status === 'ready' && (
          <>
            <HeroSection data={{ ...portfolio.hero, github: portfolio.hero.githubUrl }} />
            <div id="skills" className="scroll-anchor"><SkillsSection data={groupSkillsByCategory(portfolio.skills)} /></div>
            <div id="projects" className="scroll-anchor"><ProjectsSection data={portfolio.projects} /></div>
            <div id="career" className="scroll-anchor"><CareerSection data={portfolio.career} /></div>
          </>
        )}
      </main>
      <footer className="footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
