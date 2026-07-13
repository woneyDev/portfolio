import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import CareerSection from '../components/CareerSection';
import Navbar from '../components/Navbar';
import { useLanguage } from '../i18n/LanguageContext';
import portfolioDataKo from '../data/portfolio.json';
import portfolioDataEn from '../data/portfolio.en.json';

// 빌드에 포함된 정적 예시 콘텐츠(portfolio.json)를 보여줍니다.
// 실제 서버(API)가 응답하지 않을 때 회원별 공개 페이지의 대체 화면으로도 재사용됩니다.
export default function StaticDemoPortfolio() {
  const { lang, t } = useLanguage();
  const portfolioData = lang === 'en' ? portfolioDataEn : portfolioDataKo;

  return (
    <div className="portfolio">
      <Navbar
        items={[
          { id: 'intro', label: t.nav.intro },
          { id: 'skills', label: t.nav.skills },
          { id: 'projects', label: t.nav.projects },
          { id: 'career', label: t.nav.career },
        ]}
      />
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
