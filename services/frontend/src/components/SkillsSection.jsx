import { useLanguage } from '../i18n/LanguageContext';

export default function SkillsSection({ data }) {
  const { t } = useLanguage();
  return (
    <section className="section skills">
      <h2 className="section-title">{t.sectionTitles.skills}</h2>
      <div className="skills-grid">
        {data.map((group) => (
          <div key={group.category} className="skill-item">
            <div className="skill-category">{group.category}</div>
            <div className="skill-tags">
              {group.items.map((item) => (
                <span key={item} className="tech-badge">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
