export default function CustomSection({ data }) {
  return (
    <section className="section custom-section">
      <h2 className="section-title">{data.title}</h2>
      <div className="custom-section-content" dangerouslySetInnerHTML={{ __html: data.content }} />
    </section>
  );
}
