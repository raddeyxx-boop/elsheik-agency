import { supabase } from '../lib/supabase'
import type { College, StudentRequest } from '../types'

export const sampleColleges: College[] = [
  {
    id: 'sample-1',
    name: 'كلية العلوم والتقنية',
    name_en: 'College of Engineering and Technology',
    short_description: 'مسارات تقنية وعلمية متنوعة تناسب طموحات المستقبل.',
    short_description_en: 'Modern academic programs in engineering and technology.',
    description: 'نموذج تعريفي قابل للتعديل بعد ربط قاعدة البيانات. تواصل معنا للحصول على المعلومات الرسمية المحدثة.',
    description_en: 'Explore modern engineering and technology programs. Contact us for current official admission information.',
    location: 'بنغالور، الهند',
    location_en: 'Bangalore, India',
    image_url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    display_order: 1,
    college_courses: [{ name: 'هندسة الذكاء الاصطناعي', name_en:'Artificial Intelligence Engineering' }, { name: 'هندسة علوم الحاسوب', name_en:'Computer Science Engineering' }, { name: 'تقنية المعلومات', name_en:'Information Technology' }],
  },
  {
    id: 'sample-2',
    name: 'كلية الإدارة والأعمال',
    name_en: 'College of Business and Management',
    short_description: 'برامج تساعدك على بناء مهارات الإدارة والقيادة.',
    short_description_en: 'Programs in management, commerce, and marketing.',
    description: 'نموذج تعريفي قابل للتعديل من لوحة الإدارة بعد إعداد Supabase.',
    description_en: 'Build practical skills through programs in business, commerce, management, and marketing.',
    location: 'بنغالور، الهند',
    location_en: 'Bangalore, India',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    display_order: 2,
    college_courses: [{ name: 'إدارة الأعمال', name_en:'Business Administration' }, { name: 'التجارة', name_en:'Commerce' }, { name: 'التسويق', name_en:'Marketing' }],
  },
  {
    id: 'sample-3',
    name: 'كلية العلوم الصحية',
    name_en: 'College of Health Sciences',
    short_description: 'خيارات أكاديمية في مجالات الرعاية والعلوم الصحية.',
    short_description_en: 'Academic programs in health sciences and laboratory studies.',
    description: 'بيانات أولية للعرض، ويجري تأكيد تفاصيل القبول والبرامج خلال الاستشارة.',
    description_en: 'Explore health sciences programs; admission requirements and current program details are confirmed during consultation.',
    location: 'بنغالور، الهند',
    location_en: 'Bangalore, India',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    display_order: 3,
    college_courses: [{ name: 'الصحة العامة', name_en:'Public Health' }, { name: 'علوم المختبرات الطبية', name_en:'Medical Laboratory Sciences' }, { name: 'إدارة المستشفيات', name_en:'Hospital Administration' }],
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
