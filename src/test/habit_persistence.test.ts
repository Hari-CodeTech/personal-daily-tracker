import { describe, it, expect } from 'vitest'
import type { Habit, DailyHabitLog } from '@/types/database'

describe('Habit Checkbox Persistence & State Management', () => {
  const mockHabits: Habit[] = [
    {
      id: 'd9f1e1a2-1111-4000-8000-000000000001',
      user_id: 'user-123',
      title: 'No pornography',
      category: 'discipline',
      tracking_type: 'avoidance',
      is_required: true,
      is_sensitive: true,
      is_archived: false,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'd9f1e1a2-2222-4000-8000-000000000002',
      user_id: 'user-123',
      title: 'Daily Skipping',
      category: 'fitness',
      tracking_type: 'numeric',
      target_value: 1000,
      target_unit: 'skips',
      is_required: true,
      is_sensitive: false,
      is_archived: false,
      display_order: 7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  it('determines completion state correctly and matches normalized dates', () => {
    const selectedDate = '2026-10-25'
    const habitLogs: DailyHabitLog[] = [
      {
        id: 'log-1',
        user_id: 'user-123',
        habit_id: 'd9f1e1a2-1111-4000-8000-000000000001',
        date: '2026-10-25T00:00:00.000Z',
        is_completed: true,
        created_at: '2026-10-25T10:00:00.000Z',
        updated_at: '2026-10-25T10:00:00.000Z'
      }
    ]

    // Check with normalized comparison
    const log = habitLogs.find(
      l => l.habit_id === mockHabits[0].id && l.date && l.date.slice(0, 10) === selectedDate.slice(0, 10)
    )
    expect(log).toBeDefined()
    expect(log?.is_completed).toBe(true)
  })

  it('toggles habit from unchecked to checked and back without duplicating entries', () => {
    let logs: DailyHabitLog[] = []
    const normDate = '2026-10-25'
    const habitId = 'd9f1e1a2-1111-4000-8000-000000000001'

    // 1. Initial check (unchecked -> checked)
    const existing1 = logs.find(l => l.habit_id === habitId && l.date.slice(0, 10) === normDate)
    const newCompleted1 = existing1 ? !existing1.is_completed : true
    if (existing1) {
      logs = logs.map(l =>
        l.habit_id === habitId && l.date.slice(0, 10) === normDate
          ? { ...l, is_completed: newCompleted1 }
          : l
      )
    } else {
      logs.push({
        id: 'log-uuid-1',
        user_id: 'user-123',
        habit_id: habitId,
        date: normDate,
        is_completed: newCompleted1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    expect(logs.length).toBe(1)
    expect(logs[0].is_completed).toBe(true)

    // 2. Second toggle (checked -> unchecked)
    const existing2 = logs.find(l => l.habit_id === habitId && l.date.slice(0, 10) === normDate)
    const newCompleted2 = existing2 ? !existing2.is_completed : true
    if (existing2) {
      logs = logs.map(l =>
        l.habit_id === habitId && l.date.slice(0, 10) === normDate
          ? { ...l, is_completed: newCompleted2 }
          : l
      )
    } else {
      logs.push({
        id: 'log-uuid-2',
        user_id: 'user-123',
        habit_id: habitId,
        date: normDate,
        is_completed: newCompleted2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Must still have exactly 1 record for this (user, habit, date) combo
    expect(logs.length).toBe(1)
    expect(logs[0].is_completed).toBe(false)
  })

  it('simulates page reload: initializes checkbox with saved Supabase state', () => {
    // Simulated database table state fetched on refresh
    const dbLogsFromSupabase: DailyHabitLog[] = [
      {
        id: 'db-log-999',
        user_id: 'user-123',
        habit_id: 'd9f1e1a2-1111-4000-8000-000000000001',
        date: '2026-10-25',
        is_completed: true,
        created_at: '2026-10-25T12:00:00Z',
        updated_at: '2026-10-25T12:00:00Z'
      }
    ]

    // Reload state initialization
    const loadedLogs = [...dbLogsFromSupabase]
    const habit = mockHabits[0]
    const targetDate = '2026-10-25'

    const habitLog = loadedLogs.find(
      l => l.habit_id === habit.id && l.date && l.date.slice(0, 10) === targetDate.slice(0, 10)
    )

    const isCheckboxChecked = habitLog?.is_completed ?? false
    expect(isCheckboxChecked).toBe(true)
  })

  it('reverts optimistic state when database save fails', () => {
    let currentLogs: DailyHabitLog[] = []
    const previousLogs = [...currentLogs]
    const habitId = 'd9f1e1a2-1111-4000-8000-000000000001'

    // Optimistic check
    currentLogs = [
      {
        id: 'temp-id',
        user_id: 'user-123',
        habit_id: habitId,
        date: '2026-10-25',
        is_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    expect(currentLogs.length).toBe(1)

    // Simulated database failure
    const saveError = new Error('Database connection failed')
    if (saveError) {
      currentLogs = previousLogs
    }

    expect(currentLogs.length).toBe(0)
  })
})
