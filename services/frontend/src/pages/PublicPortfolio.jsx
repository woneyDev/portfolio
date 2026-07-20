import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api-client';
import { useLanguage } from '../i18n/LanguageContext';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import CareerSection from '../components/CareerSection';
import CustomSection from '../components/CustomSection';
import profilePhoto from '../assets/profile.jpg';
import StaticDemoPortfolio from './StaticDemoPortfolio';
import LoginRequired from './LoginRequired';

const MEMBER_ONE_USERNAME = import.meta.env.VITE_MEMBER_ONE_USERNAME;

const SECTION_ANCHOR_IDS = { SKILLS: 'skills', PROJECTS: 'projects', CAREER: 'career' };

// 배치 정보가 없는 예전 캐시 응답(배포 직후 최대 10분)을 위한 기본 순서 — DB 기본값과 동일하게 맞춤
const FALLBACK_LAYOUT = [
  { sectionType: 'HERO', x: 0, y: 0, w: 12, h: 2, visible: true },
  { sectionType: 'SKILLS', x: 0, y: 2, w: 12, h: 2, visible: true },
  { sectionType: 'PROJECTS', x: 0, y: 4, w: 12, h: 3, visible: true },
  { sectionType: 'CAREER', x: 0, y: 7, w: 12, h: 2, visible: true },
];

function groupSkillsByCategory(flatSkills) {
  const grouped = new Map();
  for (const skill of flatSkills) {
    if (!grouped.has(skill.category)) grouped.set(skill.category, []);
    grouped.get(skill.category).push(skill.name);
  }
  return Array.from(grouped, ([category, items]) => ({ category, items }));
}

// 자기소개(slug: 'intro') 섹션만 데모 화면(IntroSection)과 동일하게 좌측에 프로필 사진을 곁들여 보여준다.
// title로 판별하지 않는 이유: 영어로 보면 제목이 "About Me"로 바뀌어 문자열 비교가 깨지기 때문.
function renderCustomSection(item) {
  if (item.slug === 'intro') {
    return (
      <section className="section custom-section">
        <h2 className="section-title">{item.title}</h2>
        <div className="intro-layout">
          <div className="intro-photo"><img src={profilePhoto} alt="프로필 사진" /></div>
          <div className="intro-body">
            <div className="custom-section-content" dangerouslySetInnerHTML={{ __html: item.content }} />
          </div>
        </div>
      </section>
    );
  }
  return <CustomSection data={item} />;
}

function renderSection(sectionType, portfolio) {
  switch (sectionType) {
    case 'HERO':
      return <HeroSection data={{ ...portfolio.hero, github: portfolio.hero.githubUrl }} />;
    case 'SKILLS':
      return <SkillsSection data={groupSkillsByCategory(portfolio.skills)} />;
    case 'PROJECTS':
      return <ProjectsSection data={portfolio.projects} />;
    case 'CAREER':
      return <CareerSection data={portfolio.career} />;
    default:
      return null;
  }
}

export default function PublicPortfolio() {
  const { handle } = useParams();
  // "/:handle" 하나로 "@아이디" 구간 전체를 받은 뒤, "@"로 시작하는 경우에만 회원 아이디로 인정한다.
  // ("/@:username" 형태는 react-router가 동적 구간으로 인식하지 못해 항상 매칭에 실패하는 문제의 우회)
  const username = handle?.startsWith('@') ? handle.slice(1) : null;
  const { t, lang } = useLanguage();
  const [portfolio, setPortfolio] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | not-found | error
  const [isOwner, setIsOwner] = useState(false);

  // 언어를 바꾸면(lang 변경) 그 언어로 다시 요청한다 — 두 언어를 한 번에 미리 받아두지 않는다.
  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setStatus('loading');

    api.getPortfolioByUsername(username, lang)
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
  }, [username, lang]);

  // 로그인되어 있고, 지금 보고 있는 페이지가 본인 페이지일 때만 "편집하기" 버튼을 보여준다.
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    let cancelled = false;
    api.getMyPortfolio(token)
      .then((data) => {
        if (!cancelled && data.username?.toLowerCase() === username?.toLowerCase()) {
          setIsOwner(true);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [username]);

  // "@"로 시작하지 않는 알 수 없는 주소는 기존과 동일하게 로그인 안내 화면으로 보낸다.
  if (!username) {
    return <LoginRequired />;
  }

  // 서버(API)가 아직 인터넷에 없어서 응답을 못 받는 경우 — 기본 회원(홈)이면 정적 데모 콘텐츠로 대신 보여준다.
  // 서버가 실제로 준비되면 이 요청들은 정상 응답하게 되고, 이 대체 화면은 더 이상 나타나지 않는다.
  if (status === 'error' && username?.toLowerCase() === MEMBER_ONE_USERNAME?.toLowerCase()) {
    return <StaticDemoPortfolio />;
  }

  // 화면에 실제로 보이는 섹션(고정 + 커스텀)을 배치 순서(위→아래, 왼쪽→오른쪽)대로 하나의 목록으로 합친다.
  // 퀵버튼(Navbar)도 이 목록을 그대로 따라간다 — 섹션을 숨기거나 이름을 바꾸면 퀵버튼도 자동으로 맞춰진다.
  const visibleSections = status === 'ready'
    ? [
        ...(portfolio.layout?.length > 0 ? portfolio.layout : FALLBACK_LAYOUT)
          .map((item) => ({ ...item, key: item.sectionType, kind: 'fixed' })),
        ...(portfolio.customSections ?? [])
          .map((item) => ({ ...item, key: `custom-${item.id}`, kind: 'custom' })),
      ]
        .filter((item) => item.visible)
        .sort((a, b) => a.y - b.y || a.x - b.x)
        .map((item) => ({
          ...item,
          anchorId: item.kind === 'custom' ? `custom-${item.id}` : SECTION_ANCHOR_IDS[item.sectionType],
        }))
    : [];

  // HERO(맨 위 배너)는 퀵버튼에서 제외 — 그 외 보이는 섹션은 고정/커스텀 구분 없이 모두 포함한다.
  const navItems = visibleSections
    .filter((item) => item.anchorId)
    .map((item) => ({
      id: item.anchorId,
      label: item.kind === 'custom' ? item.title : t.nav[item.sectionType.toLowerCase()],
    }));

  return (
    <div className="portfolio">
      <Navbar items={navItems} editLink={isOwner ? '/mypage' : null} />
      <main>
        {status === 'loading' && <div className="section"><p>{t.status.loading}</p></div>}
        {status === 'not-found' && (
          <div className="section"><p>{t.status.notFoundBefore}{username}{t.status.notFoundAfter}</p></div>
        )}
        {status === 'error' && <div className="section"><p>{t.status.loadError}</p></div>}
        {status === 'ready' && (
          <div className="portfolio-grid">
            {visibleSections.map((item) => (
              <div
                key={item.key}
                id={item.anchorId}
                className="portfolio-grid-item scroll-anchor"
                style={{ gridColumn: `${item.x + 1} / span ${item.w}` }}
              >
                {item.kind === 'custom' ? renderCustomSection(item) : renderSection(item.sectionType, portfolio)}
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
