import { Languages, Building2, Clock3, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/agency-logo.png'
import { useAuth } from '../context/AuthContext'
import { usePendingRequests } from '../hooks/usePendingRequests'

export default function AdminLayout() {
  const [drawer, setDrawer] = useState(false)
  const { profile, user, signOut } = useAuth()
  const { pendingCount, refreshPendingCount } = usePendingRequests()
  const navigate = useNavigate()
  const links = [
    [Languages, 'اختبار اللغة الإنجليزية', '/admin/english-test'],
    [LayoutDashboard, 'نظرة عامة', '/admin/dashboard'],
    [Building2, 'إدارة الكليات', '/admin/colleges'],
    [Users, 'طلبات التسجيل', '/admin/requests'],
    [Clock3, 'الطلبات المعلقة', '/admin/requests/pending'],
    [Settings, 'فحص اتصال Supabase', '/admin/settings/connection'],
  ] as const
  const logout = async () => { await signOut(); navigate('/admin/login', { replace: true }) }
  return <div className="dashboard">
    <aside className={drawer ? 'open' : ''}><button className="drawer-close" onClick={() => setDrawer(false)}><X /></button><div className="dash-brand"><img src={logo} alt="شعار وكالة الشيخ" /><span>لوحة الإدارة</span></div><nav>{links.map(([Icon,label,to]) => <NavLink onClick={() => setDrawer(false)} to={to} key={to} className={({isActive})=>isActive?'active':''}><Icon />{label}{to.endsWith('/pending')&&<b>{pendingCount}</b>}</NavLink>)}</nav><button className="logout" onClick={logout}><LogOut /> تسجيل الخروج</button></aside>
    <main className="dash-main"><header><button className="dash-menu" onClick={() => setDrawer(true)}><Menu /></button><div><span>مرحبًا {profile?.full_name || 'بالمسؤول'} 👋</span><small>{profile?.email || user?.email}</small></div></header><Outlet context={{ refreshPendingCount }} /></main>
  </div>
}

export type AdminOutletContext = { refreshPendingCount: () => Promise<void> }
