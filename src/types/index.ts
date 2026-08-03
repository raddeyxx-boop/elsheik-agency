export type Course = {
  id?: string
  college_id?: string
  name: string
  name_en?: string | null
  description?: string
  description_en?: string | null
  duration?: string
  duration_en?: string | null
  degree_type?: string
  degree_type_en?: string | null
}

export type College = {
  id: string
  name: string
  name_en?: string | null
  short_description: string
  short_description_en?: string | null
  description: string
  description_en?: string | null
  location?: string
  location_en?: string | null
  website_url?: string
  image_url?: string
  is_active: boolean
  display_order: number
  college_courses: Course[]
}

export type StudentRequest = {
  id?: string
  student_name: string
  college_name: string
  course_name: string
  phone_number: string
  email?: string
  country?: string
  city?: string
  education_level?: string
  message?: string
  status?: string
  admin_notes?: string
  created_at?: string
  source?: 'public_form' | 'english_test' | 'study_destination'
  assessment_attempt_id?: string
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
}
