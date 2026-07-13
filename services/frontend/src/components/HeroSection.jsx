import { useLanguage } from '../i18n/LanguageContext';
import profilePhoto from '../assets/profile.jpg';

export default function HeroSection({ data }) {
  const { t } = useLanguage();
  return (
    <section className="hero">
      <div className="hero-content">
        <img src={profilePhoto} alt={t.account.profileAlt} className="hero-photo" />
        <h1>{data.title}</h1>
        <p className="hero-subtitle">{data.subtitle}</p>
        <div className="hero-links">
          <a href={`mailto:${data.email}`} className="btn btn-primary">{t.hero.emailBtn}</a>
          <a href={data.github} target="_blank" rel="noreferrer" className="btn btn-outline">GitHub</a>
        </div>
      </div>
    </section>
  );
}
