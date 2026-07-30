import { MapPin, X } from 'lucide-react'
import type { College } from '../types'

export default function CollegeModal({ college, onClose, onRegister }: { college: College | null; onClose: () => void; onRegister: () => void }) {
  if (!college) return null
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <div className="modal" role="dialog" aria-modal="true" aria-label={`تفاصيل ${college.name}`} onMouseDown={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="إغلاق"><X /></button>
      <img src={college.image_url} alt={`صورة ${college.name}`} />
      <div className="modal-content">
        <span className="location"><MapPin size={16} />{college.location}</span>
        <h2>{college.name}</h2>
        <p>{college.description}</p>
        <h3>التخصصات المتاحة</h3>
        <div className="chips">{college.college_courses.map(c => <span key={c.name}>{c.name}</span>)}</div>
        <div className="modal-actions">
          <button className="btn primary" onClick={onRegister}>ابدأ طلب التسجيل</button>
          <a className="btn secondary" href="https://wa.me/919036102240?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0%20%D8%B9%D9%84%D9%8A%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D9%85%D8%B9%D8%B1%D9%81%D8%A9%20%D8%A7%D9%84%D9%85%D8%B2%D9%8A%D8%AF." target="_blank" rel="noreferrer">تواصل عبر واتساب</a>
        </div>
      </div>
    </div>
  </div>
}
