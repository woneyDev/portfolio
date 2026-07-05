import { useLanguage } from '../i18n/LanguageContext';

export default function ProjectsSection({ data }) {
  const { t } = useLanguage();
  return (
    <section className="section projects">
      <h2 className="section-title">{t.sectionTitles.projects}</h2>
      <div className="projects-grid">
        {data.map((project) => (
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
                <button type="button" className="btn btn-outline project-demo-btn" disabled title={t.projects.comingSoon}>
                  {t.projects.viewButton}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
