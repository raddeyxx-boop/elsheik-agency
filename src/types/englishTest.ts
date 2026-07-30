export interface EnglishTestOption {
  label: string
  value: string
}

export type RawEnglishTestOption =
  | string
  | {
      label?: string
      value?: string
    }

export interface EnglishTestQuestion {
  id: string
  section: 'listening' | 'writing'
  question_type:
    | 'multiple_choice'
    | 'true_false'
    | 'short_answer'
    | 'writing_prompt'
  question_text: string
  options: EnglishTestOption[] | null
  audio_storage_path: string | null
  display_order: number
  maximum_audio_plays: number
  expires_at: string
  status: string
}

export interface EnglishTestSession {
  attemptId: string
  accessToken: string
  startedAt: string
  expiresAt: string
  durationSeconds: number
}

export interface AudioPlayResult {
  play_count: number
  remaining_plays: number
  allowed: boolean
}

export type EnglishTestAnswers = Record<string, string>

export interface EnglishTestRecommendation {
  type: 'course' | 'practice' | string
  title: string
  message: string
}

export interface WritingBreakdown {
  task_completion?: number
  grammar?: number
  vocabulary?: number
  coherence?: number
  clarity?: number
  word_count?: number
  method?: string
}

export interface EnglishTestResult {
  result_id: string
  attempt_id: string
  listening_score: number
  writing_score: number
  overall_score: number
  estimated_level: string
  writing_breakdown: WritingBreakdown
  strengths: string[]
  improvements: string[]
  recommendations: EnglishTestRecommendation[]
  scoring_method: string
  is_provisional: boolean
  started_at: string
  submitted_at: string
  completed_at: string
  time_used_seconds: number
}
