import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import ProjectDemoThumbnail from './ProjectDemoThumbnail';

// 아이폰 15 프로맥스 기준 화면 크기 (모바일 화면이므로 새 창 폭을 여기에 맞춤)
const DEMO_WINDOW_WIDTH = 430;
const DEMO_WINDOW_HEIGHT = 932;

export default function ProjectDemoModal({ project, onClose }) {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const screens = project.demo?.screens ?? [];

  const openDemoScreen = (routeKey) => {
    const url = `${window.location.pathname}${window.location.search}#/project-demo/${routeKey}`;

    // 화면(모니터) 정중앙에 뜨도록 좌표 계산
    const screenWidth = window.screen.availWidth ?? window.screen.width;
    const screenHeight = window.screen.availHeight ?? window.screen.height;
    const left = Math.max(0, Math.round((screenWidth - DEMO_WINDOW_WIDTH) / 2));
    const top = Math.max(0, Math.round((screenHeight - DEMO_WINDOW_HEIGHT) / 2));

    window.open(
      url,
      '_blank',
      `width=${DEMO_WINDOW_WIDTH},height=${DEMO_WINDOW_HEIGHT},left=${left},top=${top},noopener,noreferrer`
    );
  };

  return (
    <div className="demo-modal-overlay" onClick={onClose}>
      <div className="demo-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="demo-modal-close"
          onClick={onClose}
          aria-label={t.projects.close}
        >
          &times;
        </button>
        <h3 className="demo-modal-title">{project.title}</h3>
        <div className="demo-modal-screens">
          {screens.map((screen) => (
            <button
              key={screen.screenName}
              type="button"
              className="demo-modal-screen"
              onClick={() => openDemoScreen(screen.routeKey)}
            >
              <ProjectDemoThumbnail screenName={screen.screenName} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
