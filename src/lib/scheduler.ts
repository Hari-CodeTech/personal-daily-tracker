import { differenceInCalendarDays, parseISO, format, getDay } from 'date-fns'
import type { UserSettings, ScheduledActivity, Habit, DailyHabitLog, StudySession, JobApplication, DailyHealthLog, TempleVisit, ProblemRecord } from '@/types/database'

/**
 * Calculates whether MySQL or Interview Prep is scheduled on a given date.
 * Based on an anchor date and anchor subject, alternating every single calendar day
 * continuously across weeks.
 */
export function getAlternatingStudySubject(
  targetDateStr: string,
  anchorDateStr: string,
  anchorSubject: 'mysql' | 'interview_prep' = 'mysql'
): 'mysql' | 'interview_prep' {
  const targetDate = typeof targetDateStr === 'string' ? parseISO(targetDateStr.slice(0, 10)) : targetDateStr
  const anchorDate = typeof anchorDateStr === 'string' ? parseISO(anchorDateStr.slice(0, 10)) : anchorDateStr

  const diffDays = differenceInCalendarDays(targetDate, anchorDate)
  // Support both forward and backward dates cleanly
  const isEven = Math.abs(diffDays) % 2 === 0

  if (anchorSubject === 'mysql') {
    return isEven ? 'mysql' : 'interview_prep'
  } else {
    return isEven ? 'interview_prep' : 'mysql'
  }
}

/**
 * Checks if target date is Tuesday (0=Sun, 1=Mon, 2=Tue...)
 */
export function isTuesday(dateStr: string): boolean {
  const d = parseISO(dateStr.slice(0, 10))
  return getDay(d) === 2
}

export interface DayScheduleContext {
  dateStr: string
  settings: UserSettings
  habits: Habit[]
  habitLogs: DailyHabitLog[]
  studySessions: StudySession[]
  problemRecords?: ProblemRecord[]
  jobApplications: JobApplication[]
  healthLog?: DailyHealthLog | null
  templeVisit?: TempleVisit | null
}

/**
 * Generates the full schedule for any date based on configured rules, habits, and saved records.
 * Ensures consistent activity identification so refreshing the page or reopening does not duplicate.
 */
