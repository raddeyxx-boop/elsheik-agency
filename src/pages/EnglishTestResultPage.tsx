import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Award, CheckCircle2, Headphones, MessageCircle, PenLine, RotateCcw } from 'lucide-react'
import EnglishTestShell from '../components/EnglishTestShell'
import {
  clearStoredSession,
  EnglishTestResultRpcError,
  getEnglishTestResult,
  getStoredSessionSnapshot,
} from '../services/englishTest'
import type { EnglishTestResult, EnglishTestSession } from '../types/englishTest'
import { normalizeRecommendations, normalizeStringArray } from '../utils/englishTestResult'

const POLL_INTERVAL_MS=2000
const MAX_POLL_DURATION_MS=30000

function isAuthorizationError(error:unknown){
  if(!(error instanceof EnglishTestResultRpcError))return false
  const message=`${error.message} ${error.details??''}`.toLowerCase()
  return error.code==='42501'||message.includes('unauthorized_attempt')||message.includes('permission denied')
}

export default function EnglishTestResultPage(){
  const {attemptId}=useParams<{attemptId:string}>()
  const storedSession=useMemo(getStoredSessionSnapshot,[])
  const accessToken=storedSession?.accessToken
  const [result,setResult]=useState<EnglishTestResult|null>(null)
  const [error,setError]=useState('')
  const [reloadKey,setReloadKey]=useState(0)
  const retryTimerRef=useRef<number|null>(null)
  const effectGenerationRef=useRef(0)

  useEffect(()=>{
    const generation=++effectGenerationRef.current
    const startedAt=Date.now()
    let requestInProgress=false

    if(retryTimerRef.current!==null){
      window.clearTimeout(retryTimerRef.current)
      retryTimerRef.current=null
    }
    setResult(null)
    setError('')

    console.info('English result load',{
      hasAttemptId:Boolean(attemptId),
      hasAccessToken:Boolean(accessToken),
    })

    if(!attemptId){
      setError('تعذر تحديد محاولة الاختبار.')
      return
    }
    if(!accessToken){
      setError('تعذر استعادة بيانات محاولة الاختبار. ابدأ اختبارًا جديدًا.')
      return
    }

    const session:EnglishTestSession={
      attemptId,
      accessToken,
      startedAt:storedSession?.startedAt??'',
      expiresAt:storedSession?.expiresAt??'',
      durationSeconds:Number(storedSession?.durationSeconds??480),
    }

    const poll=async()=>{
      if(effectGenerationRef.current!==generation||requestInProgress)return
      requestInProgress=true
      try{
        const nextResult=await getEnglishTestResult(session)
        if(effectGenerationRef.current!==generation)return
        if(nextResult){
          setResult(nextResult)
          setError('')
          return
        }
        if(Date.now()-startedAt>=MAX_POLL_DURATION_MS){
          setError('استغرق تحليل النتيجة وقتًا أطول من المتوقع. حاول إعادة تحميل الصفحة.')
          return
        }
        retryTimerRef.current=window.setTimeout(()=>void poll(),POLL_INTERVAL_MS)
      }catch(loadError){
        if(effectGenerationRef.current!==generation)return
        if(isAuthorizationError(loadError)){
          setError('لا تملك صلاحية عرض هذه النتيجة.')
        }else{
          setError('تعذر تحميل نتيجة الاختبار حاليًا. حاول إعادة تحميل الصفحة.')
        }
      }finally{
        requestInProgress=false
      }
    }

    void poll()
    return()=>{
      if(retryTimerRef.current!==null){
        window.clearTimeout(retryTimerRef.current)
        retryTimerRef.current=null
      }
    }
  },[accessToken,attemptId,reloadKey,storedSession])

  const reload=()=>setReloadKey(value=>value+1)

  if(!result)return <EnglishTestShell><div className="result-processing">
    {!error&&<span className="result-spinner"/>}
    <h1>جارٍ تحليل نتيجتك</h1>
    <ul><li>مراجعة إجابات الاستماع</li><li>تحليل مهارة الكتابة</li><li>حساب المستوى التقريبي</li><li>إعداد التوصيات</li></ul>
    {error&&<><p className="test-error" role="alert">{error}</p><button className="btn primary" onClick={reload}>إعادة تحميل النتيجة</button></>}
  </div></EnglishTestShell>

  const used=Math.max(0,Math.round((new Date(result.submitted_at).getTime()-new Date(result.started_at).getTime())/60000))
  const strengths=normalizeStringArray(result.strengths)
  const improvements=normalizeStringArray(result.improvements)
  const recommendations=normalizeRecommendations(result.recommendations)
  const hasCourseRecommendation=recommendations.some(recommendation=>recommendation.type==='course')
  const whatsappText=`مرحبًا أستاذ علي، أكملت اختبار تحديد مستوى اللغة الإنجليزية، ومستواي التقديري هو ${result.estimated_level}. أرغب في معرفة تفاصيل دورة اللغة الإنجليزية.`
  const whatsappUrl=`https://wa.me/919036102240?text=${encodeURIComponent(whatsappText)}`

  return <EnglishTestShell><section className="result-page">
    <div className="result-hero"><Award/><span>نتيجة اختبار اللغة الإنجليزية</span><h1>{result.estimated_level}</h1><p>درجتك الإجمالية</p><strong>{Math.round(result.overall_score)}<small>/100</small></strong></div>
    <div className="score-grid"><article><Headphones/><span>الاستماع</span><b>{Math.round(result.listening_score)}</b></article><article><PenLine/><span>الكتابة</span><b>{Math.round(result.writing_score)}</b></article><article><CheckCircle2/><span>الوقت المستخدم</span><b>{used} دقائق</b></article></div>
    {result.is_provisional&&<p className="provisional">التقييم الكتابي احتياطي وشفاف لعدم توفر خدمة التقييم الذكي حاليًا.</p>}
    <div className="feedback-grid">
      <article><h2>نقاط القوة</h2><ul>{strengths.map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul></article>
      <article><h2>مجالات التحسين</h2><ul>{improvements.map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul></article>
      <article><h2>خطواتك القادمة</h2>{recommendations.length?recommendations.map((recommendation,index)=><article key={`${recommendation.type}-${index}`} className="result-recommendation-card"><h3>{recommendation.title}</h3>{recommendation.message&&<p>{recommendation.message}</p>}</article>):<p>لا توجد توصيات إضافية حاليًا.</p>}</article>
    </div>
    <p className="disclaimer">هذا التقييم تقديري ومبني على اختبار قصير، ولا يمثل شهادة رسمية أو نتيجة IELTS معتمدة.</p>
    <div className="result-actions">{hasCourseRecommendation&&<><Link className="btn primary" to="/?englishCourse=1#contact">سجّل في دورة اللغة الإنجليزية</Link><a className="btn whatsapp-action" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle/> تواصل معنا عبر واتساب</a></>}<Link className="btn secondary" to="/english-test" onClick={clearStoredSession}><RotateCcw/> إعادة الاختبار</Link></div>
  </section></EnglishTestShell>
}
