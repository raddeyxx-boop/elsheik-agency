import { supabase } from '../lib/supabase'
import type {
  AudioPlayResult,
  EnglishTestAnswers,
  EnglishTestQuestion,
  EnglishTestResult,
  EnglishTestSession,
  RawEnglishTestOption,
} from '../types/englishTest'
import { normalizeOptions } from '../utils/englishTestOptions'

export const ENGLISH_TEST_SESSION_KEY='elsheik_english_test_session'
const ANSWERS_KEY='elsheik_english_test_answers'

type RawQuestion=Omit<EnglishTestQuestion,'options'|'audio_storage_path'|'maximum_audio_plays'|'expires_at'|'status'>&{
  options?:RawEnglishTestOption[]|null
  audio_storage_path?:string|null
  audio_url?:string|null
  maximum_audio_plays?:number|null
  expires_at?:string|null
  status?:string|null
}

function requireClient(){
  if(!supabase)throw new Error('SUPABASE_NOT_CONFIGURED')
  return supabase
}

function requireSession(session:EnglishTestSession){
  if(!session.attemptId||!session.accessToken)throw new Error('MISSING_ENGLISH_TEST_SESSION')
}

function logRpcError(functionName:string,error:{code?:string;message:string;details?:string;hint?:string}){
  console.error('English test RPC failed',{
    functionName,
    code:error.code,
    message:error.message,
    details:error.details,
    hint:error.hint,
  })
}

export function getStoredSession():EnglishTestSession|null{
  const session=getStoredSessionSnapshot()
  return session?.attemptId&&session.accessToken&&session.startedAt&&session.expiresAt
    ?session as EnglishTestSession
    :null
}

export function getStoredSessionSnapshot():Partial<EnglishTestSession>|null{
  try{
    const raw=JSON.parse(localStorage.getItem(ENGLISH_TEST_SESSION_KEY)||'null')
    if(!raw)return null
    return {
      attemptId:raw.attemptId??raw.attempt_id,
      accessToken:raw.accessToken??raw.access_token,
      startedAt:raw.startedAt??raw.started_at,
      expiresAt:raw.expiresAt??raw.expires_at,
      durationSeconds:Number(raw.durationSeconds??raw.duration_seconds??480),
    }
  }catch{return null}
}

export function clearStoredSession(){
  localStorage.removeItem(ENGLISH_TEST_SESSION_KEY)
  localStorage.removeItem(ANSWERS_KEY)
}

export function getLocalAnswers():EnglishTestAnswers{
  try{return JSON.parse(localStorage.getItem(ANSWERS_KEY)||'{}')}
  catch{return {}}
}

function storeAnswers(answers:EnglishTestAnswers){
  localStorage.setItem(ANSWERS_KEY,JSON.stringify(answers))
}

let startRequest:Promise<EnglishTestSession>|null=null
export function startEnglishTest():Promise<EnglishTestSession>{
  if(startRequest)return startRequest
  startRequest=(async()=>{
    const {data,error}=await requireClient().rpc('start_english_test',{})
    if(error){
      logRpcError('start_english_test',error)
      throw new Error('START_ENGLISH_TEST_FAILED')
    }
    const result=Array.isArray(data)?data[0]:data
    if(!result?.attempt_id||!result?.access_token||!result?.started_at||!result?.expires_at){
      throw new Error('INVALID_START_TEST_RESPONSE')
    }
    const session:EnglishTestSession={
      attemptId:result.attempt_id,
      accessToken:result.access_token,
      startedAt:result.started_at,
      expiresAt:result.expires_at,
      durationSeconds:Number(result.duration_seconds??480),
    }
    localStorage.setItem(ENGLISH_TEST_SESSION_KEY,JSON.stringify(session))
    storeAnswers({})
    return session
  })()
  startRequest.finally(()=>{startRequest=null}).catch(()=>{})
  return startRequest
}

export async function getEnglishTestQuestions(session:EnglishTestSession):Promise<EnglishTestQuestion[]>{
  requireSession(session)
  console.info('Loading English test questions',{
    hasAttemptId:Boolean(session.attemptId),
    hasAccessToken:Boolean(session.accessToken),
  })
  const {data,error}=await requireClient().rpc('get_english_test_questions',{
    p_attempt_id:session.attemptId,
    p_access_token:session.accessToken,
  })
  if(error){
    logRpcError('get_english_test_questions',error)
    throw new Error('GET_ENGLISH_TEST_QUESTIONS_FAILED')
  }
  return ((data??[]) as RawQuestion[]).map(question=>({
    ...question,
    options:normalizeOptions(question.options),
    audio_storage_path:question.audio_storage_path??question.audio_url??null,
    maximum_audio_plays:Number(question.maximum_audio_plays??2),
    expires_at:question.expires_at??session.expiresAt,
    status:question.status??'in_progress',
  }))
}

