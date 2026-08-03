import { MapPin, X } from 'lucide-react'
import type { College } from '../types'
import { usePreferences } from '../context/PreferencesContext'

export default function CollegeModal({college,onClose,onRegister}:{college:College|null;onClose:()=>void;onRegister:()=>void}){
  const {language,t}=usePreferences()
  if(!college)return null
  const name=language==='en'?(college.name_en||college.name):college.name
  const message=language==='ar'?'مرحبًا أستاذ علي، أرغب في معرفة المزيد.':'Hello Mr. Ali, I would like more information.'
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-label={t(`تفاصيل ${college.name}`,`Details for ${name}`)} onMouseDown={e=>e.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label={t('إغلاق','Close')}><X/></button><img src={college.image_url} alt={t(`صورة ${college.name}`,`Photo of ${name}`)}/><div className="modal-content">
    <span className="location"><MapPin size={16}/>{language==='en'?(college.location_en||college.location):college.location}</span><h2>{name}</h2><p>{language==='en'?(college.description_en||college.description):college.description}</p>
    <h3>{t('التخصصات المتاحة','Available Programs')}</h3><div className="chips">{college.college_courses.map(c=><span key={c.name}>{language==='en'?(c.name_en||c.name):c.name}</span>)}</div>
    <div className="modal-actions"><button className="btn primary" onClick={onRegister}>{t('ابدأ طلب التسجيل','Start Your Application')}</button><a className="btn secondary" href={`https://wa.me/919036102240?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">{t('تواصل عبر واتساب','Contact on WhatsApp')}</a></div>
  </div></div></div>
}
