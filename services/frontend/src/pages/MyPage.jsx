import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout/legacy';
import { api } from '../api-client';
import HeroSection from '../components/HeroSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import CareerSection from '../components/CareerSection';
import 'react-grid-layout/css/styles.css';
import './MyPage.css';

const GridLayoutWithWidth = WidthProvider(GridLayout);

const GRID_COLS = 4;
const SAVE_DEBOUNCE_MS = 800;

const SECTION_LABELS = {
  HERO: '자기소개',
  SKILLS: '스킬',
  PROJECTS: '프로젝트',
  CAREER: '경력사항',
};

const DEFAULT_SIZE_BY_TYPE = {
  HERO: { w: 4, h: 2 },
  SKILLS: { w: 4, h: 2 },
  PROJECTS: { w: 4, h: 3 },
  CAREER: { w: 4, h: 2 },
};

function groupSkillsByCategory(flatSkills) {
  const grouped = new Map();
  for (const skill of flatSkills) {
    if (!grouped.has(skill.category)) grouped.set(skill.category, []);
    grouped.get(skill.category).push(skill.name);
  }
  return Array.from(grouped, ([category, items]) => ({ category, items }));
}

function renderSectionContent(sectionType, portfolio) {
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

export default function MyPage() {
  const token = localStorage.getItem('admin_token');
  const [portfolio, setPortfolio] = useState(null);
  const [layout, setLayout] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved
  const saveTimer = useRef(null);

  useEffect(() => {
    api.getMyPortfolio(token)
      .then((data) => {
        setPortfolio(data);
        setLayout(data.layout);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  const persistLayout = useCallback((nextLayout) => {
    setSaveStatus('saving');
    api.updateMyLayout(token, nextLayout)
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('idle'));
  }, [token]);

  const scheduleSave = useCallback((nextLayout) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistLayout(nextLayout), SAVE_DEBOUNCE_MS);
  }, [persistLayout]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const visibleLayout = useMemo(() => layout.filter((item) => item.visible), [layout]);
  const hiddenLayout = useMemo(() => layout.filter((item) => !item.visible), [layout]);

  const gridLayoutItems = useMemo(
    () => visibleLayout.map((item) => ({ i: item.sectionType, x: item.x, y: item.y, w: item.w, h: item.h })),
    [visibleLayout],
  );

  function handleLayoutChange(changedItems) {
    const nextLayout = layout.map((item) => {
      const changed = changedItems.find((c) => c.i === item.sectionType);
      if (!changed) return item;
      return { ...item, x: changed.x, y: changed.y, w: changed.w, h: changed.h };
    });
    setLayout(nextLayout);
    scheduleSave(nextLayout);
  }

  function handleHide(sectionType) {
    const nextLayout = layout.map((item) =>
      item.sectionType === sectionType ? { ...item, visible: false } : item);
    setLayout(nextLayout);
    scheduleSave(nextLayout);
  }

  function handleShow(sectionType) {
    const maxY = visibleLayout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    const defaults = DEFAULT_SIZE_BY_TYPE[sectionType] ?? { w: 4, h: 2 };
    const nextLayout = layout.map((item) =>
      item.sectionType === sectionType
        ? { ...item, visible: true, x: 0, y: maxY, w: defaults.w, h: defaults.h }
        : item);
    setLayout(nextLayout);
    scheduleSave(nextLayout);
  }

  if (status === 'loading') return <div className="mypage-status">불러오는 중...</div>;
  if (status === 'error') return <div className="mypage-status">포트폴리오를 불러오지 못했습니다.</div>;

  return (
    <div className="mypage-wrap">
      <header className="mypage-header">
        <h1 className="mypage-title">마이페이지 — 화면 배치 편집</h1>
        <p className="mypage-hint">창을 드래그해서 옮기거나, 오른쪽 아래 모서리를 끌어서 크기를 바꿔보세요. 바뀐 배치는 자동으로 저장됩니다.</p>
        <span className={`mypage-save-status mypage-save-status--${saveStatus}`}>
          {saveStatus === 'saving' && '저장 중...'}
          {saveStatus === 'saved' && '저장됨'}
        </span>
      </header>

      {hiddenLayout.length > 0 && (
        <div className="mypage-hidden-panel">
          <span className="mypage-hidden-label">숨긴 항목:</span>
          {hiddenLayout.map((item) => (
            <button
              key={item.sectionType}
              type="button"
              className="mypage-add-btn"
              onClick={() => handleShow(item.sectionType)}
            >
              + {SECTION_LABELS[item.sectionType] ?? item.sectionType}
            </button>
          ))}
        </div>
      )}

      <GridLayoutWithWidth
        className="mypage-grid"
        cols={GRID_COLS}
        rowHeight={140}
        margin={[16, 16]}
        layout={gridLayoutItems}
        draggableHandle=".mypage-widget-handle"
        onLayoutChange={handleLayoutChange}
      >
        {visibleLayout.map((item) => (
          <div key={item.sectionType} className="mypage-widget">
            <div className="mypage-widget-handle">
              <span className="mypage-widget-title">{SECTION_LABELS[item.sectionType] ?? item.sectionType}</span>
              <button
                type="button"
                className="mypage-hide-btn"
                onClick={() => handleHide(item.sectionType)}
                title="이 창 숨기기"
              >
                제거
              </button>
            </div>
            <div className="mypage-widget-body">
              {renderSectionContent(item.sectionType, portfolio)}
            </div>
          </div>
        ))}
      </GridLayoutWithWidth>
    </div>
  );
}
