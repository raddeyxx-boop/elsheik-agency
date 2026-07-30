import { ArrowLeft, MapPin } from 'lucide-react'
import type { College } from '../types'

export default function CollegeCard({ college, onDetails, onRegister }: { college: College; onDetails: () => void; onRegister: () => void }) {
  return <article className="college-card">
    <div className="college-image"><img src={college.image_url} alt={`صورة ${college.name}`} /></div>
    <div className="college-body">
      <span className="location"><MapPin size={15} />{college.location || 'الموقع يحدد عند الاستشارة'}</span>
      <h3>{college.name}</h3>
      <p>{college.short_description}</p>
      <div className="chips">{college.college_courses.slice(0, 3).map(c => <span key={c.name}>{c.name}</span>)}</div>
      <div className="card-actions">
        <button className="btn primary small" onClick={onRegister}>اطلب التسجيل</button>
        <button className="text-btn" onClick={onDetails}>عرض التفاصيل <ArrowLeft size={17} /></button>
      </div>
    </div>
  </article>
}
