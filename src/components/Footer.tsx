import { Instagram, Mail, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/agency-logo.png'

export default function Footer() {
  return <footer>
    <div className="container footer-grid">
      <div className="footer-brand"><img src={logo} alt="شعار وكالة الشيخ" /><div><h3>وكالة الشيخ</h3><p>نرافقك في رحلتك التعليمية من الفكرة حتى القبول.</p></div></div>
      <div><h4>روابط سريعة</h4><a href="#about">من أنا</a><a href="#services">خدماتنا</a><a href="#colleges">الكليات</a><a href="#contact">التسجيل</a></div>
      <div><h4>تواصل معنا</h4><a href="https://wa.me/919036102240" target="_blank" rel="noreferrer"><MessageCircle size={17} /> +91 9036102240</a><a href="mailto:elsheik@gmail.com"><Mail size={17} /> elsheik@gmail.com</a><a href="#" aria-label="إنستغرام"><Instagram size={17} /> إنستغرام</a></div>
      <div><h4>الإدارة</h4><Link to="/admin/login">دخول الإدارة</Link><p className="footer-note">واجهة الإدارة محمية ومخصصة للمسؤول.</p></div>
    </div>
    <div className="copyright">جميع الحقوق محفوظة © {new Date().getFullYear()} وكالة الشيخ للخدمات التعليمية</div>
  </footer>
}
