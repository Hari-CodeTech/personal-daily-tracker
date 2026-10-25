import { generateScheduleForDate } from '../src/lib/scheduler.ts'
import { calculateDailyScore } from '../src/lib/scoring.ts'

const defaultSettings = {
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

const habits = [
  { id: 'h-1', title: 'No pornography', category: 'discipline', tracking_type: 'avoidance', is_required: true, is_sensitive: true },
  { id: 'h-2', title: 'No masturbation', category: 'discipline', tracking_type: 'avoidance', is_required: true, is_sensitive: true },
  { id: 'h-3', title: 'No sugar', category: 'discipline', tracking_type: 'avoidance', is_required: true, is_sensitive: false },
  { id: 'h-4', title: 'No mobile scrolling before sleeping', category: 'discipline', tracking_type: 'avoidance', is_required: true, is_sensitive: false },
  { id: 'h-5', title: 'Instagram Usage', category: 'social_media', tracking_type: 'duration', target_value: 60, target_unit: 'minutes', is_required: true, is_sensitive: false },
  { id: 'h-6', title: 'YouTube Usage', category: 'social_media', tracking_type: 'duration', target_value: 60, target_unit: 'minutes', is_required: true, is_sensitive: false },
  { id: 'h-7', title: 'Daily Skipping', category: 'fitness', tracking_type: 'numeric', target_value: 1000, target_unit: 'skips', is_required: true, is_sensitive: false },
  { id: 'h-8', title: 'Sleep Duration (>= 7 hrs)', category: 'health', tracking_type: 'duration', target_value: 420, target_unit: 'minutes', is_required: true, is_sensitive: false },
  { id: 'h-9', title: 'Water Intake (>= 2.5 L)', category: 'health', tracking_type: 'numeric', target_value: 2.5, target_unit: 'liters', is_required: true, is_sensitive: false }
]

console.log('=== TEST 1: INITIAL STATE (Zero usage, 85 skips, no unconfirmed false completions) ===')
{
  const habitLogs = [
    { id: 'hl-5', habit_id: 'h-5', date: '2026-10-25', numeric_value: 0, is_completed: false }
  ]
  const healthLog = {
    id: 'hl-1',
    user_id: 'u-1',
    date: '2026-10-25',
    skipping_count: 85,
    water_liters: 0,
    sleep_hours: 0,
    workout_details: []
  }

  const schedule = generateScheduleForDate({
    dateStr: '2026-10-25',
    settings: defaultSettings,
    habits,
    habitLogs,
    studySessions: [],
    problemRecords: [],
    jobApplications: [],
    healthLog
  })

  const score = calculateDailyScore(schedule)
  const igActivity = schedule.find(a => a.name.includes('Instagram'))
  const skipActivity = schedule.find(a => a.name.includes('Skipping'))
  const dsaActivity = schedule.find(a => a.name.includes('Problem Solving'))

  console.log('Daily score:', score.overallScore + '%', `(${score.completedRequiredActivities} of ${score.totalRequiredActivities} required tasks)`)
  console.log('Instagram activity status:', igActivity?.status, '| details:', igActivity?.details)
  console.log('Skipping activity status:', skipActivity?.status, '| details:', skipActivity?.details)
  console.log('DSA activity status:', dsaActivity?.status, '| details:', dsaActivity?.details)

  if (igActivity?.status === 'not_started') {
    console.log('✓ PASS: Instagram 0m is NOT falsely marked Completed.')
  } else {
    console.error('✗ FAIL: Instagram was incorrectly marked:', igActivity?.status)
  }

  if (skipActivity?.status === 'in_progress') {
    console.log('✓ PASS: Daily Skipping with 85/1000 skips is correctly marked in_progress.')
  } else {
    console.error('✗ FAIL: Skipping was not marked in_progress:', skipActivity?.status)
  }
}

console.log('\n=== TEST 2: USER LOGS 1 STUDY SESSION, 3 PROBLEMS, 1 JOB APP, 85 SKIPS ===')
{
  const habitLogs = [
    { id: 'hl-5', habit_id: 'h-5', date: '2026-10-25', numeric_value: 15, is_completed: false }
  ]
  const studySessions = [
    { id: 's-1', user_id: 'u-1', date: '2026-10-25', subject: 'java', topic: 'Collections Framework', duration_minutes: 120, is_completed: true }
  ]
  const problemRecords = [
    { id: 'p-1', user_id: 'u-1', date: '2026-10-25', problem_name: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', time_spent_minutes: 20, result: 'solved_independently', needs_revision: false },
    { id: 'p-2', user_id: 'u-1', date: '2026-10-25', problem_name: '3Sum', topic: 'Arrays', difficulty: 'Medium', time_spent_minutes: 40, result: 'solved_independently', needs_revision: false },
    { id: 'p-3', user_id: 'u-1', date: '2026-10-25', problem_name: 'Subarray Sum Equals K', topic: 'HashMaps', difficulty: 'Medium', time_spent_minutes: 35, result: 'solved_with_help', needs_revision: true }
  ]
  const jobApplications = [
    { id: 'j-1', user_id: 'u-1', company_name: 'Google', job_title: 'Software Engineer', application_date: '2026-10-25', status: 'Applied', work_mode: 'Remote', job_source: 'LinkedIn' }
  ]
  const healthLog = {
    id: 'hl-1',
    user_id: 'u-1',
    date: '2026-10-25',
    skipping_count: 85,
    water_liters: 1.0,
    sleep_hours: 7.5,
    workout_details: []
  }

  const schedule = generateScheduleForDate({
    dateStr: '2026-10-25',
    settings: defaultSettings,
    habits,
    habitLogs,
    studySessions,
    problemRecords,
    jobApplications,
    healthLog
  })

  const score = calculateDailyScore(schedule)

  const javaAct = schedule.find(a => a.subject === 'java')
  const dsaAct = schedule.find(a => a.subject === 'problem_solving')
  const jobAct = schedule.find(a => a.category === 'job')
  const skipAct = schedule.find(a => a.name.includes('Skipping'))

  console.log('Java status:', javaAct?.status, '| time:', javaAct?.time_spent_minutes)
  console.log('DSA status:', dsaAct?.status, '| details:', dsaAct?.details)
  console.log('Jobs status:', jobAct?.status, '| details:', jobAct?.details)
  console.log('Skipping status:', skipAct?.status, '| details:', skipAct?.details)
  console.log('Score:', score.overallScore + '%', `(${score.completedRequiredActivities}/${score.totalRequiredActivities} required completed)`)

  if (javaAct?.status === 'completed') console.log('✓ PASS: Java study 120m completed.')
  if (dsaAct?.status === 'completed') console.log('✓ PASS: DSA 3 problems completed (met 3 problem target).')
  if (jobAct?.status === 'in_progress') console.log('✓ PASS: Job applications 1/10 marked in_progress.')
  if (skipAct?.status === 'in_progress') console.log('✓ PASS: 85 skips marked in_progress.')
}
