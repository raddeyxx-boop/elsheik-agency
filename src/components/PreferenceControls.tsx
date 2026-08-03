import { Languages, Moon, Sun } from 'lucide-react'
import { usePreferences } from '../context/PreferencesContext'
import { useTheme } from '../context/ThemeContext'

export default function PreferenceControls({compact=false}:{compact?:boolean}) {
  const {language,setLanguage,t}=usePreferences()
  const {theme,toggleTheme}=useTheme()
  const languageLabel=language==='ar'?'تغيير لغة الموقع':'Change website language'
  const themeLabel=language==='ar'?(theme==='light'?'تفعيل الوضع الداكن':'تفعيل الوضع الفاتح'):(theme==='light'?'Enable dark mode':'Enable light mode')
  return <div className={`preference-controls ${compact?'compact':''}`}>
    <div className="language-control" aria-label={languageLabel} title={languageLabel}><Languages aria-hidden="true"/><button type="button" className={language==='ar'?'active':''} aria-pressed={language==='ar'} aria-label={t('languages.arabic')} disabled={language==='ar'} onClick={()=>setLanguage('ar')}>AR</button><span>/</span><button type="button" className={language==='en'?'active':''} aria-pressed={language==='en'} aria-label={t('languages.english')} disabled={language==='en'} onClick={()=>setLanguage('en')}>EN</button></div>
    <button className="theme-control" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>{theme==='light'?<Moon/>:<Sun/>}</button>
  </div>
}
