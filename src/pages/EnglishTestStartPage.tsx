import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock3, Headphones, PenLine, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import EnglishTestShell from '../components/EnglishTestShell'
import { startEnglishTest } from '../services/englishTest'
import { usePreferences } from '../context/PreferencesContext'

export default function EnglishTestStartPage(){
 const {language,t}=usePreferences(); const en=language==='en'; const tips=en?['Use headphones.','Choose a quiet place.','Make sure your internet connection is stable.','Prepare an English keyboard.','Set aside 8 uninterrupted minutes.']:['استخدم سماعات الرأس.','اختر مكانًا هادئًا.','تأكد من استقرار الإنترنت.','جهّز لوحة مفاتيح باللغة الإنجليزية.','خصص 8 دقائق دون مقاطعة.']
 const [ready,setReady]=useState(false),[confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');const nav=useNavigate(),starting=useRef(false)
 const start=async()=>{if(starting.current)return;starting.current=true;setBusy(true);setError('');try{await startEnglishTest();setConfirm(false);nav('/english-test/exam')}catch{setError(t('تعذر بدء الاختبار حاليًا. يرجى المحاولة مرة أخرى.','The test could not be started. Please try again.'))}finally{starting.current=false;setBusy(false)}}
 return <EnglishTestShell><motion.section className="test-start" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>
  <span className="test-kicker"><Clock3/> {t('8 دقائق فقط','Only 8 minutes')}</span><h1>{t('اختبار تحديد مستوى اللغة الإنجليزية','English Placement Test')}</h1>
  <p className="test-lead">{t('اختبار سريع يساعدك على معرفة مستواك المبدئي في الاستماع والكتابة خلال 8 دقائق.','A quick test to estimate your listening and writing level in 8 minutes.')}</p>
  <div className="skill-cards"><article><Headphones/><h2>{t('الاستماع','Listening')}</h2><p>{t('استمع إلى مقاطع قصيرة وأجب عن الأسئلة باللغة الإنجليزية.','Listen to short clips and answer the questions in English.')}</p></article><article><PenLine/><h2>{t('الكتابة','Writing')}</h2><p>{t('اكتب إجابة قصيرة باللغة الإنجليزية بناءً على الموضوع المطلوب.','Write a short response in English based on the given prompt.')}</p></article></div>
  <div className="test-info"><h2><ShieldCheck/> {t('استعد قبل البدء','Get Ready Before You Begin')}</h2>{tips.map(x=><p key={x}><CheckCircle2/>{x}</p>)}
  <p className="disclaimer">{t('يبدأ العداد بعد التأكيد ولا يمكن إيقافه. النتيجة تقديرية ولا تمثل نتيجة IELTS رسمية.','The timer starts after confirmation and cannot be paused. The result is an estimate, not an official IELTS score.')}</p></div>
  <label className="ready-check"><input type="checkbox" checked={ready} onChange={e=>setReady(e.target.checked)}/> {t('قرأت التعليمات وأنا مستعد لبدء الاختبار.','I have read the instructions and am ready to begin.')}</label>
  {error&&<p className="test-error" role="alert">{error}</p>}<button className="btn primary test-main-btn" disabled={!ready||busy} onClick={()=>setConfirm(true)}>{t('ابدأ الاختبار الآن','Start the Test Now')}</button>
 </motion.section>{confirm&&<div className="test-modal-backdrop" role="presentation"><div className="test-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">{t('هل أنت مستعد؟','Are You Ready?')}</h2><p>{t('سيبدأ عداد 8 دقائق فورًا، ولن تتمكن من إيقاف الاختبار مؤقتًا.','The 8-minute timer will start immediately and the test cannot be paused.')}</p><div><button className="btn primary" onClick={start} disabled={busy}>{busy?t('جارٍ البدء...','Starting…'):t('ابدأ الاختبار','Start the Test')}</button><button className="btn secondary" onClick={()=>setConfirm(false)} disabled={busy}>{t('العودة','Go Back')}</button></div></div></div>}</EnglishTestShell>
}
