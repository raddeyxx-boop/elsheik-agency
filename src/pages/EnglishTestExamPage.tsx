import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock3, Headphones, LoaderCircle, Save, Send } from 'lucide-react'
import EnglishTestShell from '../components/EnglishTestShell'
import {
  buildPublicAudioUrl,
  getEnglishTestQuestions,
  getLocalAnswers,
  getSavedEnglishTestAnswers,
  getStoredSession,
  recordEnglishAudioPlay,
  saveEnglishTestAnswer,
  submitEnglishTest,
} from '../services/englishTest'
import type { EnglishTestAnswers, EnglishTestQuestion } from '../types/englishTest'
import { normalizeOptions } from '../utils/englishTestOptions'

const AUDIO_LOADING_ERROR='تعذر تحميل المقطع الصوتي. يرجى المحاولة مرة أخرى.'
const AUDIO_ERROR='تعذر تشغيل المقطع الصوتي. تحقق من اتصال الإنترنت ثم حاول مرة أخرى.'
const AUDIO_LIMIT_ERROR='لقد استخدمت جميع مرات الاستماع المتاحة.'

export default function EnglishTestExamPage(){
  const navigate=useNavigate()
  const session=useMemo(getStoredSession,[])
  const [questions,setQuestions]=useState<EnglishTestQuestion[]>([])
  const [currentIndex,setCurrentIndex]=useState(0)
  const [answers,setAnswers]=useState<EnglishTestAnswers>(getLocalAnswers)
  const [seconds,setSeconds]=useState(()=>session?Math.max(0,Math.ceil((new Date(session.expiresAt).getTime()-Date.now())/1000)):0)
  const [saveStatus,setSaveStatus]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(true)
  const [remainingPlays,setRemainingPlays]=useState<Record<string,number>>({})
  const [checkingQuestionId,setCheckingQuestionId]=useState<string|null>(null)
  const [playingQuestionId,setPlayingQuestionId]=useState<string|null>(null)
  const [submitting,setSubmitting]=useState(false)

  const audioRef=useRef<HTMLAudioElement|null>(null)
  const audioRequestIdRef=useRef(0)
  const playRequestRef=useRef(false)
  const submitRequestRef=useRef(false)
  const questionsRequestRef=useRef(false)
  const mountedRef=useRef(true)
  const saveTimersRef=useRef<Record<string,number>>({})
  const saveSequenceRef=useRef<Record<string,number>>({})
  const lastQueuedAnswerRef=useRef<Record<string,string>>({})

  const submit=useCallback(async()=>{
    if(submitRequestRef.current||!session)return
    submitRequestRef.current=true
    setSubmitting(true)
    setError('')
    let navigated=false
    try{
      await submitEnglishTest(session)
      navigated=true
      navigate(`/english-test/result/${session.attemptId}`,{replace:true})
    }catch{
      submitRequestRef.current=false
      if(mountedRef.current)setError('تعذر إرسال الاختبار. تم الاحتفاظ بإجاباتك ويمكنك المحاولة مرة أخرى.')
    }finally{
      if(!navigated&&mountedRef.current)setSubmitting(false)
    }
  },[navigate,session])

  useEffect(()=>{
    mountedRef.current=true
    const audio=audioRef.current
    const saveTimers=saveTimersRef.current
    return ()=>{
      mountedRef.current=false
      audioRequestIdRef.current+=1
      audio?.pause()
      Object.values(saveTimers).forEach(window.clearTimeout)
    }
  },[])

  useEffect(()=>{
    if(!session){
      navigate('/english-test',{replace:true})
      return
    }
    if(questionsRequestRef.current)return
    questionsRequestRef.current=true
    void (async()=>{
      try{
        const [loadedQuestions,savedAnswers]=await Promise.all([
          getEnglishTestQuestions(session),
          getSavedEnglishTestAnswers(session).catch(()=>getLocalAnswers()),
        ])
        if(!loadedQuestions.length)throw new Error('EMPTY_ENGLISH_TEST')
        if(!mountedRef.current)return
        setQuestions(loadedQuestions)
        setAnswers(previous=>({...previous,...savedAnswers}))
        setRemainingPlays(Object.fromEntries(loadedQuestions.map(question=>[
          question.id,
          question.maximum_audio_plays,
        ])))
      }catch{
        if(mountedRef.current)setError('تعذر تحميل أسئلة الاختبار حاليًا. يرجى المحاولة مرة أخرى.')
      }finally{
        if(mountedRef.current)setLoading(false)
      }
    })()
  },[navigate,session])

  useEffect(()=>{
    if(!session)return
    const tick=()=>{
      const remaining=Math.max(0,new Date(session.expiresAt).getTime()-Date.now())
      const nextSeconds=Math.ceil(remaining/1000)
      setSeconds(nextSeconds)
      if(remaining===0)void submit()
    }
    tick()
    const intervalId=window.setInterval(tick,1000)
    return()=>window.clearInterval(intervalId)
  },[session,submit])

  useEffect(()=>{
    const warn=(event:BeforeUnloadEvent)=>event.preventDefault()
    window.addEventListener('beforeunload',warn)
    return()=>window.removeEventListener('beforeunload',warn)
  },[])

  const runSave=useCallback(async(questionId:string,value:string,sequence:number)=>{
    if(!session)return
    try{
      await saveEnglishTestAnswer(session,questionId,value)
      if(mountedRef.current&&saveSequenceRef.current[questionId]===sequence){
        setSaveStatus('تم حفظ الإجابة')
      }
    }catch{
      delete lastQueuedAnswerRef.current[questionId]
      if(mountedRef.current&&saveSequenceRef.current[questionId]===sequence){
        setSaveStatus('تعذر حفظ الإجابة.')
      }
    }
  },[session])

  const updateAnswer=useCallback((question:EnglishTestQuestion,value:string,debounced:boolean)=>{
    if(seconds<=0||submitting)return
    setAnswers(previous=>({...previous,[question.id]:value}))
    if(lastQueuedAnswerRef.current[question.id]===value)return
    lastQueuedAnswerRef.current[question.id]=value
    const sequence=(saveSequenceRef.current[question.id]??0)+1
    saveSequenceRef.current[question.id]=sequence
    setSaveStatus('جارٍ حفظ الإجابة...')
    const existingTimer=saveTimersRef.current[question.id]
    if(existingTimer)window.clearTimeout(existingTimer)
    if(debounced){
      saveTimersRef.current[question.id]=window.setTimeout(()=>{
        delete saveTimersRef.current[question.id]
        void runSave(question.id,value,sequence)
      },1300)
    }else{
      void runSave(question.id,value,sequence)
    }
  },[runSave,seconds,submitting])

  const waitForAudioReady=useCallback(async(audio:HTMLAudioElement,requestId:number)=>{
    if(audio.readyState>=HTMLMediaElement.HAVE_FUTURE_DATA)return
    await new Promise<void>((resolve,reject)=>{
      let settled=false
      const cleanup=()=>{
        window.clearTimeout(timeoutId)
        audio.removeEventListener('canplay',handleReady)
        audio.removeEventListener('loadedmetadata',handleMetadata)
        audio.removeEventListener('loadeddata',handleReady)
        audio.removeEventListener('error',handleError)
        audio.removeEventListener('abort',handleAbort)
      }
      const finish=(failure?:Error)=>{
        if(settled)return
        settled=true
        cleanup()
        if(failure)reject(failure)
        else resolve()
      }
      const superseded=()=>audioRequestIdRef.current!==requestId
      const handleReady=()=>superseded()?finish(new Error('AUDIO_REQUEST_SUPERSEDED')):finish()
      const handleMetadata=()=>{
        if(audio.readyState>=HTMLMediaElement.HAVE_FUTURE_DATA)handleReady()
      }
      const handleError=()=>finish(new Error(audio.error?.message||`AUDIO_MEDIA_ERROR_${audio.error?.code??'UNKNOWN'}`))
      const handleAbort=()=>finish(new Error(superseded()?'AUDIO_REQUEST_SUPERSEDED':'AUDIO_LOADING_ABORTED'))
      const timeoutId=window.setTimeout(()=>{
        if(audio.readyState>=HTMLMediaElement.HAVE_FUTURE_DATA)finish()
        else finish(new Error('AUDIO_MEDIA_LOADING_TIMEOUT'))
      },15000)
      audio.addEventListener('canplay',handleReady,{once:true})
      audio.addEventListener('loadedmetadata',handleMetadata)
      audio.addEventListener('loadeddata',handleReady,{once:true})
      audio.addEventListener('error',handleError,{once:true})
      audio.addEventListener('abort',handleAbort,{once:true})
    })
  },[])

  const playAudio=useCallback(async(question:EnglishTestQuestion)=>{
    if(playRequestRef.current)return
    if(!session?.attemptId||!session.accessToken||!question.id){
      setError('تعذر تشغيل المقطع بسبب نقص بيانات الاختبار.')
      return
    }
    if(!question.audio_storage_path){
      setError('تعذر العثور على المقطع الصوتي.')
      return
    }
    const audio=audioRef.current
    if(!audio){
      setError('تعذر العثور على المقطع الصوتي.')
      return
    }
    playRequestRef.current=true
    setCheckingQuestionId(question.id)
    setError('')
    const requestId=++audioRequestIdRef.current
    let audioUrl=''
    let playbackStarted=false
    try{
      const result=await recordEnglishAudioPlay(session,question.id)
      if(result.allowed!==true){
        setRemainingPlays(previous=>({...previous,[question.id]:0}))
        setError(AUDIO_LIMIT_ERROR)
        return
      }
      setRemainingPlays(previous=>({...previous,[question.id]:result.remaining_plays}))
      audioUrl=buildPublicAudioUrl(question.audio_storage_path)
      if(import.meta.env.DEV){
        console.info('English test audio diagnostic',{
          path:question.audio_storage_path,
          hasPublicUrl:Boolean(audioUrl),
          readyState:audio.readyState,
        })
      }
      audio.pause()
      setPlayingQuestionId(null)
      audio.src=audioUrl
      audio.load()
      await waitForAudioReady(audio,requestId)
      if(audioRequestIdRef.current!==requestId)throw new Error('AUDIO_REQUEST_SUPERSEDED')
      playbackStarted=true
      await audio.play()
      if(mountedRef.current)setPlayingQuestionId(question.id)
    }catch(playbackError){
      const superseded=playbackError instanceof Error&&playbackError.message==='AUDIO_REQUEST_SUPERSEDED'
      const intentionalAbort=playbackError instanceof DOMException&&playbackError.name==='AbortError'&&audioRequestIdRef.current!==requestId
      if(!superseded&&!intentionalAbort&&mountedRef.current){
        console.error('Audio playback failed',{
          path:question.audio_storage_path,
          hasAudioUrl:Boolean(audioUrl),
          readyState:audio.readyState,
          networkState:audio.networkState,
          mediaErrorCode:audio.error?.code,
          mediaErrorMessage:audio.error?.message,
        })
        if(import.meta.env.DEV&&audio.error?.code===MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED){
          console.info('English test audio format diagnostic',{
            path:question.audio_storage_path,
            expectedContentTypes:['audio/mpeg','audio/mp3'],
          })
        }
        setError(playbackStarted?AUDIO_ERROR:AUDIO_LOADING_ERROR)
      }
    }finally{
      playRequestRef.current=false
      if(mountedRef.current)setCheckingQuestionId(null)
    }
  },[session,waitForAudioReady])

  const handleAudioEnded=useCallback(()=>setPlayingQuestionId(null),[])
  const question=questions[currentIndex]
  const normalizedOptions=normalizeOptions(question?.options)
  const answered=questions.filter(item=>(answers[item.id]??'').trim()).length
  const wordCount=question?.question_type==='writing_prompt'
    ?(answers[question.id]??'').trim().split(/\s+/).filter(Boolean).length
    :0
  const expired=seconds<=0
  const isChecking=checkingQuestionId===question?.id
  const isPlaying=playingQuestionId===question?.id
  const playsLeft=question?Number(remainingPlays[question.id]??question.maximum_audio_plays):0

  return <EnglishTestShell>
    <audio ref={audioRef} preload="auto" onEnded={handleAudioEnded}/>
    {loading
      ?<div className="test-loading"><LoaderCircle className="spin"/> جارٍ تحميل الاختبار...</div>
      :!question
        ?<div className="test-loading"><p className="test-error" role="alert">{error||'تعذر تحميل أسئلة الاختبار حاليًا. يرجى المحاولة مرة أخرى.'}</p></div>
        :<section className="exam-shell">
          <header className="exam-status">
            <div><span>{question.section==='writing'?'قسم الكتابة':'قسم الاستماع'}</span><b>{question.section==='writing'?'مهمة الكتابة':`السؤال ${currentIndex+1} من ${questions.length}`}</b></div>
            <div className={`timer ${seconds<=60?'urgent':''}`} aria-live={seconds===60?'assertive':'off'}><Clock3/><span>الوقت المتبقي</span><b>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</b></div>
          </header>
          <div className="exam-progress"><i style={{width:`${((currentIndex+1)/questions.length)*100}%`}}/><span>تمت الإجابة عن {answered} من {questions.length}</span></div>
          {seconds<=60&&<p className="time-warning">تبقت دقيقة واحدة فقط.</p>}
          {error&&<p className="test-error" role="alert">{error}</p>}
          <article className="question-card">
            {question.section==='listening'&&<div className="audio-panel">
              <Headphones/>
              <div><b>المقطع الصوتي</b><span>مرات الاستماع المتبقية: {playsLeft}</span></div>
              <button type="button" onClick={()=>void playAudio(question)} disabled={isChecking||playsLeft<=0||submitting||expired}>
                {isChecking?'جاري التحقق...':isPlaying?'المقطع قيد التشغيل':'تشغيل المقطع'}
              </button>
            </div>}
            <h1 lang="en" dir="ltr">{question.question_text}</h1>
            {question.question_type==='writing_prompt'
              ?<><p>اكتب إجابة باللغة الإنجليزية من 70 إلى 120 كلمة. ركّز على وضوح الأفكار، القواعد، المفردات، وترابط الجمل.</p><textarea lang="en" dir="ltr" spellCheck={false} rows={12} disabled={expired||submitting} value={answers[question.id]??''} onChange={event=>updateAnswer(question,event.target.value,true)} aria-label="إجابة مهمة الكتابة"/><div className="word-count">عدد الكلمات: {wordCount}</div>{wordCount>0&&wordCount<70&&<p className="field-warning">إجابتك قصيرة وقد تؤثر في التقييم.</p>}{wordCount>120&&<p className="field-warning">تجاوزت الطول المقترح. حاول أن تكون إجابتك أكثر اختصارًا.</p>}</>
              :question.question_type==='multiple_choice'||question.question_type==='true_false'
                ?normalizedOptions.length
                  ?<div className="answer-options" dir="ltr">{normalizedOptions.map(option=><label key={option.value} className="answer-option"><input type="radio" name={`question-${question.id}`} value={option.value} disabled={expired||submitting} checked={answers[question.id]===option.value} onChange={()=>updateAnswer(question,option.value,false)}/><span lang="en">{option.label}</span></label>)}</div>
                  :<p className="test-error">تعذر عرض خيارات هذا السؤال.</p>
                :<input className="short-answer" lang="en" dir="ltr" disabled={expired||submitting} value={answers[question.id]??''} onChange={event=>updateAnswer(question,event.target.value,true)} aria-label="الإجابة القصيرة"/>}
          </article>
          <footer className="exam-actions">
            <span><Save/> {saveStatus}</span>
            <div>
              <button className="btn secondary" disabled={currentIndex===0||submitting} onClick={()=>setCurrentIndex(value=>value-1)}>السابق</button>
              {currentIndex<questions.length-1
                ?<button className="btn primary" disabled={submitting} onClick={()=>setCurrentIndex(value=>value+1)}>{questions[currentIndex+1]?.section==='writing'?'انتقل إلى الكتابة':'التالي'}</button>
                :<button className="btn primary" disabled={submitting||expired} onClick={()=>void submit()}><Send/>{submitting?'جارٍ الإرسال...':'إرسال الاختبار'}</button>}
            </div>
          </footer>
        </section>}
  </EnglishTestShell>
}
