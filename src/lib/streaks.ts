import { differenceInCalendarDays, parseISO, format, addDays, subDays } from 'date-fns'

export interface StreakResult {
  currentStreak: number
  longestStreak: number
  totalSuccessfulDays: number
  activeDaysCount: number
}

/**
 * Calculates current challenge day number (1 to 365+).
 * If challenge start date is today, day number is 1.
 * If challenge started 5 days ago, day number is 6.
 * Returns null if challenge is not active or no start date set.
 */
export function calculateChallengeDay(challengeStartDateStr?: string | null, targetDateStr?: string): {
  currentDay: number
  totalDays: number
  daysRemaining: number
  endDate: string
  isCompleted: boolean
} | null {
  if (!challengeStartDateStr) return null

  const startDate = parseISO(challengeStartDateStr.slice(0, 10))
  const today = targetDateStr ? parseISO(targetDateStr.slice(0, 10)) : new Date()

  const diff = differenceInCalendarDays(today, startDate)
  if (diff < 0) {
    // Challenge starts in future
    return {
      currentDay: 0,
      totalDays: 365,
      daysRemaining: 365,
      endDate: format(addDays(startDate, 365), 'yyyy-MM-dd'),
      isCompleted: false
    }
  }

  const currentDay = diff + 1
  const totalDays = 365
  const daysRemaining = Math.max(0, totalDays - currentDay)
  const endDate = format(addDays(startDate, totalDays), 'yyyy-MM-dd')
  const isCompleted = currentDay >= totalDays

  return {
    currentDay: Math.min(currentDay, totalDays),
    totalDays,
    daysRemaining,
    endDate,
    isCompleted
  }
}

/**
 * Calculates current streak and longest streak based on calendar day records.
 * A day is considered successful if its overall score >= threshold (default >= 50% or at least 1 completed activity).
 */
export function calculateStreaks(
  dailyScores: Record<string, { overallScore: number; completedCount: number }>,
  todayStr: string,
  minCompletionThreshold: number = 1 // At least 1 completed required task
): StreakResult {
  const dates = Object.keys(dailyScores).sort()
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalSuccessfulDays: 0, activeDaysCount: 0 }
  }

  let longestStreak = 0
  let currentStreak = 0
  let runningStreak = 0
  let totalSuccessfulDays = 0

  // 1. Longest streak by iterating through sorted dates
  let prevDate: Date | null = null

  for (const dateStr of dates) {
    const entry = dailyScores[dateStr]
    const isSuccessful = entry.completedCount >= minCompletionThreshold

    if (isSuccessful) {
      totalSuccessfulDays++
      const currentDate = parseISO(dateStr)

      if (prevDate) {
        const gap = differenceInCalendarDays(currentDate, prevDate)
        if (gap === 1) {
          runningStreak++
        } else {
          runningStreak = 1
        }
      } else {
        runningStreak = 1
      }
      prevDate = currentDate
      longestStreak = Math.max(longestStreak, runningStreak)
    } else {
      runningStreak = 0
      prevDate = null
    }
  }

  // 2. Current streak: count backward from today (or yesterday if today is still in progress)
  const today = parseISO(todayStr.slice(0, 10))
  let checkDate = today
  let checkDateStr = format(checkDate, 'yyyy-MM-dd')

  // If today has activity, include it in streak. If not, check if yesterday was successful
  const todayEntry = dailyScores[checkDateStr]
  const todayIsSuccessful = todayEntry && todayEntry.completedCount >= minCompletionThreshold

  if (todayIsSuccessful) {
    currentStreak = 1
    checkDate = subDays(checkDate, 1)
  } else {
    // If today hasn't been completed yet, the streak isn't broken if yesterday was successful
    checkDate = subDays(checkDate, 1)
  }

  while (true) {
    const dStr = format(checkDate, 'yyyy-MM-dd')
    const entry = dailyScores[dStr]
    if (entry && entry.completedCount >= minCompletionThreshold) {
      currentStreak++
      checkDate = subDays(checkDate, 1)
    } else {
      break
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalSuccessfulDays,
    activeDaysCount: dates.length
  }
}
