import { describe, it, expect } from 'vitest'
import { calculateChallengeDay, calculateStreaks } from '@/lib/streaks'

describe('Streaks & 365-Day Challenge', () => {
  it('correctly calculates challenge day number from start date', () => {
    // Challenge started 2026-10-01, target date 2026-10-01 is Day 1
    const day1 = calculateChallengeDay('2026-10-01', '2026-10-01')
    expect(day1?.currentDay).toBe(1)
    expect(day1?.daysRemaining).toBe(364)
    expect(day1?.isCompleted).toBe(false)

    // Target date 2026-10-10 is Day 10
    const day10 = calculateChallengeDay('2026-10-01', '2026-10-10')
    expect(day10?.currentDay).toBe(10)
    expect(day10?.daysRemaining).toBe(355)

    // Future start date
    const future = calculateChallengeDay('2026-11-01', '2026-10-25')
    expect(future?.currentDay).toBe(0)
  })

  it('calculates current streak and longest streak accurately', () => {
    const scores = {
      '2026-10-20': { overallScore: 80, completedCount: 5 },
      '2026-10-21': { overallScore: 90, completedCount: 6 },
      '2026-10-22': { overallScore: 70, completedCount: 4 },
      // gap on 2026-10-23 (missed day)
      '2026-10-24': { overallScore: 85, completedCount: 5 },
      '2026-10-25': { overallScore: 100, completedCount: 7 }
    }

    const streaks = calculateStreaks(scores, '2026-10-25')
    // Longest streak was 3 days (Oct 20, 21, 22)
    expect(streaks.longestStreak).toBe(3)
    // Current streak is 2 days (Oct 24, 25)
    expect(streaks.currentStreak).toBe(2)
    expect(streaks.totalSuccessfulDays).toBe(5)
  })
})
