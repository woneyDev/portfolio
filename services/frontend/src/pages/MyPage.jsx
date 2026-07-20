import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout/legacy';
import { api } from '../api-client';
import HeroSection from '../components/HeroSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import CareerSection from '../components/CareerSection';
import CustomSection from '../components/CustomSection';
import RichTextEditor from '../components/RichTextEditor';
import 'react-grid-layout/css/styles.css';
import './MyPage.css';

const GridLayoutWithWidth = WidthProvider(GridLayout);

// 12칸 기준: 2/3/4/6등분이 전부 나누어떨어져서, 창을 줄였을 때 3x1·4x1 같은 배치도 고르게 맞출 수 있다.
const GRID_COLS = 12;
const SAVE_DEBOUNCE_MS = 800;
const CUSTOM_KEY_PREFIX = 'custom:';

const SECTION_LABELS = {
  HERO: '인트로 배너',
  SKILLS: '기술스택',
  PROJECTS: '프로젝트',
  CAREER: '경력사항',
};

const DEFAULT_SIZE_BY_TYPE = {
  HERO: { w: 12, h: 2 },
  SKILLS: { w: 12, h: 2 },
  PROJECTS: { w: 12, h: 3 },
  CAREER: { w: 12, h: 2 },
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
  const [customSections, setCustomSections] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const saveTimer = useRef(null);

  function applyPortfolioData(data) {
    setPortfolio(data);
    setLayout(data.layout);
    setCustomSections(data.customSections ?? []);
  }

  useEffect(() => {
    api.getMyPortfolio(token)
      .then((data) => {
        applyPortfolioData(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  const persistLayout = useCallback((nextLayout, nextCustomSections) => {
    setSaveStatus('saving');
    api.updateMyLayout(token, nextLayout, nextCustomSections)
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('idle'));
  }, [token]);

  const scheduleSave = useCallback((nextLayout, nextCustomSections) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistLayout(nextLayout, nextCustomSections), SAVE_DEBOUNCE_MS);
  }, [persistLayout]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const visibleLayout = useMemo(() => layout.filter((item) => item.visible), [layout]);
  const hiddenLayout = useMemo(() => layout.filter((item) => !item.visible), [layout]);

  const gridLayoutItems = useMemo(() => [
    ...visibleLayout.map((item) => ({ i: item.sectionType, x: item.x, y: item.y, w: item.w, h: item.h })),
    ...customSections.map((item) => ({ i: `${CUSTOM_KEY_PREFIX}${item.id}`, x: item.x, y: item.y, w: item.w, h: item.h })),
  ], [visibleLayout, customSections]);

  function mergeChanges(changedItems) {
    const nextLayout = layout.map((item) => {
      const changed = changedItems.find((c) => c.i === item.sectionType);
      if (!changed) return item;
      return { ...item, x: changed.x, y: changed.y, w: changed.w, h: changed.h };
    });
    const nextCustomSections = customSections.map((item) => {
      const changed = changedItems.find((c) => c.i === `${CUSTOM_KEY_PREFIX}${item.id}`);
      if (!changed) return item;
      return { ...item, x: changed.x, y: changed.y, w: changed.w, h: changed.h };
    });
    return { nextLayout, nextCustomSections };
  }

  // react-grid-layout는 라이브러리 내부 사정(마운트 직후 재계산 등)으로도 onLayoutChange를 호출할 수 있어서,
  // 여기서는 화면 상태만 맞춰두고 저장은 하지 않는다. 실제 저장은 사용자가 드래그·크기조절을 "끝냈을 때"만
  // 호출되는 onDragStop/onResizeStop에서 한다 — 그래야 사용자가 하지도 않은 변경이 DB에 저장되지 않는다.
  function handleLayoutChange(changedItems) {
    const { nextLayout, nextCustomSections } = mergeChanges(changedItems);
    setLayout(nextLayout);
    setCustomSections(nextCustomSections);
  }

  function handleInteractionStop(changedItems) {
    const { nextLayout, nextCustomSections } = mergeChanges(changedItems);
    setLayout(nextLayout);
    setCustomSections(nextCustomSections);
    scheduleSave(nextLayout, nextCustomSections);
  }

  function handleHide(sectionType) {
    const nextLayout = layout.map((item) =>
      item.sectionType === sectionType ? { ...item, visible: false } : item);
    setLayout(nextLayout);
    scheduleSave(nextLayout, customSections);
  }

  function handleShow(sectionType) {
    const maxY = visibleLayout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    const defaults = DEFAULT_SIZE_BY_TYPE[sectionType] ?? { w: 12, h: 2 };
    const nextLayout = layout.map((item) =>
      item.sectionType === sectionType
        ? { ...item, visible: true, x: 0, y: maxY, w: defaults.w, h: defaults.h }
        : item);
    setLayout(nextLayout);
    scheduleSave(nextLayout, customSections);
  }

  function handleAddCustomSection(e) {
    e.preventDefault();
    const title = newTitle.trim();
    const content = newContent.trim();
    if (!title || !content) return;
    api.createCustomSection(token, title, content).then((data) => {
      applyPortfolioData(data);
      setNewTitle('');
      setNewContent('');
      setShowAddForm(false);
    });
  }

  function startEditCustomSection(item) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditContent(item.content);
  }

  function cancelEditCustomSection() {
    setEditingId(null);
  }

  function saveEditCustomSection(e, id) {
    e.preventDefault();
    const title = editTitle.trim();
    const content = editContent.trim();
    if (!title || !content) return;
    api.updateCustomSection(token, id, title, content).then((data) => {
      applyPortfolioData(data);
      setEditingId(null);
    });
  }

  function handleDeleteCustomSection(id) {
    if (!window.confirm('이 섹션을 완전히 삭제할까요? 되돌릴 수 없습니다.')) return;
    api.deleteCustomSection(token, id).then((data) => {
      applyPortfolioData(data);
    });
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

      <div className="mypage-custom-add">
        {!showAddForm && (
          <button type="button" className="mypage-add-btn" onClick={() => setShowAddForm(true)}>
            + 새 섹션 추가
          </button>
        )}
        {showAddForm && (
          <form className="mypage-custom-form" onSubmit={handleAddCustomSection}>
            <input
              className="mypage-custom-input"
              type="text"
              placeholder="섹션 제목 (예: 수상 내역, 취미)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              maxLength={60}
              autoFocus
            />
            <RichTextEditor
              value={newContent}
              onChange={setNewContent}
              placeholder="자유롭게 내용을 작성하세요"
            />
            <div className="mypage-custom-form-actions">
              <button type="submit" className="mypage-btn-primary">추가</button>
              <button type="button" className="mypage-btn-secondary" onClick={() => setShowAddForm(false)}>취소</button>
            </div>
          </form>
        )}
      </div>

      <GridLayoutWithWidth
        className="mypage-grid"
        cols={GRID_COLS}
        rowHeight={140}
        margin={[16, 16]}
        layout={gridLayoutItems}
        draggableHandle=".mypage-widget-handle"
        onLayoutChange={handleLayoutChange}
        onDragStop={handleInteractionStop}
        onResizeStop={handleInteractionStop}
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

        {customSections.map((item) => (
          <div key={`${CUSTOM_KEY_PREFIX}${item.id}`} className="mypage-widget">
            <div className="mypage-widget-handle">
              <span className="mypage-widget-title">{item.title}</span>
              <div className="mypage-widget-actions">
                {editingId !== item.id && (
                  <button
                    type="button"
                    className="mypage-hide-btn"
                    onClick={() => startEditCustomSection(item)}
                    title="제목·내용 수정"
                  >
                    수정
                  </button>
                )}
                <button
                  type="button"
                  className="mypage-hide-btn"
                  onClick={() => handleDeleteCustomSection(item.id)}
                  title="이 섹션 완전히 삭제"
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="mypage-widget-body">
              {editingId === item.id ? (
                <form className="mypage-custom-form" onSubmit={(e) => saveEditCustomSection(e, item.id)}>
                  <input
                    className="mypage-custom-input"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={60}
                    autoFocus
                  />
                  <RichTextEditor
                    key={item.id}
                    value={editContent}
                    onChange={setEditContent}
                  />
                  <div className="mypage-custom-form-actions">
                    <button type="submit" className="mypage-btn-primary">저장</button>
                    <button type="button" className="mypage-btn-secondary" onClick={cancelEditCustomSection}>취소</button>
                  </div>
                </form>
              ) : (
                <CustomSection data={item} />
              )}
            </div>
          </div>
        ))}
      </GridLayoutWithWidth>
    </div>
  );
}
