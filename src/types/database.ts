export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface UserProfile {
  id: string
  email?: string
  full_name: string
  avatar_url?: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  timezone: string
  theme: 'light' | 'dark' | 'system'
  java_target_minutes: number
  dsa_target_minutes: number
  dsa_target_count: number
  mysql_target_minutes: number
  interview_target_minutes: number
  tech_target_minutes: number
  alternating_start_date: string // YYYY-MM-DD
  alternating_start_subject: 'mysql' | 'interview_prep'
  job_applications_daily_target: number
  skipping_target_type: 'count' | 'minutes'
  skipping_target_value: number
  water_target_liters: number
  sleep_target_hours: number
  instagram_limit_minutes: number
  youtube_limit_minutes: number
  challenge_start_date?: string | null
  challenge_is_active: boolean
  challenge_target_days: number
  reminders_enabled: boolean
  reminder_times: {
    study: string
    jobs: string
    health: string
    reflection: string
  }
  created_at?: string
  updated_at?: string
}

export type HabitCategory = 'discipline' | 'social_media' | 'fitness' | 'health' | 'custom'
export type HabitTrackingType = 'boolean' | 'avoidance' | 'numeric' | 'duration'

export interface Habit {
  id: string
  user_id: string
  title: string
  category: HabitCategory
  tracking_type: HabitTrackingType
  target_value?: number
  target_unit?: string
  is_required: boolean
  is_sensitive: boolean
  is_archived: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface DailyHabitLog {
  id: string
  user_id: string
  habit_id: string
  date: string // YYYY-MM-DD
  is_completed: boolean
  numeric_value?: number | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export type StudySubject = 'java' | 'problem_solving' | 'mysql' | 'interview_prep' | 'technical_learning' | 'custom'

export interface StudySession {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  subject: StudySubject
  topic: string
  duration_minutes: number
  notes?: string
  is_completed: boolean
  created_at: string
  updated_at?: string
}

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard'
export type ProblemResult = 'solved_independently' | 'solved_with_help' | 'attempted' | 'needs_revision'

export interface ProblemRecord {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  problem_name: string
  topic: string
  difficulty: ProblemDifficulty
  time_spent_minutes: number
  result: ProblemResult
  needs_revision: boolean
  notes?: string
  created_at: string
}

export type RevisionStatus = 'not_started' | 'in_progress' | 'revised' | 'needs_another_revision'

export interface InterviewTopic {
  id: string
  user_id: string
  category: string
  topic_name: string
  revision_status: RevisionStatus
  last_revised_date?: string | null
  notes?: string
}

export type JobWorkMode = 'Remote' | 'Hybrid' | 'Onsite'
export type JobStatus = 'Planned' | 'Applied' | 'Assessment received' | 'Interview scheduled' | 'Rejected' | 'Selected' | 'Withdrawn'

export interface JobApplication {
  id: string
  user_id: string
  company_name: string
  job_title: string
  application_url?: string
  application_date: string // YYYY-MM-DD
  location?: string
  work_mode: JobWorkMode
  job_source: string
  status: JobStatus
  notes?: string
  created_at: string
  updated_at?: string
}

export interface WorkoutDetail {
  id: string
  exercise: string
  sets?: number
  reps?: number
  weight?: string
  duration_minutes?: number
}

export interface DailyHealthLog {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  sleep_hours?: number | null
  sleep_start_time?: string | null
  sleep_wake_time?: string | null
  water_liters: number
  skipping_count?: number
  skipping_minutes?: number
  no_sugar_maintained: boolean
  junk_food_avoided: boolean
  skincare_done: boolean
  haircare_done: boolean
  workout_details: WorkoutDetail[]
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface WaterLog {
  id: string
  user_id: string
  date: string
  amount_ml: number
  logged_at: string
}

export type ReflectionMood = 'great' | 'good' | 'neutral' | 'low' | 'tough'

export interface DailyReflection {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  went_well?: string
  learned?: string
  failed_tasks?: string
  missed_reason?: string
  distractions?: string
  improve_tomorrow?: string
  mood?: ReflectionMood
  is_completed: boolean
  created_at?: string
  updated_at?: string
}

export interface TomorrowPlan {
  id: string
  user_id: string
  date: string // YYYY-MM-DD (the date for which the plan is made)
  java_topic?: string
  dsa_topic?: string
  mysql_or_interview_topic?: string
  tech_topic?: string
  job_target: number
  priorities?: string
  additional_tasks: Array<{ id: string; title: string; completed: boolean }>
  created_at?: string
  updated_at?: string
}

export interface TempleVisit {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  is_visited: boolean
  notes?: string
  created_at?: string
}

export interface ScheduledActivity {
  id: string
  habit_id?: string
  name: string
  category: 'study' | 'habit' | 'job' | 'health' | 'spiritual'
  subject?: StudySubject
  duration_target_minutes?: number
  target_display: string
  is_required: boolean
  status: 'not_started' | 'in_progress' | 'completed' | 'missed' | 'skipped' | 'rescheduled'
  is_sensitive?: boolean
  details?: string
  time_spent_minutes?: number
  current_value?: number
  target_value?: number
}

export interface DailyScoreBreakdown {
  habitsScore: number // 0 - 100
  studyScore: number // 0 - 100
  healthScore: number // 0 - 100
  jobsScore: number // 0 - 100
  overallScore: number // 0 - 100
  totalRequiredActivities: number
  completedRequiredActivities: number
  explanation: string
}
