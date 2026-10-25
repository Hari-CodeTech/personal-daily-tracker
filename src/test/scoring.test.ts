import { describe, it, expect } from 'vitest'
import { calculateDailyScore } from '@/lib/scoring'
import type { ScheduledActivity } from '@/types/database'

describe('Scoring Logic', () => {
  it('handles empty schedules safely without division by zero', () => {
    const score = calculateDailyScore([])
    expect(score.overallScore).toBe(0)
    expect(score.totalRequiredActivities).toBe(0)
    expect(score.completedRequiredActivities).toBe(0)
  })

  it('correctly calculates percentage for completed required activities', () => {
    const activities: ScheduledActivity[] = [
      {
        id: '1',
        name: 'Java Study',
        category: 'study',
        is_required: true,
        status: 'completed',
        target_display: '120 min'
      },
      {
        id: '2',
        name: 'DSA Problem Solving',
        category: 'study',
        is_required: true,
        status: 'not_started',
        target_display: '120 min'
      },
      {
        id: '3',
        name: 'No Sugar',
        category: 'habit',
        is_required: true,
        status: 'completed',
        target_display: 'Maintain'
      },
      {
        id: '4',
        name: 'Job Applications',
        category: 'job',
        is_required: true,
        status: 'not_started',
        target_display: '10 apps'
      }
    ]

    const result = calculateDailyScore(activities)
    expect(result.totalRequiredActivities).toBe(4)
    expect(result.completedRequiredActivities).toBe(2)
    expect(result.overallScore).toBe(50)
    expect(result.studyScore).toBe(50) // 1 of 2 study items completed
    expect(result.habitsScore).toBe(100) // 1 of 1 habit items completed
    expect(result.jobsScore).toBe(0) // 0 of 1 job target completed
  })

  it('deduplicates identical activities like skipping so it is never counted twice', () => {
    const activitiesWithDuplicate: ScheduledActivity[] = [
      {
        id: 'habit-skipping',
        name: 'Daily Skipping',
        category: 'habit',
        is_required: true,
        status: 'completed',
        target_display: '1000 skips'
      },
      {
        id: 'health-skipping',
        name: 'Daily Skipping',
        category: 'health',
        is_required: true,
        status: 'completed',
        target_display: '1000 skips'
      },
      {
        id: 'other-task',
        name: 'Java Study',
        category: 'study',
        is_required: true,
        status: 'not_started',
        target_display: '120 min'
      }
    ]

    const result = calculateDailyScore(activitiesWithDuplicate)
    // Daily Skipping must only be counted ONCE
    expect(result.totalRequiredActivities).toBe(2) // Skipping + Java Study
    expect(result.completedRequiredActivities).toBe(1) // Skipping
    expect(result.overallScore).toBe(50)
  })

  it('excludes optional activities from the required completion percentage', () => {
    const activities: ScheduledActivity[] = [
      {
        id: '1',
        name: 'Mandatory Task',
        category: 'study',
        is_required: true,
        status: 'completed',
        target_display: 'Required'
      },
      {
        id: '2',
        name: 'Optional Evening Walk',
        category: 'health',
        is_required: false,
        status: 'not_started',
        target_display: 'Optional'
      }
    ]

    const result = calculateDailyScore(activities)
    expect(result.totalRequiredActivities).toBe(1)
    expect(result.completedRequiredActivities).toBe(1)
    expect(result.overallScore).toBe(100)
  })
})
