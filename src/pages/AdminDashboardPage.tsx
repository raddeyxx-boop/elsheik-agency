import { useEffect, useState } from 'react'
import { Building2, Clock3, GraduationCap, Users, type LucideIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboardPage() {
  const { profile, user } = useAuth()
  const [stats, setStats] = useState({ colleges: 0, courses: 0, requests: 0, pending: 0 })
  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('colleges').select('id', { count: 'exact', head: true }),
      supabase.from('college_courses').select('id', { count: 'exact', head: true }),
      supabase.from('student_requests').select('id', { count: 'exact', head: true }),
      supabase.from('student_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]).then(([a,b,c,d]) => setStats({ colleges:a.count??0,courses:b.count??0,requests:c.count??0,pending:d.count??0 }))
  }, [])
  const cards: Array<[LucideIcon, string, number]> = [[Building2,'إجمالي الكليات',stats.colleges],[GraduationCap,'إجمالي التخصصات',stats.courses],[Users,'طلبات التسجيل',stats.requests],[Clock3,'الطلبات المعلقة',stats.pending]]
  return <section className="dash-content"><div className="dash-title"><div><span>نظرة عامة</span><h1>لوحة المتابعة</h1><p>الحساب: {profile?.full_name || 'المسؤول'} — {profile?.email || user?.email}</p></div><small>آخر تحديث: الآن</small></div><div className="stats">{cards.map(([Icon,label,value])=><article key={label}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong></div></article>)}</div><div className="dash-card"><div className="empty-dashboard"><Users /><h3>{stats.pending ? `لديك ${stats.pending} طلبات معلقة` : 'لا توجد طلبات معلقة'}</h3><p>يمكنك متابعة الطلبات وتحديث حالتها من قسم طلبات التسجيل.</p></div></div></section>
}
