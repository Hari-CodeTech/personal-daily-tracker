import { describe, it, expect } from 'vitest'
import { generateScheduleForDate } from '@/lib/scheduler'
import { calculateDailyScore } from '@/lib/scoring'
import type { UserSettings, Habit, StudySession, ProblemRecord, JobApplication, DailyHealthLog } from '@/types/database'

const mockSettings: UserSettings = {
  id: 's-1',
  user_id: 'u-1',
  timezone: 'Asia/Kolkata',
  theme: 'light',
  java_target_minutes: 120,
  dsa_target_minutes: 120,
  dsa_target_count: 3,
  mysql_target_minutes: 120,
  interview_target_minutes: 120,
  tech_target_minutes: 60,
  alternating_start_date: '2026-10-25',
  alternating_start_subject: 'mysql',
  job_applications_daily_target: 10,
  skipping_target_type: 'count',
  skipping_target_value: 1000,
  water_target_liters: 2.5,
  sleep_target_hours: 7.0,
  instagram_limit_minutes: 60,
  youtube_limit_minutes: 60,
  challenge_is_active: false,
  challenge_target_days: 365,
  reminders_enabled: true,
  reminder_times: { study: '09:00', jobs: '14:00', health: '18:00', reflection: '21:30' }
}

const now = new Date().toISOString()
const mockHabits: Habit[] = [
  { id: 'h-1', user_id: 'u-1', title: 'No pornography', category: 'discipline', tracking_type: 'avoidance', is_required: true, is_sensitive: true, is_archived: false, display_order: 1, created_at: now, updated_at: now },
  { id: 'h-2', user_id: 'u-1', title: 'No masturbation', category: 'discipline', tracking_type: 'avoidance', is_required: true, is_sensitive: true, is_archived: false, display_order: 2, created_at: now, updated_at: now },
  { id: 'h-3', user_id: 'u-1', title: 'No sugar', category: 'discipline', tracking_type: 'avoidance', is_required: true, is_sensitive: false, is_archived: false, display_order: 3, created_at: now, updated_at: now },
  { id: 'h-4', user_id: 'u-1', title: 'No mobile scrolling before sleeping', category: 'discipline', tracking_type: 'avoidance', is_required: true, is_sensitive: false, is_archived: false, display_order: 4, created_at: now, updated_at: now },
  { id: 'h-5', user_id: 'u-1', title: 'Instagram Usage', category: 'social_media', tracking_type: 'duration', target_value: 60, target_unit: 'minutes', is_required: true, is_sensitive: false, is_archived: false, display_order: 5, created_at: now, updated_at: now },
  { id: 'h-6', user_id: 'u-1', title: 'YouTube Usage', category: 'social_media', tracking_type: 'duration', target_value: 60, target_unit: 'minutes', is_required: true, is_sensitive: false, is_archived: false, display_order: 6, created_at: now, updated_at: now },
  { id: 'h-7', user_id: 'u-1', title: 'Daily Skipping', category: 'fitness', tracking_type: 'numeric', target_value: 1000, target_unit: 'skips', is_required: true, is_sensitive: false, is_archived: false, display_order: 7, created_at: now, updated_at: now },
  { id: 'h-8', user_id: 'u-1', title: 'Sleep Duration (>= 7 hrs)', category: 'health', tracking_type: 'duration', target_value: 420, target_unit: 'minutes', is_required: true, is_sensitive: false, is_archived: false, display_order: 8, created_at: now, updated_at: now },
  { id: 'h-9', user_id: 'u-1', title: 'Water Intake (>= 2.5 L)', category: 'health', tracking_type: 'numeric', target_value: 2.5, target_unit: 'liters', is_required: true, is_sensitive: false, is_archived: false, display_order: 9, created_at: now, updated_at: now }
]

