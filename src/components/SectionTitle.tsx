export default function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="section-title">
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    {text && <p>{text}</p>}
  </div>
}
