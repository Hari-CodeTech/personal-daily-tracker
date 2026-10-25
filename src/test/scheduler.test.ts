import { describe, it, expect } from 'vitest'
import { getAlternatingStudySubject, isTuesday, generateScheduleForDate } from '@/lib/scheduler'
import type { UserSettings, Habit } from '@/types/database'

describe('Scheduler & Alternating Day Logic', () => {
  it('correctly follows continuous alternating MySQL and Interview schedule across week boundaries', () => {
    // Let's use 2026-10-25 (Sunday) as the anchor date with MySQL as anchor
    const anchorDate = '2026-10-25' // Sunday

    // Week 1
    expect(getAlternatingStudySubject('2026-10-25', anchorDate, 'mysql')).toBe('mysql') // Sunday: MySQL
    expect(getAlternatingStudySubject('2026-10-26', anchorDate, 'mysql')).toBe('interview_prep') // Monday: No MySQL
    expect(getAlternatingStudySubject('2026-10-27', anchorDate, 'mysql')).toBe('mysql') // Tuesday: MySQL
    expect(getAlternatingStudySubject('2026-10-28', anchorDate, 'mysql')).toBe('interview_prep') // Wednesday: No MySQL
    expect(getAlternatingStudySubject('2026-10-29', anchorDate, 'mysql')).toBe('mysql') // Thursday: MySQL
    expect(getAlternatingStudySubject('2026-10-30', anchorDate, 'mysql')).toBe('interview_prep') // Friday: No MySQL
    expect(getAlternatingStudySubject('2026-10-31', anchorDate, 'mysql')).toBe('mysql') // Saturday: MySQL

    // Week 2 (continuous without resetting at week boundary!)
    expect(getAlternatingStudySubject('2026-11-01', anchorDate, 'mysql')).toBe('interview_prep') // Sunday: No MySQL
    expect(getAlternatingStudySubject('2026-11-02', anchorDate, 'mysql')).toBe('mysql') // Monday: MySQL
    expect(getAlternatingStudySubject('2026-11-03', anchorDate, 'mysql')).toBe('interview_prep') // Tuesday: No MySQL
    expect(getAlternatingStudySubject('2026-11-04', anchorDate, 'mysql')).toBe('mysql') // Wednesday: MySQL
    expect(getAlternatingStudySubject('2026-11-05', anchorDate, 'mysql')).toBe('interview_prep') // Thursday: No MySQL
    expect(getAlternatingStudySubject('2026-11-06', anchorDate, 'mysql')).toBe('mysql') // Friday: MySQL
    expect(getAlternatingStudySubject('2026-11-07', anchorDate, 'mysql')).toBe('interview_prep') // Saturday: No MySQL
  })

  it('correctly identifies Tuesday for temple visits', () => {
    expect(isTuesday('2026-10-27')).toBe(true) // 2026-10-27 is Tuesday
    expect(isTuesday('2026-10-25')).toBe(false) // Sunday
    expect(isTuesday('2026-10-26')).toBe(false) // Monday
    expect(isTuesday('2026-10-28')).toBe(false) // Wednesday
  })

  it('includes Tuesday temple visit only on Tuesdays in generateScheduleForDate', () => {
    const defaultSettings: UserSettings = {
      id: 'test-settings',
      user_id: 'test-user',
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

    // Tuesday: 2026-10-27
    const tuesdaySchedule = generateScheduleForDate({
      dateStr: '2026-10-27',
      settings: defaultSettings,
      habits: [],
      habitLogs: [],
      studySessions: [],
      jobApplications: []
    })

    const tuesdayTemple = tuesdaySchedule.find(a => a.name.includes('Temple'))
    expect(tuesdayTemple).toBeDefined()
    expect(tuesdayTemple?.is_required).toBe(true)

    // Wednesday: 2026-10-28
    const wednesdaySchedule = generateScheduleForDate({
      dateStr: '2026-10-28',
      settings: defaultSettings,
      habits: [],
      habitLogs: [],
      studySessions: [],
      jobApplications: []
    })

    const wednesdayTemple = wednesdaySchedule.find(a => a.name.includes('Temple'))
    expect(wednesdayTemple).toBeUndefined()
  })

  it('ensures mandatory Java and Problem Solving appear every day with configured targets', () => {
    const defaultSettings: UserSettings = {
      id: 'test-settings',
      user_id: 'test-user',
      timezone: 'Asia/Kolkata',
      theme: 'light',
      java_target_minutes: 90,
      dsa_target_minutes: 100,
      dsa_target_count: 4,
      mysql_target_minutes: 120,
      interview_target_minutes: 120,
      tech_target_minutes: 45,
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

    const schedule = generateScheduleForDate({
      dateStr: '2026-10-25',
      settings: defaultSettings,
      habits: [],
      habitLogs: [],
      studySessions: [],
      jobApplications: []
    })

    const java = schedule.find(a => a.subject === 'java')
    expect(java).toBeDefined()
    expect(java?.duration_target_minutes).toBe(90)
    expect(java?.is_required).toBe(true)

    const dsa = schedule.find(a => a.subject === 'problem_solving')
    expect(dsa).toBeDefined()
    expect(dsa?.duration_target_minutes).toBe(100)
    expect(dsa?.is_required).toBe(true)

    const jobs = schedule.find(a => a.category === 'job')
    expect(jobs).toBeDefined()
    expect(jobs?.is_required).toBe(true)
  })
})
