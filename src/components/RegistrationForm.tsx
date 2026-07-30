import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { LoaderCircle, Send } from 'lucide-react'
import { submitStudentRequest } from '../services/data'
import type { StudentRequest } from '../types'

const schema = z.object({
  student_name: z.string().min(3, 'يرجى كتابة الاسم الكامل'),
  college_name: z.string().min(2, 'يرجى اختيار أو كتابة الكلية'),
  course_name: z.string().min(2, 'يرجى كتابة التخصص'),
  phone_number: z.string().min(8, 'يرجى كتابة رقم هاتف صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').or(z.literal('')),
  country: z.string(), city: z.string(), education_level: z.string(), message: z.string(),
})
type FormData = z.infer<typeof schema>

export default function RegistrationForm({ selectedCollege = '', selectedCourse = '', selectedCountry = '', source = 'public_form', assessmentAttemptId }: { selectedCollege?: string; selectedCourse?: string; selectedCountry?: string; source?: StudentRequest['source']; assessmentAttemptId?: string }) {
  const { register, handleSubmit, reset, setValue, getFieldState, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { student_name: '', college_name: selectedCollege, course_name: selectedCourse, phone_number: '', email: '', country: selectedCountry, city: '', education_level: '', message: '' },
  })
  useEffect(() => {
    if (selectedCollege && !getFieldState('college_name').isDirty) setValue('college_name', selectedCollege)
    if (selectedCourse && !getFieldState('course_name').isDirty) setValue('course_name', selectedCourse)
  }, [getFieldState, selectedCollege, selectedCourse, setValue])
  useEffect(() => {
    if (selectedCountry && !getFieldState('country').isDirty) {
      setValue('country', selectedCountry)
    }
  }, [getFieldState, selectedCountry, setValue])
  const submit = async (data: FormData) => {
    await submitStudentRequest({ ...data, source, assessment_attempt_id: assessmentAttemptId })
    reset()
  }
  return <form className="registration-form" onSubmit={handleSubmit(submit)}>
    {isSubmitSuccessful && <div className="success-msg">تم إرسال طلبك بنجاح، وسنتواصل معك في أقرب وقت.</div>}
    <div className="form-grid">
      <label>الاسم الكامل<input {...register('student_name')} placeholder="اكتب اسمك الثلاثي" /><small>{errors.student_name?.message}</small></label>
      <label>الكلية المطلوبة<input {...register('college_name')} placeholder="مثال: كلية العلوم والتقنية" /><small>{errors.college_name?.message}</small></label>
      <label>التخصص أو الدورة<input {...register('course_name')} placeholder="التخصص الذي تفكر فيه" /><small>{errors.course_name?.message}</small></label>
      <label>رقم الهاتف<input {...register('phone_number')} inputMode="tel" placeholder="+249..." /><small>{errors.phone_number?.message}</small></label>
      <label>البريد الإلكتروني <em>اختياري</em><input {...register('email')} inputMode="email" placeholder="name@example.com" /><small>{errors.email?.message}</small></label>
      <label>الدولة<input {...register('country')} placeholder="دولة الإقامة" /></label>
      <label>المدينة<input {...register('city')} placeholder="مدينتك" /></label>
      <label>المرحلة الدراسية<input {...register('education_level')} placeholder="ثانوية، بكالوريوس..." /></label>
      <label className="full">ملاحظات إضافية<textarea {...register('message')} rows={4} placeholder="أخبرنا بما تحتاج إليه" /></label>
    </div>
    <button className="btn primary submit-btn" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin" /> جارٍ إرسال الطلب...</> : <><Send size={19} /> إرسال طلب التسجيل</>}</button>
  </form>
}
