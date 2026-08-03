import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { usePreferences } from '../context/PreferencesContext'
export default function EnglishTestShell({children}:{children:React.ReactNode}){
  const {language}=usePreferences(); const en=language==='en'
  return <div className="test-page"><header className="test-header"><Link to="/"><GraduationCap/> {en?'ElSheik Education Agency':'وكالة الشيخ التعليمية'}</Link><span>{en?'English Placement Test':'اختبار اللغة الإنجليزية'}</span></header><main className="test-container">{children}</main></div>
}
