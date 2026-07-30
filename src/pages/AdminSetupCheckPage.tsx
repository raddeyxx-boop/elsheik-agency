import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { hasSupabaseKey, hasSupabaseUrl, hasValidSupabaseUrl, isSupabaseConfigured, supabase, supabaseUrl } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

type Level = 'success' | 'warning' | 'failure'
type Result = { label: string; level: Level; detail?: string }
const labels: Record<Level,string> = { success:'نجاح', warning:'تحذير', failure:'فشل' }

export default function AdminSetupCheckPage() {
  const { user, profile, isAdmin } = useAuth()
  const [results,setResults]=useState<Result[]>([])
  const [checking,setChecking]=useState(false)
  const [checkedAt,setCheckedAt]=useState<Date|null>(null)
  const run=useCallback(async()=>{
    setChecking(true)
    const base:Result[]=[
      {label:'ملف البيئة تم تحميله',level:hasSupabaseUrl||hasSupabaseKey?'success':'failure'},
      {label:'رابط Supabase موجود',level:hasSupabaseUrl?'success':'failure'},
      {label:'رابط Supabase صالح',level:hasValidSupabaseUrl?'success':'failure',detail:hasValidSupabaseUrl?new URL(supabaseUrl).hostname:undefined},
      {label:'المفتاح العام موجود',level:hasSupabaseKey?'success':'failure'},
      {label:'تم إنشاء Supabase client',level:isSupabaseConfigured?'success':'failure'},
    ]
    if(!supabase){
      base.push({label:'يمكن الوصول إلى خدمة المصادقة',level:'failure'},{label:'جدول profiles موجود',level:'failure'},{label:'حساب المسؤول موجود',level:'warning'},{label:'دور الحساب admin',level:'warning'})
    }else{
      const { error: authError }=await supabase.auth.getSession()
      base.push({label:'يمكن الوصول إلى خدمة المصادقة',level:authError?'failure':'success'})
      const { error: tableError }=await supabase.from('profiles').select('id').limit(1)
      base.push({label:'جدول profiles موجود',level:tableError?'failure':'success'})
      base.push({label:'حساب المسؤول موجود',level:user?'success':'warning',detail:user?'تم تسجيل الدخول':'يلزم تسجيل الدخول للتحقق'})
      base.push({label:'دور الحساب admin',level:isAdmin?'success':'warning',detail:profile?.email})
    }
    setResults(base);setCheckedAt(new Date());setChecking(false)
  },[isAdmin,profile?.email,user])
  useEffect(()=>{void run()},[run])
  if(!import.meta.env.DEV&&!isAdmin)return <Navigate to="/admin/login" replace/>
  return <main className="setup-check-page" dir="rtl"><section><span>أداة تطوير آمنة</span><h1>فحص إعداد الموقع</h1><p>تعرض هذه الصفحة حالة الاتصال دون إظهار المفاتيح أو بيانات الجلسة.</p><button className="btn primary" onClick={()=>void run()} disabled={checking}><RefreshCw className={checking?'spin':''}/> إعادة الفحص</button><div className="setup-checks">{results.map(x=><article key={x.label}><div><strong>{x.label}</strong>{x.detail&&<small>{x.detail}</small>}</div><b className={`setup-${x.level}`}>{labels[x.level]}</b></article>)}</div>{checkedAt&&<small className="last-check">آخر فحص: {checkedAt.toLocaleString('ar')}</small>}</section></main>
}
