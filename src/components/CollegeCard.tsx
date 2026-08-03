import { ArrowLeft, MapPin } from 'lucide-react'
import type { College } from '../types'
import { usePreferences } from '../context/PreferencesContext'

export default function CollegeCard({college,onDetails,onRegister}:{college:College;onDetails:()=>void;onRegister:()=>void}){
  const {language,t}=usePreferences()
  const name=language==='en'?(college.name_en||college.name):college.name
  return <article className="college-card"><div className="college-image"><img src={college.image_url} alt={t(`صورة ${college.name}`,`Photo of ${name}`)}/></div><div className="college-body">
    <span className="location"><MapPin size={15}/>{language==='en'?(college.location_en||college.location):college.location||t('الموقع يحدد عند الاستشارة','Location confirmed during consultation')}</span>
    <h3>{name}</h3><p>{language==='en'?(college.short_description_en||college.short_description):college.short_description}</p>
    <div className="chips">{college.college_courses.slice(0,3).map(c=><span key={c.name}>{language==='en'?(c.name_en||c.name):c.name}</span>)}</div>
    <div className="card-actions"><button className="btn primary small" onClick={onRegister}>{t('اطلب التسجيل','Apply Now')}</button><button className="text-btn" onClick={onDetails}>{t('عرض التفاصيل','View Details')} <ArrowLeft size={17}/></button></div>
  </div></article>
}
