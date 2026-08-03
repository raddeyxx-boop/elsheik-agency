import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { auditMixedScript } from '../utils/mixedScriptAudit'
import { resources } from '../i18n/resources'

export type Language = 'ar' | 'en'

const phrases: Record<string, string> = {
  'الرئيسية':'Home','من أنا':'About Me','خدماتنا':'Our Services','الوجهات الدراسية':'Study Destinations','الكليات':'Colleges','خطوات التسجيل':'Registration Steps','اختبار اللغة':'English Test','تواصل معنا':'Contact Us','دخول الإدارة':'Admin Login',
  'وكالة الشيخ':'ElSheik Agency','للخدمات التعليمية':'Educational Services','وكالة الشيخ التعليمية':'ElSheik Education Agency','لوحة الإدارة':'Admin Dashboard','نظرة عامة':'Overview','إدارة الكليات':'College Management','طلبات التسجيل':'Registration Requests','الطلبات المعلقة':'Pending Requests','فحص اتصال Supabase':'Supabase Connection Check','تسجيل الخروج':'Log Out',
  'مرحبًا':'Welcome','بالمسؤول':'Administrator','جارٍ التحقق من صلاحية الدخول...':'Verifying access…','العودة إلى الرئيسية':'Back to Home','فتح القائمة':'Open menu','إغلاق':'Close','إلغاء':'Cancel','حفظ':'Save','حذف':'Delete','تعديل':'Edit','إضافة':'Add','التالي':'Next','السابق':'Previous','إعادة المحاولة':'Try Again','تحميل...':'Loading…','جارٍ التحميل...':'Loading…','لا توجد بيانات':'No data available',
  'مستقبلك يبدأ بخطوة واثقة':'Your future begins with a confident step','ابدأ رحلتك الجامعية':'Start your university journey','بثقة مع وكالة الشيخ':'with confidence with ElSheik Agency','ابدأ التسجيل الآن':'Start Your Application','استكشف الكليات':'Explore Colleges','متابعة شخصية':'Personal Guidance','معلومات واضحة':'Clear Information','دعم سريع':'Fast Support','خطوة بخطوة':'Step by Step','من الاختيار حتى القبول':'From selection to admission',
  'قصتي مع التعليم':'My Journey in Education','من أنا؟':'About Me','أنا علي الشيخ، رفيقك في الرحلة الجامعية.':'I’m Ali ElSheik, your guide throughout your university journey.','خبرة من قلب بنغالور':'Experience from the heart of Bangalore','خبرة بالدراسة في الهند':'First-hand study experience in India','متابعة شخصية للطالب':'Personal student support','مساعدة في اختيار التخصص':'Help choosing a major','دعم خلال إجراءات التسجيل':'Support throughout registration',
  'كيف نساعدك؟':'How Can We Help?','خدمات مصممة لرحلتك التعليمية':'Services Designed for Your Education Journey','الاستشارات التعليمية':'Education Consulting','اختيار الجامعة والتخصص':'University and Major Selection','التقديم والقبول الجامعي':'University Applications and Admission','التسجيل في الكليات':'College Registration','متابعة الطالب':'Student Support','الدراسة في بنغالور':'Study in Bangalore',
  'اعرف مستواك في اللغة الإنجليزية':'Discover Your English Level','ابدأ الاختبار':'Start the Test','الاختبار مجاني والنتيجة تقديرية.':'The test is free and the result is an estimate.','الاستماع':'Listening','الكتابة':'Writing','8 دقائق فقط':'Only 8 minutes','اختبار تحديد مستوى اللغة الإنجليزية':'English Placement Test','استعد قبل البدء':'Get Ready Before You Begin','ابدأ الاختبار الآن':'Start the Test Now','هل أنت مستعد؟':'Are You Ready?','العودة':'Go Back',
  'قسم الكتابة':'Writing Section','قسم الاستماع':'Listening Section','مهمة الكتابة':'Writing Task','الوقت المتبقي':'Time Remaining','المقطع الصوتي':'Audio Clip','تشغيل المقطع':'Play Audio','المقطع قيد التشغيل':'Audio Playing','جاري التحقق...':'Checking…','مرات الاستماع المتبقية:':'Plays Remaining:','تمت الإجابة عن':'Answered','السؤال':'Question','من':'of','إرسال الاختبار':'Submit Test','جارٍ الإرسال...':'Submitting…','الإجابة القصيرة':'Short Answer','عدد الكلمات:':'Word Count:','إجابة مهمة الكتابة':'Writing Task Answer',
  'جارٍ تحليل نتيجتك':'Analyzing Your Result','نتيجة اختبار اللغة الإنجليزية':'English Test Result','درجتك الإجمالية':'Your Overall Score','الوقت المستخدم':'Time Used','دقائق':'minutes','نقاط القوة':'Strengths','مجالات التحسين':'Areas for Improvement','خطواتك القادمة':'Your Next Steps','إعادة الاختبار':'Retake Test','إعادة تحميل النتيجة':'Reload Result','تواصل معنا عبر واتساب':'Contact Us on WhatsApp','سجّل في دورة اللغة الإنجليزية':'Register for the English Course',
  'الكليات والجامعات':'Colleges and Universities','مسار واضح':'A Clear Path','ست خطوات تفصل بينك وبين البداية':'Six Steps to Get Started','أرسل بياناتك':'Submit Your Details','اختر الكلية والتخصص':'Choose a College and Major','راجع الخيارات':'Review Your Options','جهّز المستندات':'Prepare Your Documents','قدّم طلب القبول':'Submit Your Application','تابع حالة طلبك':'Track Your Application','ابدأ طلب التسجيل':'Start Your Application','استشارة شخصية':'Personal Consultation','تواصل سريع':'Fast Communication',
  'الاسم':'Name','رقم الهاتف':'Phone Number','البريد الإلكتروني':'Email Address','الدولة':'Country','اختر الدولة':'Select a Country','الكلية':'College','التخصص':'Major','الرسالة':'Message','إرسال الطلب':'Submit Request','جارٍ إرسال الطلب...':'Submitting Request…','تم إرسال طلبك بنجاح':'Your request was submitted successfully','تحدث معنا':'Chat with Us','تحدث معنا عبر واتساب':'Chat with Us on WhatsApp','تحدث مع علي الآن':'Chat with Ali Now',
  'تفاصيل الوجهة':'Destination Details','لماذا الدراسة هنا؟':'Why Study Here?','اطلب استشارة':'Request a Consultation','عرض التفاصيل':'View Details','اطلب التسجيل':'Apply Now','التخصصات المتاحة':'Available Programs','تواصل عبر واتساب':'Contact on WhatsApp','الموقع يحدد عند الاستشارة':'Location confirmed during consultation',
  'البريد الإلكتروني للمسؤول':'Admin Email','كلمة المرور':'Password','تسجيل الدخول':'Log In','جارٍ تسجيل الدخول...':'Logging In…','كل الطلبات':'All Requests','الإعدادات':'Settings','حالة الطلب':'Request Status','الاسم الكامل':'Full Name','بحث':'Search','لا توجد طلبات مطابقة.':'No matching requests.','نعم، احذف':'Yes, Delete','تأكيد الحذف':'Confirm Deletion','إضافة كلية':'Add College','اسم الكلية':'College Name','الوصف':'Description','الموقع':'Location','رابط الصورة':'Image URL','الدورات':'Courses','نشط':'Active','معلق':'Pending','مقبول':'Accepted','مرفوض':'Rejected'
}

