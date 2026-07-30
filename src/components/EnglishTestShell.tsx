import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
export default function EnglishTestShell({children}:{children:React.ReactNode}){
  return <div className="test-page"><header className="test-header"><Link to="/"><GraduationCap/> وكالة الشيخ التعليمية</Link><span>اختبار اللغة الإنجليزية</span></header><main className="test-container">{children}</main></div>
}
