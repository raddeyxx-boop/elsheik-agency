import { Instagram, Mail, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/agency-logo.png'
import { usePreferences } from '../context/PreferencesContext'

export default function Footer() {
  const {language}=usePreferences(); const en=language==='en'
  return <footer>
    <div className="container footer-grid">
      <div className="footer-brand"><img src={logo} alt={en?'ElSheik Education Agency logo':'شعار وكالة الشيخ'} /><div><h3>{en?'ElSheik Education Agency':'وكالة الشيخ'}</h3><p>{en?'We support your education journey from the first idea to admission.':'نرافقك في رحلتك التعليمية من الفكرة حتى القبول.'}</p></div></div>
      <div><h4>{en?'Quick Links':'روابط سريعة'}</h4><a href="#about">{en?'About Me':'من أنا'}</a><a href="#services">{en?'Our Services':'خدماتنا'}</a><a href="#colleges">{en?'Colleges':'الكليات'}</a><a href="#contact">{en?'Registration':'التسجيل'}</a></div>
      <div><h4>{en?'Contact Us':'تواصل معنا'}</h4><a href="https://wa.me/919036102240" target="_blank" rel="noreferrer"><MessageCircle size={17} /> +91 9036102240</a><a href="mailto:elsheik@gmail.com"><Mail size={17} /> elsheik@gmail.com</a><a href="#" aria-label={en?'Instagram':'إنستغرام'}><Instagram size={17} /> {en?'Instagram':'إنستغرام'}</a></div>
      <div><h4>{en?'Administration':'الإدارة'}</h4><Link to="/admin/login">{en?'Admin Login':'دخول الإدارة'}</Link><p className="footer-note">{en?'The admin area is protected and restricted to authorized staff.':'واجهة الإدارة محمية ومخصصة للمسؤول.'}</p></div>
    </div>
    <div className="copyright">{en?`All rights reserved © ${new Date().getFullYear()} ElSheik Education Agency`:`جميع الحقوق محفوظة © ${new Date().getFullYear()} وكالة الشيخ للخدمات التعليمية`}</div>
  </footer>
}