export async function getSavedEnglishTestAnswers(session:EnglishTestSession):Promise<EnglishTestAnswers>{
  requireSession(session)
  const {data,error}=await requireClient().rpc('get_english_test_saved_answers',{
    p_attempt_id:session.attemptId,
    p_access_token:session.accessToken,
  })
  if(error){
    logRpcError('get_english_test_saved_answers',error)
    throw new Error('GET_SAVED_ENGLISH_TEST_ANSWERS_FAILED')
  }
  const answers:EnglishTestAnswers={}
  for(const row of data??[]){
    const questionId=String(row.question_id??'')
    const value=row.answer_value?.value
    if(questionId&&typeof value==='string')answers[questionId]=value
  }
  storeAnswers({...getLocalAnswers(),...answers})
  return answers
}

export async function saveEnglishTestAnswer(
  session:EnglishTestSession,
  questionId:string,
  answerValue:string,
):Promise<void>{
  requireSession(session)
  if(!questionId)throw new Error('MISSING_ENGLISH_TEST_QUESTION')
  const {error}=await requireClient().rpc('save_english_test_answer',{
    p_attempt_id:session.attemptId,
    p_access_token:session.accessToken,
    p_question_id:questionId,
    p_answer_value:{value:answerValue},
  })
  if(error){
    logRpcError('save_english_test_answer',error)
    throw new Error('SAVE_ENGLISH_TEST_ANSWER_FAILED')
  }
  storeAnswers({...getLocalAnswers(),[questionId]:answerValue})
}

export async function recordEnglishAudioPlay(
  session:EnglishTestSession,
  questionId:string,
):Promise<AudioPlayResult>{
  requireSession(session)
  if(!questionId)throw new Error('MISSING_ENGLISH_TEST_QUESTION')
  const {data,error}=await requireClient().rpc('record_english_audio_play',{
    p_attempt_id:session.attemptId,
    p_access_token:session.accessToken,
    p_question_id:questionId,
  })
  if(error){
    logRpcError('record_english_audio_play',error)
    throw new Error('RECORD_ENGLISH_AUDIO_PLAY_FAILED')
  }
  const result=Array.isArray(data)?data[0]:data
  if(!result)throw new Error('EMPTY_AUDIO_PLAY_RESPONSE')
  return {
    play_count:Number(result.play_count??0),
    remaining_plays:Math.max(0,Number(result.remaining_plays??0)),
    allowed:result.allowed===true,
  }
}

export async function submitEnglishTest(session:EnglishTestSession){
  requireSession(session)
  const {data,error}=await requireClient().rpc('submit_english_test',{
    p_attempt_id:session.attemptId,
    p_access_token:session.accessToken,
  })
  if(error){
    logRpcError('submit_english_test',error)
    throw new Error('SUBMIT_ENGLISH_TEST_FAILED')
  }
  return Array.isArray(data)?data[0]:data
}

export class EnglishTestResultRpcError extends Error{
  constructor(
    message:string,
    readonly code?:string,
    readonly details?:string,
    readonly hint?:string,
  ){
    super(message)
    this.name='EnglishTestResultRpcError'
  }
}

const resultRequests=new Map<string,Promise<EnglishTestResult|null>>()

export function getEnglishTestResult(session:EnglishTestSession):Promise<EnglishTestResult|null>{
  requireSession(session)
  const existing=resultRequests.get(session.attemptId)
  if(existing)return existing
  const request=(async()=>{
    console.info('Calling get_english_test_result')
    const {data,error}=await requireClient().rpc('get_english_test_result',{
      p_attempt_id:session.attemptId,
      p_access_token:session.accessToken,
    })
    if(error){
      console.error('get_english_test_result failed',{
        code:error.code,
        message:error.message,
        details:error.details,
        hint:error.hint,
      })
      throw new EnglishTestResultRpcError(error.message,error.code,error.details,error.hint)
    }
    console.info('get_english_test_result response',{
      hasResult:Boolean(Array.isArray(data)?data[0]:data),
      rowCount:Array.isArray(data)?data.length:Number(Boolean(data)),
    })
    return (Array.isArray(data)?data[0]:data) as EnglishTestResult|null
  })()
  resultRequests.set(session.attemptId,request)
  request.finally(()=>resultRequests.delete(session.attemptId)).catch(()=>{})
  return request
}

export function buildPublicAudioUrl(path:string):string{
  const storagePath=path.trim().replace(/^\/+/,'')
  if(!storagePath)throw new Error('MISSING_AUDIO_STORAGE_PATH')
  const {data}=requireClient().storage.from('english-test-audio').getPublicUrl(storagePath)
  const url=data.publicUrl
  if(!url.startsWith('https://')||!url.includes('/storage/v1/object/public/english-test-audio/')){
    throw new Error('INVALID_PUBLIC_AUDIO_URL')
  }
  return url
}