export function generateScheduleForDate(context: DayScheduleContext): ScheduledActivity[] {
  const {
    dateStr,
    settings,
    habits,
    habitLogs,
    studySessions,
    problemRecords = [],
    jobApplications,
    healthLog,
    templeVisit
  } = context
  const activities: ScheduledActivity[] = []
  const normDateStr = dateStr.slice(0, 10)

  // 1. Mandatory Daily Java Study
  const javaMinutesSpent = studySessions
    .filter(s => s.subject === 'java' && s.date && s.date.slice(0, 10) === normDateStr)
    .reduce((sum, s) => sum + s.duration_minutes, 0)
  const javaTarget = settings.java_target_minutes || 120
  activities.push({
    id: `study-java-${normDateStr}`,
    name: 'Core Java Study & Coding Practice',
    category: 'study',
    subject: 'java',
    duration_target_minutes: javaTarget,
    target_display: `${javaTarget} mins`,
    is_required: true,
    time_spent_minutes: javaMinutesSpent,
    status: javaMinutesSpent >= javaTarget ? 'completed' : javaMinutesSpent > 0 ? 'in_progress' : 'not_started',
    details: `${javaMinutesSpent} / ${javaTarget} mins completed`
  })

  // 2. Mandatory Daily Problem Solving (DSA)
  const dsaStudyMinutes = studySessions
    .filter(s => s.subject === 'problem_solving' && s.date && s.date.slice(0, 10) === normDateStr)
    .reduce((sum, s) => sum + s.duration_minutes, 0)
  const dsaProblemsCount = problemRecords
    .filter(p => p.date && p.date.slice(0, 10) === normDateStr).length
  const dsaProblemMinutes = problemRecords
    .filter(p => p.date && p.date.slice(0, 10) === normDateStr)
    .reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0)
  const totalDsaMinutes = dsaStudyMinutes + dsaProblemMinutes
  const dsaTargetMinutes = settings.dsa_target_minutes || 120
  const dsaTargetCount = settings.dsa_target_count || 3

  const isDsaCompleted = (dsaProblemsCount >= dsaTargetCount) || (totalDsaMinutes >= dsaTargetMinutes)
  const isDsaInProgress = !isDsaCompleted && (dsaProblemsCount > 0 || totalDsaMinutes > 0)

  activities.push({
    id: `study-dsa-${normDateStr}`,
    name: 'Problem Solving & DSA Practice',
    category: 'study',
    subject: 'problem_solving',
    duration_target_minutes: dsaTargetMinutes,
    target_display: `${dsaTargetMinutes} mins (${dsaTargetCount} problems)`,
    is_required: true,
    time_spent_minutes: totalDsaMinutes,
    current_value: dsaProblemsCount,
    target_value: dsaTargetCount,
    status: isDsaCompleted ? 'completed' : isDsaInProgress ? 'in_progress' : 'not_started',
    details: `${dsaProblemsCount} / ${dsaTargetCount} problems solved • ${totalDsaMinutes} / ${dsaTargetMinutes} mins`
  })

  // 3. Alternating Subject: MySQL or Interview Preparation
  const alternatingSubject = getAlternatingStudySubject(
    normDateStr,
    settings.alternating_start_date || normDateStr,
    settings.alternating_start_subject || 'mysql'
  )

  if (alternatingSubject === 'mysql') {
    const mysqlMinutes = studySessions
      .filter(s => s.subject === 'mysql' && s.date && s.date.slice(0, 10) === normDateStr)
      .reduce((sum, s) => sum + s.duration_minutes, 0)
    const mysqlTarget = settings.mysql_target_minutes || 120
    activities.push({
      id: `study-mysql-${normDateStr}`,
      name: 'MySQL & Database Practice (Scheduled Day)',
      category: 'study',
      subject: 'mysql',
      duration_target_minutes: mysqlTarget,
      target_display: `${mysqlTarget} mins (2 hrs)`,
      is_required: true,
      time_spent_minutes: mysqlMinutes,
      status: mysqlMinutes >= mysqlTarget ? 'completed' : mysqlMinutes > 0 ? 'in_progress' : 'not_started',
      details: `${mysqlMinutes} / ${mysqlTarget} mins completed`
    })
  } else {
    const interviewMinutes = studySessions
      .filter(s => s.subject === 'interview_prep' && s.date && s.date.slice(0, 10) === normDateStr)
      .reduce((sum, s) => sum + s.duration_minutes, 0)
    const interviewTarget = settings.interview_target_minutes || 120
    activities.push({
      id: `study-interview-${normDateStr}`,
      name: 'Interview Preparation & Revision (Scheduled Day)',
      category: 'study',
      subject: 'interview_prep',
      duration_target_minutes: interviewTarget,
      target_display: `${interviewTarget} mins (2 hrs)`,
      is_required: true,
      time_spent_minutes: interviewMinutes,
      status: interviewMinutes >= interviewTarget ? 'completed' : interviewMinutes > 0 ? 'in_progress' : 'not_started',
      details: `${interviewMinutes} / ${interviewTarget} mins completed`
    })
  }

  // 4. Daily Technical Learning (Flexible)
  const techMinutes = studySessions
    .filter(s => s.subject === 'technical_learning' && s.date && s.date.slice(0, 10) === normDateStr)
    .reduce((sum, s) => sum + s.duration_minutes, 0)
  const techTarget = settings.tech_target_minutes || 60
  activities.push({
    id: `study-tech-${normDateStr}`,
    name: 'Frontend / Backend / Tech Learning',
    category: 'study',
    subject: 'technical_learning',
    duration_target_minutes: techTarget,
    target_display: `${techTarget} mins`,
    is_required: true,
    time_spent_minutes: techMinutes,
    status: techMinutes >= techTarget ? 'completed' : techMinutes > 0 ? 'in_progress' : 'not_started',
    details: `${techMinutes} / ${techTarget} mins completed`
  })

  // 5. Job Applications Target (Minimum 10)
  const validTodayApplications = jobApplications.filter(
    app => app.application_date && app.application_date.slice(0, 10) === normDateStr && app.status !== 'Planned'
  )
  // Deduplicate by company name + job title for unique submissions
  const uniqueApps = new Map<string, JobApplication>()
  for (const app of validTodayApplications) {
    const key = `${app.company_name.trim().toLowerCase()}-${app.job_title.trim().toLowerCase()}`
    if (!uniqueApps.has(key)) {
      uniqueApps.set(key, app)
    }
  }
  const appsCount = uniqueApps.size
  const jobTarget = settings.job_applications_daily_target || 10
  activities.push({
    id: `jobs-target-${normDateStr}`,
    name: 'Daily Job Applications Target',
    category: 'job',
    target_display: `${jobTarget} applications`,
    is_required: true,
    current_value: appsCount,
    target_value: jobTarget,
    status: appsCount >= jobTarget ? 'completed' : appsCount > 0 ? 'in_progress' : 'not_started',
    details: `${appsCount} / ${jobTarget} applications submitted (${Math.max(0, jobTarget - appsCount)} remaining)`
  })

  // 6. Tuesday Temple Visit (Only on Tuesdays)
  if (isTuesday(normDateStr)) {
    const isVisited = templeVisit?.is_visited ?? false
    activities.push({
      id: `temple-visit-${normDateStr}`,
      name: 'Tuesday Temple Visit',
      category: 'spiritual',
      target_display: 'Weekly visit',
      is_required: true,
      status: isVisited ? 'completed' : 'not_started',
      details: isVisited ? 'Completed' : 'Scheduled for today'
    })
  }

  // 7. Active Habits (Avoidance, Social Media, Fitness, Health, Custom)
  habits.filter(h => !h.is_archived).forEach(habit => {
    const log = habitLogs.find(l => l.habit_id === habit.id && l.date && l.date.slice(0, 10) === normDateStr)
    let status: ScheduledActivity['status'] = 'not_started'
    let details = ''

    if (habit.tracking_type === 'avoidance') {
      if (log?.is_completed) {
        status = 'completed'
        details = 'Maintained ✓'
      } else {
        status = 'not_started'
        details = 'Pending confirmation'
      }
    } else if (habit.category === 'social_media') {
      const usedMins = log?.numeric_value ?? 0
      const limit = habit.target_value ?? 60
      const withinLimit = usedMins <= limit
      const isExplicitlyConfirmed = log?.is_completed === true

      if (isExplicitlyConfirmed) {
        status = 'completed'
        details = `${usedMins}m / max ${limit}m (Goal achieved ✓)`
      } else if (log && typeof log.numeric_value === 'number' && log.numeric_value > 0) {
        if (withinLimit) {
          status = 'in_progress'
          details = `${usedMins}m / max ${limit}m (Within limit)`
        } else {
          status = 'missed'
          details = `${usedMins}m / max ${limit}m (Limit exceeded by ${usedMins - limit}m ⚠)`
        }
      } else {
        status = 'not_started'
        details = `0m / max ${limit}m limit (Not logged yet)`
      }
    } else if (habit.category === 'fitness' || habit.title.toLowerCase().includes('skipping')) {
      const skipCount = healthLog?.skipping_count ?? log?.numeric_value ?? 0
      const target = habit.target_value ?? (settings.skipping_target_value || 1000)
      if (skipCount >= target) {
        status = 'completed'
        details = `${skipCount} / ${target} skips (Completed ✓)`
      } else if (skipCount > 0) {
        status = 'in_progress'
        details = `${skipCount} / ${target} skips (In progress)`
      } else {
        status = 'not_started'
        details = `0 / ${target} skips`
      }
    } else if (habit.category === 'health' && habit.title.toLowerCase().includes('sleep')) {
      const sleepHours = healthLog?.sleep_hours ?? (log?.numeric_value ? log.numeric_value / 60 : 0)
      const target = settings.sleep_target_hours || 7
      if (sleepHours >= target) {
        status = 'completed'
        details = `${sleepHours} / ${target} hrs (Completed ✓)`
      } else if (sleepHours > 0) {
        status = 'in_progress'
        details = `${sleepHours} / ${target} hrs (In progress)`
      } else {
        status = 'not_started'
        details = `0 / ${target} hrs`
      }
    } else if (habit.category === 'health' && habit.title.toLowerCase().includes('water')) {
      const waterLiters = healthLog?.water_liters ?? log?.numeric_value ?? 0
      const target = settings.water_target_liters || 2.5
      if (waterLiters >= target) {
        status = 'completed'
        details = `${waterLiters} / ${target} L (Completed ✓)`
      } else if (waterLiters > 0) {
        status = 'in_progress'
        details = `${waterLiters} / ${target} L (In progress)`
      } else {
        status = 'not_started'
        details = `0 / ${target} L`
      }
    } else if (habit.tracking_type === 'numeric' || habit.tracking_type === 'duration') {
      const val = log?.numeric_value ?? 0
      const target = habit.target_value ?? 1
      if (val >= target) {
        status = 'completed'
        details = `${val} / ${target} ${habit.target_unit || ''}`
      } else if (val > 0) {
        status = 'in_progress'
        details = `${val} / ${target} ${habit.target_unit || ''}`
      } else {
        status = 'not_started'
        details = `0 / ${target} ${habit.target_unit || ''}`
      }
    }

    activities.push({
      id: `habit-${habit.id}-${normDateStr}`,
      habit_id: habit.id,
      name: habit.title,
      category: habit.category === 'fitness' || habit.category === 'health' ? 'health' : 'habit',
      target_display: habit.target_value ? `${habit.target_value} ${habit.target_unit || ''}` : 'Daily goal',
      is_required: habit.is_required,
      is_sensitive: habit.is_sensitive,
      status,
      details
    })
  })

  return activities
}
