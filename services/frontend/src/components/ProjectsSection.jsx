import { lazy, Suspense, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// 실제로 "프로젝트 둘러보기"를 클릭했을 때만 모달 코드와 이미지가 로드되도록 지연 로딩
const ProjectDemoModal = lazy(() => import('./ProjectDemoModal'));

export default function ProjectsSection({ data }) {
  const { t } = useLanguage();
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section className="section projects">
      <h2 className="section-title">{t.sectionTitles.projects}</h2>
      <div className="projects-grid">
        {data.map((project) => {
          const hasDemoList = Boolean(project.demo?.screens?.length);
          return (
            <div key={project.title} className="project-card">
              <div className="project-period">{project.period}</div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="tech-stack">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>
              {project.hasDemo && (
                <div className="project-demo">
                  <button
                    type="button"
                    className="btn btn-outline project-demo-btn"
                    disabled={!hasDemoList}
                    title={hasDemoList ? undefined : t.projects.comingSoon}
                    onClick={hasDemoList ? () => setActiveProject(project) : undefined}
                  >
                    {t.projects.viewButton}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {activeProject && (
        <Suspense fallback={null}>
          <ProjectDemoModal project={activeProject} onClose={() => setActiveProject(null)} />
        </Suspense>
      )}
    </section>
  );
}
