import { supabase } from '../lib/supabase'
import type { College, StudentRequest } from '../types'

export const sampleColleges: College[] = [
  {
    id: 'sample-1',
    name: 'كلية العلوم والتقنية',
    short_description: 'مسارات تقنية وعلمية متنوعة تناسب طموحات المستقبل.',
    description: 'نموذج تعريفي قابل للتعديل بعد ربط قاعدة البيانات. تواصل معنا للحصول على المعلومات الرسمية المحدثة.',
    location: 'بنغالور، الهند',
    image_url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    display_order: 1,
    college_courses: [{ name: 'علوم الحاسوب' }, { name: 'تقنية المعلومات' }, { name: 'الذكاء الاصطناعي' }],
  },
  {
    id: 'sample-2',
    name: 'كلية الإدارة والأعمال',
    short_description: 'برامج تساعدك على بناء مهارات الإدارة والقيادة.',
    description: 'نموذج تعريفي قابل للتعديل من لوحة الإدارة بعد إعداد Supabase.',
    location: 'بنغالور، الهند',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    display_order: 2,
    college_courses: [{ name: 'إدارة الأعمال' }, { name: 'التمويل' }, { name: 'التسويق' }],
  },
  {
    id: 'sample-3',
    name: 'كلية العلوم الصحية',
    short_description: 'خيارات أكاديمية في مجالات الرعاية والعلوم الصحية.',
    description: 'بيانات أولية للعرض، ويجري تأكيد تفاصيل القبول والبرامج خلال الاستشارة.',
    location: 'بنغالور، الهند',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    display_order: 3,
    college_courses: [{ name: 'الصحة العامة' }, { name: 'المختبرات الطبية' }, { name: 'إدارة المستشفيات' }],
  },
]

export async function getColleges(): Promise<College[]> {
  if (!supabase) return sampleColleges
  const { data, error } = await supabase
    .from('colleges')
    .select('*, college_courses(*)')
    .eq('is_active', true)
    .order('display_order')
  if (error) throw error
  return data as College[]
}

function removeUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  )
}

function normalizeRequestSource(source?: string) {
  const normalized = source?.trim()
  return normalized === 'english_test' || normalized === 'study_destination' || normalized === 'public_form'
    ? normalized
    : 'public_form'
}

export async function submitStudentRequest(request: StudentRequest) {
  const publicRequest = removeUndefined({
    student_name: request.student_name,
    college_name: request.college_name,
    course_name: request.course_name,
    phone_number: request.phone_number,
    email: request.email?.trim() || undefined,
    country: request.country?.trim() || undefined,
    city: request.city?.trim() || undefined,
    education_level: request.education_level?.trim() || undefined,
    message: request.message?.trim() || undefined,
    source: normalizeRequestSource(request.source),
    assessment_attempt_id: request.assessment_attempt_id || undefined,
  })
  if (!supabase) {
    const stored = JSON.parse(localStorage.getItem('elsheik_requests') || '[]')
    localStorage.setItem('elsheik_requests', JSON.stringify([{ ...publicRequest, id: crypto.randomUUID(), status: 'pending', created_at: new Date().toISOString() }, ...stored]))
    return
  }
  const { error } = await supabase.from('student_requests').insert(publicRequest)
  if (error) {
    console.error('student_requests insert failed', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      payload: publicRequest,
    })
    throw error
  }
}
