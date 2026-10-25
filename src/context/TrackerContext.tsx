import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import type {
  UserSettings,
  Habit,
  DailyHabitLog,
  StudySession,
  ProblemRecord,
  InterviewTopic,
  JobApplication,
  DailyHealthLog,
  WaterLog,
  DailyReflection,
  TomorrowPlan,
  TempleVisit,
  ScheduledActivity,
  DailyScoreBreakdown
} from '@/types/database'
import { generateScheduleForDate } from '@/lib/scheduler'
import { calculateDailyScore } from '@/lib/scoring'
import { calculateStreaks, calculateChallengeDay } from '@/lib/streaks'

interface ActiveTimerState {
  isRunning: boolean
  subject: string
  topic: string
  notes: string
  elapsedSeconds: number
  startTime: number | null
}

interface TrackerContextType {
  selectedDate: string
  setSelectedDate: (date: string) => void
  settings: UserSettings
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>
  habits: Habit[]
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  archiveHabit: (id: string) => Promise<void>
  habitLogs: DailyHabitLog[]
  toggleHabitCompletion: (habitId: string, dateStr?: string) => Promise<void>
  setHabitNumericValue: (habitId: string, value: number, dateStr?: string) => Promise<void>
  studySessions: StudySession[]
  addStudySession: (session: Omit<StudySession, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  deleteStudySession: (id: string) => Promise<void>
  activeTimer: ActiveTimerState
  startTimer: (subject: string, topic: string, notes?: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimerAndSave: () => Promise<void>
  resetTimer: () => void
  problemRecords: ProblemRecord[]
  addProblemRecord: (record: Omit<ProblemRecord, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  deleteProblemRecord: (id: string) => Promise<void>
  interviewTopics: InterviewTopic[]
  addInterviewTopic: (topic: Omit<InterviewTopic, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateInterviewTopicStatus: (id: string, status: InterviewTopic['revision_status'], notes?: string) => Promise<void>
  jobApplications: JobApplication[]
  addJobApplication: (app: Omit<JobApplication, 'id' | 'user_id' | 'created_at'>) => Promise<{ success: boolean; duplicate?: JobApplication; app?: JobApplication }>
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>
  deleteJobApplication: (id: string) => Promise<void>
  healthLogs: Record<string, DailyHealthLog>
  updateHealthLog: (dateStr: string, updates: Partial<DailyHealthLog>) => Promise<void>
  waterLogs: WaterLog[]
  addWaterLog: (amountMl: number, dateStr?: string) => Promise<void>
  reflections: Record<string, DailyReflection>
  saveDailyReflection: (dateStr: string, reflection: Partial<DailyReflection>) => Promise<void>
  tomorrowPlans: Record<string, TomorrowPlan>
  saveTomorrowPlan: (dateStr: string, plan: Partial<TomorrowPlan>) => Promise<void>
  templeVisits: Record<string, TempleVisit>
  toggleTempleVisit: (dateStr: string, notes?: string) => Promise<void>
  todaySchedule: ScheduledActivity[]
  todayScore: DailyScoreBreakdown
  streakInfo: ReturnType<typeof calculateStreaks>
  challengeInfo: ReturnType<typeof calculateChallengeDay>
  isLoading: boolean
  savingHabitId: string | null
  exportDataJSON: () => string
  exportDataCSV: () => string
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined)

const DEFAULT_SETTINGS: UserSettings = {
  id: 'default-settings',
  user_id: 'default-user',
  timezone: 'Asia/Kolkata',
  theme: 'light',
  java_target_minutes: 120,
  dsa_target_minutes: 120,
  dsa_target_count: 3,
  mysql_target_minutes: 120,
  interview_target_minutes: 120,
  tech_target_minutes: 60,
  alternating_start_date: format(new Date(), 'yyyy-MM-dd'),
  alternating_start_subject: 'mysql',
  job_applications_daily_target: 10,
  skipping_target_type: 'count',
  skipping_target_value: 1000,
  water_target_liters: 2.50,
  sleep_target_hours: 7.0,
  instagram_limit_minutes: 60,
  youtube_limit_minutes: 60,
  challenge_start_date: format(new Date(), 'yyyy-MM-dd'),
  challenge_is_active: true,
  challenge_target_days: 365,
  reminders_enabled: true,
  reminder_times: {
    study: '09:00',
    jobs: '14:00',
    health: '18:00',
    reflection: '21:30'
  }
}

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-init-1',
    user_id: 'default',
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
    id: 'habit-init-2',
    user_id: 'default',
    title: 'No masturbation',
    category: 'discipline',
    tracking_type: 'avoidance',
    is_required: true,
    is_sensitive: true,
    is_archived: false,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'habit-init-3',
    user_id: 'default',
    title: 'No sugar',
    category: 'discipline',
    tracking_type: 'avoidance',
    is_required: true,
    is_sensitive: false,
    is_archived: false,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'habit-init-4',
    user_id: 'default',
    title: 'No mobile scrolling before sleeping',
    category: 'discipline',
    tracking_type: 'avoidance',
    is_required: true,
    is_sensitive: false,
    is_archived: false,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'habit-init-5',
    user_id: 'default',
    title: 'Instagram Usage',
    category: 'social_media',
    tracking_type: 'duration',
    target_value: 60,
    target_unit: 'minutes',
    is_required: true,
    is_sensitive: false,
    is_archived: false,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'habit-init-6',
    user_id: 'default',
    title: 'YouTube Usage',
    category: 'social_media',
    tracking_type: 'duration',
    target_value: 60,
    target_unit: 'minutes',
    is_required: true,
    is_sensitive: false,
    is_archived: false,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'habit-init-7',
    user_id: 'default',
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
  },
  {
    id: 'habit-init-8',
    user_id: 'default',
    title: 'Sleep Duration (>= 7 hrs)',
    category: 'health',
    tracking_type: 'duration',
    target_value: 420,
    target_unit: 'minutes',
    is_required: true,
    is_sensitive: false,
    is_archived: false,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'habit-init-9',
    user_id: 'default',
    title: 'Water Intake (>= 2.5 L)',
    category: 'health',
    tracking_type: 'numeric',
    target_value: 2.5,
    target_unit: 'liters',
    is_required: true,
    is_sensitive: false,
    is_archived: false,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const INITIAL_INTERVIEW_TOPICS: InterviewTopic[] = [
  { id: 'top-1', user_id: 'default', category: 'Core Java', topic_name: 'OOP Concepts (Encapsulation, Polymorphism, Abstraction, Inheritance)', revision_status: 'not_started' },
  { id: 'top-2', user_id: 'default', category: 'Core Java', topic_name: 'Collections Framework (HashMap internal working, ConcurrentHashMap)', revision_status: 'not_started' },
  { id: 'top-3', user_id: 'default', category: 'Core Java', topic_name: 'Generics, Wildcards & Type Erasure', revision_status: 'not_started' },
  { id: 'top-4', user_id: 'default', category: 'Core Java', topic_name: 'Multithreading & Concurrency (ExecutorService, volatile, synchronized)', revision_status: 'not_started' },
  { id: 'top-5', user_id: 'default', category: 'Spring Boot', topic_name: 'Dependency Injection, IoC Container & Bean Lifecycle', revision_status: 'not_started' },
  { id: 'top-6', user_id: 'default', category: 'Spring Boot', topic_name: 'RESTful API Design, Status Codes & Exception Handling', revision_status: 'not_started' },
  { id: 'top-7', user_id: 'default', category: 'MySQL', topic_name: 'Indexing, Joins, Transactions & ACID Properties', revision_status: 'not_started' },
  { id: 'top-8', user_id: 'default', category: 'HR', topic_name: 'Tell me about yourself, Strengths, Weaknesses & Projects', revision_status: 'not_started' }
]

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('daily_tracker_settings')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return DEFAULT_SETTINGS
  })

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('daily_tracker_habits')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return INITIAL_HABITS
  })

  const [habitLogs, setHabitLogs] = useState<DailyHabitLog[]>(() => {
    const saved = localStorage.getItem('daily_tracker_habit_logs')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return []
  })

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('daily_tracker_study_sessions')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return []
  })

  const [problemRecords, setProblemRecords] = useState<ProblemRecord[]>(() => {
    const saved = localStorage.getItem('daily_tracker_problem_records')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return []
  })

  const [interviewTopics, setInterviewTopics] = useState<InterviewTopic[]>(() => {
    const saved = localStorage.getItem('daily_tracker_interview_topics')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return INITIAL_INTERVIEW_TOPICS
  })

  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('daily_tracker_job_applications')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return []
  })

  const [healthLogs, setHealthLogs] = useState<Record<string, DailyHealthLog>>(() => {
    const saved = localStorage.getItem('daily_tracker_health_logs')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return {}
  })

  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem('daily_tracker_water_logs')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return []
  })

  const [reflections, setReflections] = useState<Record<string, DailyReflection>>(() => {
    const saved = localStorage.getItem('daily_tracker_reflections')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return {}
  })

  const [tomorrowPlans, setTomorrowPlans] = useState<Record<string, TomorrowPlan>>(() => {
    const saved = localStorage.getItem('daily_tracker_tomorrow_plans')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return {}
  })

  const [templeVisits, setTempleVisits] = useState<Record<string, TempleVisit>>(() => {
    const saved = localStorage.getItem('daily_tracker_temple_visits')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return {}
  })

  const [isLoading, setIsLoading] = useState(false)
  const [savingHabitId, setSavingHabitId] = useState<string | null>(null)
  const sb = supabase

  // Active study timer state persisted in localStorage
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>(() => {
    const saved = localStorage.getItem('daily_tracker_active_timer')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // If it was running, calculate elapsed time since saved timestamp
        if (parsed.isRunning && parsed.startTime) {
          const now = Date.now()
          const additionalSeconds = Math.floor((now - parsed.startTime) / 1000)
          return {
            ...parsed,
            elapsedSeconds: parsed.elapsedSeconds + additionalSeconds,
            startTime: now
          }
        }
        return parsed
      } catch {}
    }
    return { isRunning: false, subject: 'java', topic: '', notes: '', elapsedSeconds: 0, startTime: null }
  })

  // Timer interval effect
  useEffect(() => {
    let interval: any = null
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer(prev => {
          const updated = { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }
          localStorage.setItem('daily_tracker_active_timer', JSON.stringify(updated))
          return updated
        })
      }, 1000)
    } else {
      localStorage.setItem('daily_tracker_active_timer', JSON.stringify(activeTimer))
    }
    return () => clearInterval(interval)
  }, [activeTimer.isRunning])

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('daily_tracker_settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem('daily_tracker_habits', JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem('daily_tracker_habit_logs', JSON.stringify(habitLogs))
  }, [habitLogs])

  useEffect(() => {
    localStorage.setItem('daily_tracker_study_sessions', JSON.stringify(studySessions))
  }, [studySessions])

  useEffect(() => {
    localStorage.setItem('daily_tracker_problem_records', JSON.stringify(problemRecords))
  }, [problemRecords])

  useEffect(() => {
    localStorage.setItem('daily_tracker_interview_topics', JSON.stringify(interviewTopics))
  }, [interviewTopics])

  useEffect(() => {
    localStorage.setItem('daily_tracker_job_applications', JSON.stringify(jobApplications))
  }, [jobApplications])

  useEffect(() => {
    localStorage.setItem('daily_tracker_health_logs', JSON.stringify(healthLogs))
  }, [healthLogs])

  useEffect(() => {
    localStorage.setItem('daily_tracker_water_logs', JSON.stringify(waterLogs))
  }, [waterLogs])

  useEffect(() => {
    localStorage.setItem('daily_tracker_reflections', JSON.stringify(reflections))
  }, [reflections])

  useEffect(() => {
    localStorage.setItem('daily_tracker_tomorrow_plans', JSON.stringify(tomorrowPlans))
  }, [tomorrowPlans])

  useEffect(() => {
    localStorage.setItem('daily_tracker_temple_visits', JSON.stringify(templeVisits))
  }, [templeVisits])

  // Supabase data loading when user logs in
  useEffect(() => {
    if (!user || !isSupabaseConfigured() || !sb) return
    const client = sb

    const loadSupabaseData = async () => {
      setIsLoading(true)
      try {
        // Load Settings
        const { data: userSettings } = await client
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (userSettings) setSettings(userSettings as UserSettings)

        // Load Habits (Auto-seed for user if no habits exist yet)
        const { data: dbHabits, error: habitsError } = await client
          .from('habits')
          .select('*')
          .eq('user_id', user.id)
          .order('display_order', { ascending: true })

        let currentHabits = (dbHabits && dbHabits.length > 0) ? (dbHabits as Habit[]) : []

        if (!habitsError && currentHabits.length === 0) {
          // User has no habits saved in Supabase yet. Auto-seed the 9 default habits.
          const defaultHabitsToInsert = INITIAL_HABITS.map(h => ({
            user_id: user.id,
            title: h.title,
            category: h.category,
            tracking_type: h.tracking_type,
            target_value: h.target_value ?? null,
            target_unit: h.target_unit ?? null,
            is_required: h.is_required,
            is_sensitive: h.is_sensitive,
            is_archived: false,
            display_order: h.display_order
          }))

          const { data: seeded, error: seedErr } = await client
            .from('habits')
            .insert(defaultHabitsToInsert)
            .select()
            .order('display_order', { ascending: true })

          if (seedErr) {
            console.error('Failed to auto-seed default habits in Supabase:', seedErr.message)
          } else if (seeded && seeded.length > 0) {
            currentHabits = seeded as Habit[]
          }
        }

        if (currentHabits.length > 0) {
          setHabits(currentHabits)
        }

        // Load Habit Logs
        const { data: dbLogs, error: logsError } = await client
          .from('daily_habit_logs')
          .select('*')
          .eq('user_id', user.id)

        if (logsError) {
          console.error('Failed to load habit logs from Supabase:', logsError.message)
        } else if (dbLogs) {
          // If Supabase has logs, use them as authoritative source
          if (dbLogs.length > 0) {
            setHabitLogs(dbLogs as DailyHabitLog[])
          } else {
            // Check if there are local logs in localStorage that need migration to DB
            const localSaved = localStorage.getItem('daily_tracker_habit_logs')
            let localLogs: DailyHabitLog[] = []
            if (localSaved) {
              try { localLogs = JSON.parse(localSaved) } catch {}
            }

            if (localLogs.length > 0 && currentHabits.length > 0) {
              const syncedLogs: DailyHabitLog[] = []
              for (const localLog of localLogs) {
                const normDate = localLog.date ? localLog.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
                const matchingHabit = currentHabits.find(h =>
                  h.id === localLog.habit_id ||
                  (localLog.habit_id.startsWith('habit-init-') &&
                    INITIAL_HABITS.find(ih => ih.id === localLog.habit_id)?.title.toLowerCase() === h.title.toLowerCase())
                )
                if (matchingHabit) {
                  const { data: syncedRow } = await client
                    .from('daily_habit_logs')
                    .upsert({
                      user_id: user.id,
                      habit_id: matchingHabit.id,
                      date: normDate,
                      is_completed: localLog.is_completed,
                      numeric_value: localLog.numeric_value ?? null,
                      notes: localLog.notes ?? null
                    }, { onConflict: 'user_id,habit_id,date' })
                    .select()
                    .single()

                  if (syncedRow) syncedLogs.push(syncedRow as DailyHabitLog)
                }
              }
              setHabitLogs(syncedLogs.length > 0 ? syncedLogs : [])
            } else {
              setHabitLogs([])
            }
          }
        }

        // Load Study Sessions
        const { data: dbSessions } = await client
          .from('study_sessions')
          .select('*')
          .eq('user_id', user.id)

        if (dbSessions) setStudySessions(dbSessions as StudySession[])

        // Load Problems
        const { data: dbProblems } = await client
          .from('problem_solving_records')
          .select('*')
          .eq('user_id', user.id)

        if (dbProblems) setProblemRecords(dbProblems as ProblemRecord[])

        // Load Interview Topics
        const { data: dbInterview } = await client
          .from('interview_topics')
          .select('*')
          .eq('user_id', user.id)

        if (dbInterview && dbInterview.length > 0) setInterviewTopics(dbInterview as InterviewTopic[])

        // Load Job Applications
        const { data: dbJobs } = await client
          .from('job_applications')
          .select('*')
          .eq('user_id', user.id)

        if (dbJobs) setJobApplications(dbJobs as JobApplication[])

        // Load Health Logs
        const { data: dbHealth } = await client
          .from('daily_health_logs')
          .select('*')
          .eq('user_id', user.id)

        if (dbHealth) {
          const healthMap: Record<string, DailyHealthLog> = {}
          dbHealth.forEach((h: any) => {
            healthMap[h.date] = h
          })
          setHealthLogs(healthMap)
        }

        // Load Reflections
        const { data: dbReflections } = await client
          .from('daily_reflections')
          .select('*')
          .eq('user_id', user.id)

        if (dbReflections) {
          const refMap: Record<string, DailyReflection> = {}
          dbReflections.forEach((r: any) => {
            refMap[r.date] = r
          })
          setReflections(refMap)
        }

        // Load Tomorrow Plans
        const { data: dbPlans } = await client
          .from('tomorrow_plans')
          .select('*')
          .eq('user_id', user.id)

        if (dbPlans) {
          const planMap: Record<string, TomorrowPlan> = {}
          dbPlans.forEach((p: any) => {
            planMap[p.date] = p
          })
          setTomorrowPlans(planMap)
        }

        // Load Temple Visits
        const { data: dbTemple } = await client
          .from('temple_visits')
          .select('*')
          .eq('user_id', user.id)

        if (dbTemple) {
          const templeMap: Record<string, TempleVisit> = {}
          dbTemple.forEach((t: any) => {
            templeMap[t.date] = t
          })
          setTempleVisits(templeMap)
        }
      } catch (err) {
        console.error('Error loading tracker data from Supabase:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSupabaseData()
  }, [user])

  // Timer actions
  const startTimer = (subject: string, topic: string, notes: string = '') => {
    setActiveTimer({
      isRunning: true,
      subject,
      topic,
      notes,
      elapsedSeconds: 0,
      startTime: Date.now()
    })
  }

  const pauseTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: false, startTime: null }))
  }

  const resumeTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: true, startTime: Date.now() }))
  }

  const resetTimer = () => {
    setActiveTimer({ isRunning: false, subject: 'java', topic: '', notes: '', elapsedSeconds: 0, startTime: null })
    localStorage.removeItem('daily_tracker_active_timer')
  }

  const stopTimerAndSave = async () => {
    const minutes = Math.max(1, Math.round(activeTimer.elapsedSeconds / 60))
    await addStudySession({
      date: selectedDate,
      subject: activeTimer.subject as any,
      topic: activeTimer.topic || 'General Practice',
      duration_minutes: minutes,
      notes: activeTimer.notes,
      is_completed: true
    })
    resetTimer()
  }

  // Update Settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings, updated_at: new Date().toISOString() }
    setSettings(updated)

    if (user && sb) {
      const { error } = await sb.from('user_settings').upsert({
        ...updated,
        user_id: user.id
      })
      if (error) {
        console.error('Supabase error saving user_settings:', error.message)
      }
    }
  }

  // Habits operations
  const addHabit = async (habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'habit-' + Date.now(),
      user_id: user?.id || 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setHabits(prev => [...prev, newHabit])

    if (user && sb) {
      const { data, error } = await sb.from('habits').insert({
        ...habitData,
        user_id: user.id
      }).select().single()
      if (error) {
        console.error('Supabase error adding habit:', error.message)
      } else if (data) {
        setHabits(prev => prev.map(h => (h.id === newHabit.id ? (data as Habit) : h)))
      }
    }
  }

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...updates, updated_at: new Date().toISOString() } : h)))
    if (user && sb) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      if (isUuid) {
        const { error } = await sb.from('habits').update(updates).eq('id', id).eq('user_id', user.id)
        if (error) {
          console.error('Supabase error updating habit:', error.message)
        }
      }
    }
  }

  const archiveHabit = async (id: string) => {
    await updateHabit(id, { is_archived: true })
  }

  const toggleHabitCompletion = async (habitId: string, dateStr: string = selectedDate) => {
    const normDate = dateStr.slice(0, 10)
    setSavingHabitId(habitId)

    // 1. Resolve Habit and DB Habit UUID
    let currentHabit = habits.find(h => h.id === habitId)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    let targetHabitId = habitId
    let isUuid = uuidRegex.test(targetHabitId)

    // If habitId is non-UUID (e.g. 'habit-init-1'), find matching habit with UUID in state
    if (!isUuid) {
      const matchInState = habits.find(h =>
        uuidRegex.test(h.id) &&
        (h.title.toLowerCase() === currentHabit?.title.toLowerCase() ||
         (currentHabit?.display_order && h.display_order === currentHabit.display_order))
      )
      if (matchInState) {
        targetHabitId = matchInState.id
        isUuid = true
        currentHabit = matchInState
      }
    }

    // If still not a UUID and user is logged in to Supabase, ensure habit is seeded/inserted in public.habits
    if (!isUuid && user && sb && currentHabit) {
      try {
        const { data: newDbHabit, error: insertHabitErr } = await sb.from('habits').insert({
          user_id: user.id,
          title: currentHabit.title,
          category: currentHabit.category,
          tracking_type: currentHabit.tracking_type,
          target_value: currentHabit.target_value ?? null,
          target_unit: currentHabit.target_unit ?? null,
          is_required: currentHabit.is_required,
          is_sensitive: currentHabit.is_sensitive,
          is_archived: false,
          display_order: currentHabit.display_order
        }).select().single()

        if (insertHabitErr) {
          console.error('Failed to create habit in Supabase:', insertHabitErr.message)
        } else if (newDbHabit) {
          targetHabitId = newDbHabit.id
          isUuid = true
          setHabits(prev => prev.map(h => (h.id === habitId ? (newDbHabit as Habit) : h)))
        }
      } catch (err: any) {
        console.error('Exception creating habit in Supabase:', err.message)
      }
    }

    // 2. Calculate New State & Perform Optimistic Update
    const previousLogs = [...habitLogs]
    const existing = habitLogs.find(l =>
      (l.habit_id === habitId || (isUuid && l.habit_id === targetHabitId)) &&
      l.date && l.date.slice(0, 10) === normDate
    )
    const newCompleted = existing ? !existing.is_completed : true

    let updatedLogs: DailyHabitLog[]
    if (existing) {
      updatedLogs = habitLogs.map(l =>
        (l.habit_id === habitId || (isUuid && l.habit_id === targetHabitId)) &&
        l.date && l.date.slice(0, 10) === normDate
          ? { ...l, habit_id: targetHabitId, is_completed: newCompleted, updated_at: new Date().toISOString() }
          : l
      )
    } else {
      const newLog: DailyHabitLog = {
        id: 'log-' + Date.now(),
        user_id: user?.id || 'default',
        habit_id: targetHabitId,
        date: normDate,
        is_completed: newCompleted,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      updatedLogs = [...habitLogs, newLog]
    }
    setHabitLogs(updatedLogs)

    // 3. Persist to Supabase if Authenticated
    if (user && sb && isUuid) {
      try {
        const { data: savedRow, error: saveErr } = await sb.from('daily_habit_logs').upsert({
          user_id: user.id,
          habit_id: targetHabitId,
          date: normDate,
          is_completed: newCompleted
        }, { onConflict: 'user_id,habit_id,date' }).select().single()

        if (saveErr) {
          console.error('Supabase error saving habit completion:', saveErr.message)
          // Revert optimistic update
          setHabitLogs(previousLogs)
          alert(`Failed to save habit progress to database: ${saveErr.message}`)
        } else if (savedRow) {
          // Update state with canonical database record
          setHabitLogs(prev => prev.map(l =>
            l.habit_id === targetHabitId && l.date && l.date.slice(0, 10) === normDate
              ? (savedRow as DailyHabitLog)
              : l
          ))
        }
      } catch (err: any) {
        console.error('Network or database exception saving habit:', err.message)
        setHabitLogs(previousLogs)
        alert(`Error saving habit progress: ${err.message}`)
      } finally {
        setSavingHabitId(null)
      }
    } else {
      setSavingHabitId(null)
    }
  }

  const setHabitNumericValue = async (habitId: string, value: number, dateStr: string = selectedDate) => {
    const normDate = dateStr.slice(0, 10)
    setSavingHabitId(habitId)

    // 1. Resolve Habit and DB Habit UUID
    let currentHabit = habits.find(h => h.id === habitId)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    let targetHabitId = habitId
    let isUuid = uuidRegex.test(targetHabitId)

    if (!isUuid) {
      const matchInState = habits.find(h =>
        uuidRegex.test(h.id) &&
        (h.title.toLowerCase() === currentHabit?.title.toLowerCase() ||
         (currentHabit?.display_order && h.display_order === currentHabit.display_order))
      )
      if (matchInState) {
        targetHabitId = matchInState.id
        isUuid = true
        currentHabit = matchInState
      }
    }

    if (!isUuid && user && sb && currentHabit) {
      try {
        const { data: newDbHabit, error: insertHabitErr } = await sb.from('habits').insert({
          user_id: user.id,
          title: currentHabit.title,
          category: currentHabit.category,
          tracking_type: currentHabit.tracking_type,
          target_value: currentHabit.target_value ?? null,
          target_unit: currentHabit.target_unit ?? null,
          is_required: currentHabit.is_required,
          is_sensitive: currentHabit.is_sensitive,
          is_archived: false,
          display_order: currentHabit.display_order
        }).select().single()

        if (!insertHabitErr && newDbHabit) {
          targetHabitId = newDbHabit.id
          isUuid = true
          setHabits(prev => prev.map(h => (h.id === habitId ? (newDbHabit as Habit) : h)))
        }
      } catch (err: any) {
        console.error('Exception creating habit in Supabase:', err.message)
      }
    }

    const target = currentHabit?.target_value ?? 1
    const previousLogs = [...habitLogs]
    const existing = habitLogs.find(l =>
      (l.habit_id === habitId || (isUuid && l.habit_id === targetHabitId)) &&
      l.date && l.date.slice(0, 10) === normDate
    )

    let isCompleted = false
    if (currentHabit?.category === 'social_media') {
      if (value > target) {
        isCompleted = false
      } else if (existing?.is_completed) {
        isCompleted = true
      } else {
        isCompleted = false
      }
    } else {
      isCompleted = value >= target
    }

    let updatedLogs: DailyHabitLog[]
    if (existing) {
      updatedLogs = habitLogs.map(l =>
        (l.habit_id === habitId || (isUuid && l.habit_id === targetHabitId)) &&
        l.date && l.date.slice(0, 10) === normDate
          ? { ...l, habit_id: targetHabitId, numeric_value: value, is_completed: isCompleted, updated_at: new Date().toISOString() }
          : l
      )
    } else {
      const newLog: DailyHabitLog = {
        id: 'log-' + Date.now(),
        user_id: user?.id || 'default',
        habit_id: targetHabitId,
        date: normDate,
        numeric_value: value,
        is_completed: isCompleted,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      updatedLogs = [...habitLogs, newLog]
    }
    setHabitLogs(updatedLogs)

    if (user && sb && isUuid) {
      try {
        const { data: savedRow, error: saveErr } = await sb.from('daily_habit_logs').upsert({
          user_id: user.id,
          habit_id: targetHabitId,
          date: normDate,
          numeric_value: value,
          is_completed: isCompleted
        }, { onConflict: 'user_id,habit_id,date' }).select().single()

        if (saveErr) {
          console.error('Supabase error saving habit numeric value:', saveErr.message)
          setHabitLogs(previousLogs)
          alert(`Failed to save metric: ${saveErr.message}`)
        } else if (savedRow) {
          setHabitLogs(prev => prev.map(l =>
            l.habit_id === targetHabitId && l.date && l.date.slice(0, 10) === normDate
              ? (savedRow as DailyHabitLog)
              : l
          ))
        }
      } catch (err: any) {
        console.error('Exception saving habit numeric value:', err.message)
        setHabitLogs(previousLogs)
      } finally {
        setSavingHabitId(null)
      }
    } else {
      setSavingHabitId(null)
    }
  }

  // Study Sessions
  const addStudySession = async (sessionData: Omit<StudySession, 'id' | 'user_id' | 'created_at'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: 'session-' + Date.now(),
      user_id: user?.id || 'default',
      created_at: new Date().toISOString()
    }
    setStudySessions(prev => [newSession, ...prev])

    if (user && sb) {
      const { data, error } = await sb.from('study_sessions').insert({
        ...sessionData,
        user_id: user.id
      }).select().single()
      if (error) {
        console.error('Supabase error adding study session:', error.message)
      } else if (data) {
        setStudySessions(prev => prev.map(s => (s.id === newSession.id ? (data as StudySession) : s)))
      }
    }
  }

  const deleteStudySession = async (id: string) => {
    setStudySessions(prev => prev.filter(s => s.id !== id))
    if (user && sb) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      if (isUuid) {
        const { error } = await sb.from('study_sessions').delete().eq('id', id).eq('user_id', user.id)
        if (error) {
          console.error('Supabase error deleting study session:', error.message)
        }
      }
    }
  }

  // Problem Records
  const addProblemRecord = async (recordData: Omit<ProblemRecord, 'id' | 'user_id' | 'created_at'>) => {
    const newRecord: ProblemRecord = {
      ...recordData,
      id: 'problem-' + Date.now(),
      user_id: user?.id || 'default',
      created_at: new Date().toISOString()
    }
    setProblemRecords(prev => [newRecord, ...prev])

    if (user && sb) {
      const { data, error } = await sb.from('problem_solving_records').insert({
        ...recordData,
        user_id: user.id
      }).select().single()
      if (error) {
        console.error('Supabase error adding problem record:', error.message)
      } else if (data) {
        setProblemRecords(prev => prev.map(p => (p.id === newRecord.id ? (data as ProblemRecord) : p)))
      }
    }
  }

  const deleteProblemRecord = async (id: string) => {
    setProblemRecords(prev => prev.filter(p => p.id !== id))
    if (user && sb) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      if (isUuid) {
        const { error } = await sb.from('problem_solving_records').delete().eq('id', id).eq('user_id', user.id)
        if (error) {
          console.error('Supabase error deleting problem record:', error.message)
        }
      }
    }
  }

  // Interview Topics
  const addInterviewTopic = async (topicData: Omit<InterviewTopic, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newTopic: InterviewTopic = {
      ...topicData,
      id: 'topic-' + Date.now(),
      user_id: user?.id || 'default'
    }
    setInterviewTopics(prev => [...prev, newTopic])

    if (user && sb) {
      const { data, error } = await sb.from('interview_topics').insert({
        ...topicData,
        user_id: user.id
      }).select().single()
      if (error) {
        console.error('Supabase error adding interview topic:', error.message)
      } else if (data) {
        setInterviewTopics(prev => prev.map(t => (t.id === newTopic.id ? (data as InterviewTopic) : t)))
      }
    }
  }

  const updateInterviewTopicStatus = async (
    id: string,
    status: InterviewTopic['revision_status'],
    notes?: string
  ) => {
    setInterviewTopics(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              revision_status: status,
              last_revised_date: status === 'revised' ? selectedDate : t.last_revised_date,
              notes: notes !== undefined ? notes : t.notes
            }
          : t
      )
    )

    if (user && sb) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      if (isUuid) {
        const { error } = await sb.from('interview_topics').update({
          revision_status: status,
          last_revised_date: status === 'revised' ? selectedDate : undefined,
          notes
        }).eq('id', id).eq('user_id', user.id)
        if (error) {
          console.error('Supabase error updating interview topic:', error.message)
        }
      }
    }
  }

  // Job Applications
  const addJobApplication = async (appData: Omit<JobApplication, 'id' | 'user_id' | 'created_at'>) => {
    // Check duplicates
    const normCompany = appData.company_name.toLowerCase().trim()
    const normTitle = appData.job_title.toLowerCase().trim()
    const normUrl = appData.application_url?.toLowerCase().trim()

    const duplicate = jobApplications.find(existing => {
      if (normUrl && existing.application_url && existing.application_url.toLowerCase().trim() === normUrl) {
        return true
      }
      return (
        existing.application_date === appData.application_date &&
        existing.company_name.toLowerCase().trim() === normCompany &&
        existing.job_title.toLowerCase().trim() === normTitle
      )
    })

    const newApp: JobApplication = {
      ...appData,
      id: 'job-' + Date.now(),
      user_id: user?.id || 'default',
      created_at: new Date().toISOString()
    }
    setJobApplications(prev => [newApp, ...prev])

    if (user && sb) {
      const { data, error } = await sb.from('job_applications').insert({
        ...appData,
        user_id: user.id
      }).select().single()
      if (error) {
        console.error('Supabase error adding job application:', error.message)
      } else if (data) {
        setJobApplications(prev => prev.map(j => (j.id === newApp.id ? (data as JobApplication) : j)))
      }
    }

    return { success: true, duplicate, app: newApp }
  }

  const updateJobApplication = async (id: string, updates: Partial<JobApplication>) => {
    setJobApplications(prev =>
      prev.map(j => (j.id === id ? { ...j, ...updates, updated_at: new Date().toISOString() } : j))
    )
    if (user && sb) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      if (isUuid) {
        const { error } = await sb.from('job_applications').update(updates).eq('id', id).eq('user_id', user.id)
        if (error) {
          console.error('Supabase error updating job application:', error.message)
        }
      }
    }
  }

  const deleteJobApplication = async (id: string) => {
    setJobApplications(prev => prev.filter(j => j.id !== id))
    if (user && sb) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      if (isUuid) {
        const { error } = await sb.from('job_applications').delete().eq('id', id).eq('user_id', user.id)
        if (error) {
          console.error('Supabase error deleting job application:', error.message)
        }
      }
    }
  }

  // Health Logs
  const updateHealthLog = async (dateStr: string, updates: Partial<DailyHealthLog>) => {
    const normDate = dateStr.slice(0, 10)
    const existing = healthLogs[normDate] || {
      id: 'health-' + Date.now(),
      user_id: user?.id || 'default',
      date: normDate,
      water_liters: 0,
      skipping_count: 0,
      skipping_minutes: 0,
      no_sugar_maintained: true,
      junk_food_avoided: true,
      skincare_done: false,
      haircare_done: false,
      workout_details: [],
      notes: ''
    }

    const updated: DailyHealthLog = { ...existing, ...updates, updated_at: new Date().toISOString() }
    setHealthLogs(prev => ({ ...prev, [normDate]: updated }))

    // Also sync skipping to habit if present
    if (updates.skipping_count !== undefined) {
      const skippingHabit = habits.find(h => h.category === 'fitness' || h.title.toLowerCase().includes('skipping'))
      if (skippingHabit) {
        await setHabitNumericValue(skippingHabit.id, updates.skipping_count, normDate)
      }
    }

    if (user && sb) {
      const { error } = await sb.from('daily_health_logs').upsert({
        ...updated,
        user_id: user.id
      }, { onConflict: 'user_id,date' })
      if (error) {
        console.error('Supabase error saving daily_health_logs:', error.message)
      }
    }
  }

  const addWaterLog = async (amountMl: number, dateStr: string = selectedDate) => {
    const normDate = dateStr.slice(0, 10)
    const newLog: WaterLog = {
      id: 'water-' + Date.now(),
      user_id: user?.id || 'default',
      date: normDate,
      amount_ml: amountMl,
      logged_at: new Date().toISOString()
    }
    const updatedLogs = [newLog, ...waterLogs]
    setWaterLogs(updatedLogs)

    // Calculate new total liters for today
    const totalTodayMl = updatedLogs
      .filter(w => w.date && w.date.slice(0, 10) === normDate)
      .reduce((sum, w) => sum + w.amount_ml, 0)
    const totalLiters = Number((totalTodayMl / 1000).toFixed(2))

    await updateHealthLog(normDate, { water_liters: totalLiters })

    // Also update water habit log if configured
    const waterHabit = habits.find(h => h.title.toLowerCase().includes('water'))
    if (waterHabit) {
      await setHabitNumericValue(waterHabit.id, totalLiters, normDate)
    }

    if (user && sb) {
      const { error } = await sb.from('water_logs').insert({
        user_id: user.id,
        date: normDate,
        amount_ml: amountMl
      })
      if (error) {
        console.error('Supabase error inserting water log:', error.message)
      }
    }
  }

  // Reflections
  const saveDailyReflection = async (dateStr: string, reflectionData: Partial<DailyReflection>) => {
    const normDate = dateStr.slice(0, 10)
    const existing = reflections[normDate] || {
      id: 'ref-' + Date.now(),
      user_id: user?.id || 'default',
      date: normDate,
      is_completed: true
    }

    const updated: DailyReflection = {
      ...existing,
      ...reflectionData,
      is_completed: true,
      updated_at: new Date().toISOString()
    }

    setReflections(prev => ({ ...prev, [normDate]: updated }))

    if (user && sb) {
      const { error } = await sb.from('daily_reflections').upsert({
        ...updated,
        user_id: user.id
      }, { onConflict: 'user_id,date' })
      if (error) {
        console.error('Supabase error saving daily reflection:', error.message)
      }
    }
  }

  // Tomorrow Plans
  const saveTomorrowPlan = async (dateStr: string, planData: Partial<TomorrowPlan>) => {
    const normDate = dateStr.slice(0, 10)
    const existing = tomorrowPlans[normDate] || {
      id: 'plan-' + Date.now(),
      user_id: user?.id || 'default',
      date: normDate,
      job_target: settings.job_applications_daily_target || 10,
      additional_tasks: []
    }

    const updated: TomorrowPlan = {
      ...existing,
      ...planData,
      updated_at: new Date().toISOString()
    }

    setTomorrowPlans(prev => ({ ...prev, [normDate]: updated }))

    if (user && sb) {
      const { error } = await sb.from('tomorrow_plans').upsert({
        ...updated,
        user_id: user.id
      }, { onConflict: 'user_id,date' })
      if (error) {
        console.error('Supabase error saving tomorrow plan:', error.message)
      }
    }
  }

  // Temple Visits
  const toggleTempleVisit = async (dateStr: string, notes?: string) => {
    const normDate = dateStr.slice(0, 10)
    const existing = templeVisits[normDate] || {
      id: 'temple-' + Date.now(),
      user_id: user?.id || 'default',
      date: normDate,
      is_visited: false
    }

    const updated: TempleVisit = {
      ...existing,
      is_visited: !existing.is_visited,
      notes: notes !== undefined ? notes : existing.notes
    }

    setTempleVisits(prev => ({ ...prev, [normDate]: updated }))

    if (user && sb) {
      const { error } = await sb.from('temple_visits').upsert({
        ...updated,
        user_id: user.id
      }, { onConflict: 'user_id,date' })
      if (error) {
        console.error('Supabase error saving temple visit:', error.message)
      }
    }
  }

  // Derived: Today's Schedule & Score
  const todaySchedule = generateScheduleForDate({
    dateStr: selectedDate,
    settings,
    habits,
    habitLogs,
    studySessions,
    problemRecords,
    jobApplications,
    healthLog: healthLogs[selectedDate.slice(0, 10)],
    templeVisit: templeVisits[selectedDate.slice(0, 10)]
  })

  const todayScore = calculateDailyScore(todaySchedule)

  // Compute multi-day scores map for streaks
  const multiDayScores: Record<string, { overallScore: number; completedCount: number }> = {}
  
  // Aggregate dates from sessions, logs, applications, health
  const allRecordedDates = new Set<string>()
  allRecordedDates.add(todayStr)
  allRecordedDates.add(selectedDate.slice(0, 10))
  habitLogs.forEach(l => { if (l.date) allRecordedDates.add(l.date.slice(0, 10)) })
  studySessions.forEach(s => { if (s.date) allRecordedDates.add(s.date.slice(0, 10)) })
  problemRecords.forEach(p => { if (p.date) allRecordedDates.add(p.date.slice(0, 10)) })
  jobApplications.forEach(j => { if (j.application_date) allRecordedDates.add(j.application_date.slice(0, 10)) })
  Object.keys(healthLogs).forEach(d => allRecordedDates.add(d.slice(0, 10)))

  allRecordedDates.forEach(d => {
    const sch = generateScheduleForDate({
      dateStr: d,
      settings,
      habits,
      habitLogs,
      studySessions,
      problemRecords,
      jobApplications,
      healthLog: healthLogs[d],
      templeVisit: templeVisits[d]
    })
    const score = calculateDailyScore(sch)
    multiDayScores[d] = {
      overallScore: score.overallScore,
      completedCount: score.completedRequiredActivities
    }
  })

  const streakInfo = calculateStreaks(multiDayScores, todayStr)
  const challengeInfo = calculateChallengeDay(settings.challenge_start_date, todayStr)

  // Data Export functions
  const exportDataJSON = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      userProfile: user ? { email: user.email } : null,
      settings,
      habits,
      habitLogs,
      studySessions,
      problemRecords,
      interviewTopics,
      jobApplications,
      healthLogs,
      waterLogs,
      reflections,
      tomorrowPlans,
      templeVisits
    }
    return JSON.stringify(payload, null, 2)
  }

  const exportDataCSV = () => {
    const rows = ['Date,Java Mins,DSA Mins,Alternating Subject,Jobs Applied,Daily Score%']
    const sortedDates = Array.from(allRecordedDates).sort()
    for (const d of sortedDates) {
      const java = studySessions.filter(s => s.date === d && s.subject === 'java').reduce((acc, s) => acc + s.duration_minutes, 0)
      const dsa = studySessions.filter(s => s.date === d && s.subject === 'problem_solving').reduce((acc, s) => acc + s.duration_minutes, 0)
      const jobs = jobApplications.filter(j => j.application_date === d && j.status !== 'Planned').length
      const score = multiDayScores[d]?.overallScore ?? 0
      rows.push(`${d},${java},${dsa},${d},${jobs},${score}%`)
    }
    return rows.join('\n')
  }

  return (
    <TrackerContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        settings,
        updateSettings,
        habits,
        addHabit,
        updateHabit,
        archiveHabit,
        habitLogs,
        toggleHabitCompletion,
        setHabitNumericValue,
        studySessions,
        addStudySession,
        deleteStudySession,
        activeTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimerAndSave,
        resetTimer,
        problemRecords,
        addProblemRecord,
        deleteProblemRecord,
        interviewTopics,
        addInterviewTopic,
        updateInterviewTopicStatus,
        jobApplications,
        addJobApplication,
        updateJobApplication,
        deleteJobApplication,
        healthLogs,
        updateHealthLog,
        waterLogs,
        addWaterLog,
        reflections,
        saveDailyReflection,
        tomorrowPlans,
        saveTomorrowPlan,
        templeVisits,
        toggleTempleVisit,
        todaySchedule,
        todayScore,
        streakInfo,
        challengeInfo,
        isLoading,
        savingHabitId,
        exportDataJSON,
        exportDataCSV
      }}
    >
      {children}
    </TrackerContext.Provider>
  )
}

export function useTracker() {
  const context = useContext(TrackerContext)
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider')
  }
  return context
}
