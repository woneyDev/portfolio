import profilePhoto from "../assets/profile.jpg";
import { useLanguage } from "../i18n/LanguageContext";

export default function IntroSection({ data }) {
  const { t } = useLanguage();
  return (
    <section className="section intro">
      <h2 className="section-title">{t.sectionTitles.intro}</h2>
      <div className="intro-layout">
        <div className="intro-photo">
          <img src={profilePhoto} alt={t.account.profileAlt} />
        </div>
        <div className="intro-body">
          <p className="intro-greeting">{data.greeting}</p>
          {data.paragraphs.map((p) => (
            <div key={p.heading} className="intro-paragraph">
              <h3>{p.heading}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
