import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import logo from '../assets/agency-logo.png'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signIn, user, isAdmin, loading: authLoading } = useAuth()

  if (!authLoading && user && isAdmin) return <Navigate to="/admin/dashboard" replace />

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const nextErrors: typeof fieldErrors = {}
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'يرجى إدخال بريد إلكتروني صحيح.'
    if (!password) nextErrors.password = 'يرجى إدخال كلمة المرور.'
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length || !isSupabaseConfigured) return
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate('/admin/dashboard', { replace: true })
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : ''
      if (message === 'profile_missing') setError('تم تسجيل الدخول، لكن لم يتم العثور على ملف المسؤول.')
      else if (message === 'not_admin') setError('هذا الحساب لا يملك صلاحية الإدارة.')
      else if (/fetch|network|failed to fetch/i.test(message)) setError('تعذر الاتصال بخدمة تسجيل الدخول. تحقق من اتصال الإنترنت وإعدادات Supabase.')
      else setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
    } finally { setSubmitting(false) }
  }

  return <main className="login-page">
    <div className="login-art"><div><span>لوحة تحكم وكالة الشيخ</span><h1>إدارة رحلات الطلاب التعليمية من مكان واحد</h1><p>تابع الطلبات، وحدّث الكليات والتخصصات، وابقَ قريبًا من كل طالب.</p></div></div>
    <div className="login-panel"><Link className="back-link" to="/">العودة إلى الموقع</Link><form className="login-form" onSubmit={submit} noValidate>
      <img src={logo} alt="شعار وكالة الشيخ" /><span className="login-kicker"><LockKeyhole /> منطقة آمنة</span><h2>تسجيل دخول الإدارة</h2><p>أدخل بيانات حساب المسؤول للمتابعة.</p>
      {!isSupabaseConfigured && <div className="setup-note">لم يتم ربط الموقع بخدمة Supabase. تأكد من وجود ملف .env.local بجانب package.json، ثم أعد تشغيل خادم التطوير.</div>}
      {error && <div className="error-msg">{error}</div>}
      <label>البريد الإلكتروني<div className="input-icon"><Mail /><input value={email} onChange={e => { setEmail(e.target.value); setFieldErrors(x => ({ ...x, email: undefined })) }} type="email" autoComplete="email" placeholder="البريد الإلكتروني" /></div><small className="field-error">{fieldErrors.email}</small></label>
      <label>كلمة المرور<div className="input-icon"><LockKeyhole /><input value={password} onChange={e => { setPassword(e.target.value); setFieldErrors(x => ({ ...x, password: undefined })) }} type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="كلمة المرور" /><button type="button" onClick={() => setShow(!show)} aria-label="إظهار أو إخفاء كلمة المرور">{show ? <EyeOff /> : <Eye />}</button></div><small className="field-error">{fieldErrors.password}</small></label>
      <button className="btn primary login-submit" disabled={submitting || !isSupabaseConfigured}>{submitting ? <><LoaderCircle className="spin" /> جارٍ التحقق...</> : 'تسجيل الدخول'}</button>
    </form></div>
  </main>
}
