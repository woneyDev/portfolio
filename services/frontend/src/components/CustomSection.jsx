export default function CustomSection({ data }) {
  return (
    <section className="section custom-section">
      <h2 className="section-title">{data.title}</h2>
      <p className="custom-section-content">{data.content}</p>
    </section>
  );
}