describe('Dashboard Integration & Real Calculations', () => {
  it('does not falsely mark 0-minute social media as completed', () => {
    const schedule = generateScheduleForDate({
      dateStr: '2026-10-25',
      settings: mockSettings,
      habits: mockHabits,
      habitLogs: [
        { id: 'hl-5', user_id: 'u-1', habit_id: 'h-5', date: '2026-10-25', numeric_value: 0, is_completed: false }
      ],
      studySessions: [],
      problemRecords: [],
      jobApplications: []
    })

    const ig = schedule.find(a => a.name.includes('Instagram'))
    expect(ig).toBeDefined()
    expect(ig?.status).toBe('not_started')
    expect(ig?.details).toContain('Not logged yet')

    const score = calculateDailyScore(schedule)
    expect(score.completedRequiredActivities).toBe(0)
    expect(score.overallScore).toBe(0)
  })

  it('marks 85 skips as in_progress rather than not_started', () => {
    const healthLog: DailyHealthLog = {
      id: 'hl-1',
      user_id: 'u-1',
      date: '2026-10-25',
      skipping_count: 85,
      water_liters: 0,
      no_sugar_maintained: true,
      junk_food_avoided: true,
      skincare_done: false,
      haircare_done: false,
      workout_details: []
    }

    const schedule = generateScheduleForDate({
      dateStr: '2026-10-25',
      settings: mockSettings,
      habits: mockHabits,
      habitLogs: [],
      studySessions: [],
      problemRecords: [],
      jobApplications: [],
      healthLog
    })

    const skip = schedule.find(a => a.name.includes('Skipping'))
    expect(skip).toBeDefined()
    expect(skip?.status).toBe('in_progress')
    expect(skip?.details).toContain('85 / 1000 skips')
  })

  it('correctly calculates study session, 3 problems solved, and job application submission', () => {
    const studySessions: StudySession[] = [
      { id: 's-1', user_id: 'u-1', date: '2026-10-25', subject: 'java', topic: 'Collections', duration_minutes: 120, is_completed: true, created_at: now }
    ]
    const problemRecords: ProblemRecord[] = [
      { id: 'p-1', user_id: 'u-1', date: '2026-10-25', problem_name: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', time_spent_minutes: 25, result: 'solved_independently', needs_revision: false, created_at: '' },
      { id: 'p-2', user_id: 'u-1', date: '2026-10-25', problem_name: '3Sum', topic: 'Arrays', difficulty: 'Medium', time_spent_minutes: 35, result: 'solved_independently', needs_revision: false, created_at: '' },
      { id: 'p-3', user_id: 'u-1', date: '2026-10-25', problem_name: 'LRU Cache', topic: 'Design', difficulty: 'Hard', time_spent_minutes: 40, result: 'solved_with_help', needs_revision: true, created_at: '' }
    ]
    const jobApplications: JobApplication[] = [
      { id: 'j-1', user_id: 'u-1', company_name: 'Acme Corp', job_title: 'Java Developer', application_date: '2026-10-25', status: 'Applied', work_mode: 'Remote', job_source: 'LinkedIn', created_at: '' }
    ]

    const schedule = generateScheduleForDate({
      dateStr: '2026-10-25',
      settings: mockSettings,
      habits: mockHabits,
      habitLogs: [],
      studySessions,
      problemRecords,
      jobApplications
    })

    const java = schedule.find(a => a.subject === 'java')
    expect(java?.status).toBe('completed')
    expect(java?.time_spent_minutes).toBe(120)

    const dsa = schedule.find(a => a.subject === 'problem_solving')
    expect(dsa?.status).toBe('completed') // 3 problems solved meets target
    expect(dsa?.current_value).toBe(3)
    expect(dsa?.details).toContain('3 / 3 problems solved')

    const jobs = schedule.find(a => a.category === 'job')
    expect(jobs?.status).toBe('in_progress')
    expect(jobs?.current_value).toBe(1)
    expect(jobs?.details).toContain('1 / 10 applications submitted')
  })
})
