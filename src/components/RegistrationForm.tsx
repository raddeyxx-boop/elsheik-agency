import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { LoaderCircle, Send } from 'lucide-react'
import { submitStudentRequest } from '../services/data'
import type { StudentRequest } from '../types'
import { usePreferences } from '../context/PreferencesContext'
import { resources } from '../i18n/resources'

const makeSchema = (v: {name:string;college:string;course:string;phone:string;email:string}) => z.object({
  student_name: z.string().min(3, v.name), college_name: z.string().min(2, v.college),
  course_name: z.string().min(2, v.course), phone_number: z.string().min(8, v.phone),
  email: z.string().email(v.email).or(z.literal('')),
  country: z.string(), city: z.string(), education_level: z.string(), message: z.string(),
})
type FormData = z.infer<ReturnType<typeof makeSchema>>

export default function RegistrationForm({ selectedCollege = '', selectedCourse = '', selectedCountry = '', source = 'public_form', assessmentAttemptId }: { selectedCollege?: string; selectedCourse?: string; selectedCountry?: string; source?: StudentRequest['source']; assessmentAttemptId?: string }) {
  const { language } = usePreferences(); const copy=resources[language].form
  const { register, handleSubmit, reset, setValue, getFieldState, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormData>({
    resolver: zodResolver(makeSchema(copy.validation)),
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
    {isSubmitSuccessful && <div className="success-msg">{copy.success}</div>}
    <div className="form-grid">
      <label>{copy.labels[0]}<input {...register('student_name')} placeholder={copy.placeholders[0]} /><small>{errors.student_name?.message}</small></label>
      <label>{copy.labels[1]}<input {...register('college_name')} placeholder={copy.placeholders[1]} /><small>{errors.college_name?.message}</small></label>
      <label>{copy.labels[2]}<input {...register('course_name')} placeholder={copy.placeholders[2]} /><small>{errors.course_name?.message}</small></label>
      <label>{copy.labels[3]}<input className="force-ltr" {...register('phone_number')} inputMode="tel" placeholder={copy.placeholders[3]} /><small>{errors.phone_number?.message}</small></label>
      <label>{copy.labels[4]} <em>{copy.optional}</em><input className="force-ltr" {...register('email')} inputMode="email" placeholder={copy.placeholders[4]} /><small>{errors.email?.message}</small></label>
      <label>{copy.labels[5]}<input {...register('country')} placeholder={copy.placeholders[5]} /></label>
      <label>{copy.labels[6]}<input {...register('city')} placeholder={copy.placeholders[6]} /></label>
      <label>{copy.labels[7]}<input {...register('education_level')} placeholder={copy.placeholders[7]} /></label>
      <label className="full">{copy.labels[8]}<textarea {...register('message')} rows={4} placeholder={copy.placeholders[8]} /></label>
    </div>
    <button className="btn primary submit-btn" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin" /> {copy.submitting}</> : <><Send size={19} /> {copy.submit}</>}</button>
  </form>
}
