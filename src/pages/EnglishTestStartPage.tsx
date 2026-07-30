import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock3, Headphones, PenLine, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import EnglishTestShell from '../components/EnglishTestShell'
import { startEnglishTest } from '../services/englishTest'

export default function EnglishTestStartPage(){
 const [ready,setReady]=useState(false),[confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');const nav=useNavigate(),starting=useRef(false)
 const start=async()=>{if(starting.current)return;starting.current=true;setBusy(true);setError('');try{await startEnglishTest();setConfirm(false);nav('/english-test/exam')}catch{setError('تعذر بدء الاختبار حاليًا. يرجى المحاولة مرة أخرى.')}finally{starting.current=false;setBusy(false)}}
 return <EnglishTestShell><motion.section className="test-start" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>
  <span className="test-kicker"><Clock3/> 8 دقائق فقط</span><h1>اختبار تحديد مستوى اللغة الإنجليزية</h1>
  <p className="test-lead">اختبار سريع يساعدك على معرفة مستواك المبدئي في الاستماع والكتابة خلال 8 دقائق.</p>
  <div className="skill-cards"><article><Headphones/><h2>الاستماع</h2><p>استمع إلى مقاطع قصيرة وأجب عن الأسئلة باللغة الإنجليزية.</p></article><article><PenLine/><h2>الكتابة</h2><p>اكتب إجابة قصيرة باللغة الإنجليزية بناءً على الموضوع المطلوب.</p></article></div>
  <div className="test-info"><h2><ShieldCheck/> استعد قبل البدء</h2>{['استخدم سماعات الرأس.','اختر مكانًا هادئًا.','تأكد من استقرار الإنترنت.','جهّز لوحة مفاتيح باللغة الإنجليزية.','خصص 8 دقائق دون مقاطعة.'].map(x=><p key={x}><CheckCircle2/>{x}</p>)}
  <p className="disclaimer">يبدأ العداد بعد التأكيد ولا يمكن إيقافه. النتيجة تقديرية ولا تمثل نتيجة IELTS رسمية.</p></div>
  <label className="ready-check"><input type="checkbox" checked={ready} onChange={e=>setReady(e.target.checked)}/> قرأت التعليمات وأنا مستعد لبدء الاختبار.</label>
  {error&&<p className="test-error" role="alert">{error}</p>}<button className="btn primary test-main-btn" disabled={!ready||busy} onClick={()=>setConfirm(true)}>ابدأ الاختبار الآن</button>
 </motion.section>{confirm&&<div className="test-modal-backdrop" role="presentation"><div className="test-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">هل أنت مستعد؟</h2><p>سيبدأ عداد 8 دقائق فورًا، ولن تتمكن من إيقاف الاختبار مؤقتًا.</p><div><button className="btn primary" onClick={start} disabled={busy}>{busy?'جارٍ البدء...':'ابدأ الاختبار'}</button><button className="btn secondary" onClick={()=>setConfirm(false)} disabled={busy}>العودة</button></div></div></div>}</EnglishTestShell>
}