const warnedMissingKeys = new Set<string>()
const warnMissingTranslation = (key:string) => {
  if (!import.meta.env.DEV || warnedMissingKeys.has(key)) return
  warnedMissingKeys.add(key)
  console.warn(`[i18n] Missing English translation: ${key}`)
}

const translateText = (value: string) => {
  let translated = value
  Object.entries(phrases).sort((a,b)=>b[0].length-a[0].length).forEach(([ar,en]) => { translated = translated.split(ar).join(en) })
  if (translated === value && /[\u0600-\u06ff]/.test(value)) warnMissingTranslation(value.trim())
  return translated
}

const resolveKey=(language:Language,key:string) => {
  let value:unknown=resources[language]
  for(const part of key.split('.')) value=value && typeof value==='object' ? (value as Record<string,unknown>)[part] : undefined
  if(typeof value==='string') return value
  warnMissingTranslation(key)
  return key
}

const textSources = new WeakMap<Node,string>()
const attributeSources = new WeakMap<Element,Map<string,string>>()

type Preferences = { language: Language; direction:'rtl'|'ltr'; setLanguage:(v:Language)=>void; t:(ar:string,en?:string)=>string }
const Context = createContext<Preferences | null>(null)

export function PreferencesProvider({children}:{children:ReactNode}) {
  const [language,setLanguageState] = useState<Language>(() => localStorage.getItem('elsheik-language') === 'en' ? 'en' : 'ar')
  const setLanguage = useCallback((value:Language) => {
    setLanguageState(current => current === value ? current : value)
    localStorage.setItem('elsheik-language',value)
  },[])
  const t = useCallback((keyOrArabic:string,en?:string) => {
    if(!en && keyOrArabic.includes('.') && !/[\u0600-\u06ff]/.test(keyOrArabic)) return resolveKey(language,keyOrArabic)
    return language==='ar' ? keyOrArabic : (en || translateText(keyOrArabic))
  },[language])
  const direction: Preferences['direction']=language==='ar'?'rtl':'ltr'
  useLayoutEffect(() => {
    const root=document.documentElement
    root.lang=language; root.dir=direction; document.body.dir=direction
    document.getElementById('root')?.setAttribute('dir',direction)
  },[direction,language])
  useEffect(() => { document.title=language==='ar'?'وكالة الشيخ للخدمات التعليمية':'ElSheik Education Agency'; const description=document.querySelector<HTMLMetaElement>('meta[name="description"]'); if(description)description.content=language==='ar'?'وكالة الشيخ تساعد الطلاب في اختيار الجامعات والتخصصات وإجراءات القبول والتسجيل.':'ElSheik Education Agency helps students choose universities and programs and complete admission and registration.' },[language])
  useEffect(() => {
    const walk = (root:Node) => {
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT)
      let node:Node|null
      while((node=walker.nextNode())) { const parent=node.parentElement; if(!parent || ['SCRIPT','STYLE','TEXTAREA'].includes(parent.tagName)) continue; const source=textSources.get(node) ?? node.textContent ?? ''; if(!source.trim()) continue; textSources.set(node,source); const next=language==='en'?translateText(source):source; if(node.textContent!==next)node.textContent=next }
      const elements:Element[] = root instanceof Element ? [root,...root.querySelectorAll('*')] : []
      elements.forEach(element => { const sources=attributeSources.get(element) ?? new Map<string,string>(); for(const attr of ['placeholder','aria-label','title']){ const source=sources.get(attr) ?? element.getAttribute(attr); if(source){ sources.set(attr,source); const next=language==='en'?translateText(source):source; if(element.getAttribute(attr)!==next)element.setAttribute(attr,next) } } attributeSources.set(element,sources) })
    }
    walk(document.body)
    const observer=new MutationObserver(records=>{records.forEach(record=>record.addedNodes.forEach(walk)); window.clearTimeout(auditTimer); auditTimer=window.setTimeout(()=>auditMixedScript(),100)})
    let auditTimer=window.setTimeout(()=>auditMixedScript(),100)
    observer.observe(document.body,{childList:true,subtree:true})
    return ()=>{observer.disconnect();window.clearTimeout(auditTimer)}
  },[language])
  const value=useMemo(()=>({language,direction,setLanguage,t}),[direction,language,setLanguage,t])
  return <Context.Provider value={value}>{children}<span className="sr-only" aria-live="polite">{language==='ar'?'تم تغيير لغة الموقع إلى العربية':'Website language changed to English'}</span></Context.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences(){ const value=useContext(Context); if(!value) throw new Error('usePreferences must be used within PreferencesProvider'); return value }
