import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/agency-logo.png'

const links = [
  ['اختبار اللغة', 'english-test'],
  ['الرئيسية', 'home'], ['من أنا', 'about'], ['خدماتنا', 'services'],
  ['الوجهات الدراسية', 'study-destinations'],
  ['الكليات', 'colleges'], ['خطوات التسجيل', 'steps'], ['تواصل معنا', 'contact'],
]

export default function Header() {
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
        <button className="brand" onClick={() => jump('home')} aria-label="العودة إلى الرئيسية">
          <img src={logo} alt="شعار وكالة الشيخ" />
          <span>وكالة الشيخ<small>للخدمات التعليمية</small></span>
        </button>
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {links.map(([label, id]) => <button key={id} onClick={() => jump(id)}>{label}</button>)}
        </nav>
        <Link className="admin-link desktop-only" to="/admin/login">دخول الإدارة</Link>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="فتح القائمة">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="mobile-nav">
        {links.map(([label, id]) => <button key={id} onClick={() => jump(id)}>{label}</button>)}
        <Link to="/admin/login" onClick={() => setOpen(false)}>دخول الإدارة</Link>
      </nav>}
    </header>
  )
}
