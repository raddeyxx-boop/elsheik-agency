import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { hasSupabaseKey, hasSupabaseUrl, isSupabaseConfigured, supabase, supabaseUrl } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

type Check = { label:string; ok:boolean; detail?:string }
export default function AdminConnectionPage(){
 const { user,profile,refreshProfile}=useAuth()
 const [checks,setChecks]=useState<Check[]>([]),[time,setTime]=useState<Date|null>(null),[running,setRunning]=useState(false)
 const run=async()=>{setRunning(true);const result:Check[]=[{label:'وجود رابط المشروع',ok:hasSupabaseUrl,detail:supabaseUrl?new URL(supabaseUrl).hostname:'غير موجود'},{label:'وجود المفتاح العام',ok:hasSupabaseKey,detail:hasSupabaseKey?'موجود':'غير موجود'},{label:'إنشاء عميل Supabase',ok:isSupabaseConfigured}];if(supabase){const{error:authError}=await supabase.auth.getSession();result.push({label:'الاتصال بخدمة المصادقة',ok:!authError});const p=await refreshProfile();result.push({label:'قراءة ملف المسؤول',ok:Boolean(p?.role==='admin'),detail:p?.email||user?.email});const{error}=await supabase.from('colleges').select('id').limit(1);result.push({label:'قراءة جدول الكليات',ok:!error})}else{result.push({label:'الاتصال بخدمة المصادقة',ok:false},{label:'قراءة ملف المسؤول',ok:false},{label:'قراءة جدول الكليات',ok:false})}setChecks(result);setTime(new Date());setRunning(false)}
 return <section className="dash-content"><div className="dash-title"><div><span>الإعدادات التقنية</span><h1>فحص اتصال Supabase</h1><p>المسؤول الحالي: {profile?.full_name||'—'}</p></div><button className="btn primary" onClick={()=>void run()} disabled={running}><RefreshCw className={running?'spin':''}/> إعادة فحص الاتصال</button></div>{!checks.length?<div className="admin-empty">اضغط زر إعادة الفحص لبدء اختبار الاتصال.</div>:<div className="connection-grid">{checks.map(c=><article key={c.label}><div><strong>{c.label}</strong>{c.detail&&<small>{c.detail}</small>}</div><span className={`check-badge ${c.ok?'ok':'fail'}`}>{c.ok?'ناجح':'غير ناجح'}</span></article>)}</div>}{time&&<p className="last-check">آخر وقت للفحص: {time.toLocaleString('ar')}</p>}</section>
}
