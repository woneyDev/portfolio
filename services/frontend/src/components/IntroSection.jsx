import profilePhoto from "../assets/profile.jpg";

export default function IntroSection({ data }) {
  return (
    <section className="section intro">
      <h2 className="section-title">자기소개</h2>
      <div className="intro-layout">
        <div className="intro-photo">
          <img src={profilePhoto} alt="프로필 사진" />
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
