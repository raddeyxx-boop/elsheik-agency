import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/agency-logo.png'
import PreferenceControls from './PreferenceControls'
import { usePreferences } from '../context/PreferencesContext'

const links = [
  ['الرئيسية','Home','home'], ['من أنا','About Me','about'], ['خدماتنا','Our Services','services'],
  ['الوجهات الدراسية','Study Destinations','study-destinations'], ['الكليات','Colleges','colleges'],
  ['خطوات التسجيل','Registration Steps','steps'], ['اختبار اللغة','English Test','english-test'], ['تواصل معنا','Contact Us','contact'],
]

export default function Header() {
  const {language,t}=usePreferences()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const jump = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-wrap">
        <button className="brand" onClick={() => jump('home')} aria-label={t('العودة إلى الرئيسية','Back to Home')}>
          <img src={logo} alt={t('شعار وكالة الشيخ','ElSheik Education Agency logo')} />
          <span>{language==='ar'?'وكالة الشيخ':'ElSheik Agency'}<small>{language==='ar'?'للخدمات التعليمية':'Educational Services'}</small></span>
        </button>
        <PreferenceControls compact />
        <nav className="desktop-nav" aria-label={t('التنقل الرئيسي','Main navigation')}>
          {links.map(([ar,en,id]) => <button key={id} onClick={() => jump(id)}>{language==='ar'?ar:en}</button>)}
        </nav>
        <Link className="admin-link desktop-only" to="/admin/login">{t('دخول الإدارة','Admin Login')}</Link>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label={t('فتح القائمة','Open menu')}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="mobile-nav">
        <PreferenceControls />
        {links.map(([ar,en,id]) => <button key={id} onClick={() => jump(id)}>{language==='ar'?ar:en}</button>)}
        <Link to="/admin/login" onClick={() => setOpen(false)}>{t('دخول الإدارة','Admin Login')}</Link>
      </nav>}
    </header>
  )
}
