import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckSquare,
  Briefcase,
  HeartPulse,
  Moon,
  Clock,
  Sparkles,
  Code2
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns'
import { useTracker } from '@/context/TrackerContext'
import { generateScheduleForDate } from '@/lib/scheduler'
import { calculateDailyScore } from '@/lib/scoring'
import { formatMinutesToHours } from '@/lib/utils'

export function CalendarPage() {
  const {
    selectedDate,
    setSelectedDate,
    settings,
    habits,
    habitLogs,
    studySessions,
    problemRecords,
    jobApplications,
    healthLogs,
    reflections,
    templeVisits
  } = useTracker()

  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  // Records for selected date
  const selectedDateSchedule = generateScheduleForDate({
    dateStr: selectedDate,
    settings,
    habits,
    habitLogs,
    studySessions,
    jobApplications,
    healthLog: healthLogs[selectedDate],
    templeVisit: templeVisits[selectedDate]
  })
  const selectedDateScore = calculateDailyScore(selectedDateSchedule)

  const selectedStudySessions = studySessions.filter(s => s.date === selectedDate)
  const selectedProblems = problemRecords.filter(p => p.date === selectedDate)
  const selectedJobApps = jobApplications.filter(j => j.application_date === selectedDate)
  const selectedReflection = reflections[selectedDate]
  const selectedHealth = healthLogs[selectedDate]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Calendar & Historical Records
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
              Past Review
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Navigate any date to inspect saved study logs, DSA problems, applications, and reflections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Month Calendar (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} className="text-[11px] font-bold text-slate-400 uppercase py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map(day => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const isSelected = dayStr === selectedDate
              const isCurrentMonth = isSameMonth(day, currentMonth)

              // Check if date has records
              const hasStudy = studySessions.some(s => s.date === dayStr)
              const hasJobs = jobApplications.some(j => j.application_date === dayStr)
              const hasProblems = problemRecords.some(p => p.date === dayStr)
              const hasReflection = Boolean(reflections[dayStr]?.is_completed)

              return (
                <button
                  key={dayStr}
                  onClick={() => setSelectedDate(dayStr)}
                  className={`aspect-square p-1.5 rounded-2xl flex flex-col items-center justify-between transition-all relative ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 scale-105'
                      : isCurrentMonth
                      ? 'bg-slate-50 dark:bg-navy-950/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                      : 'bg-transparent text-slate-300 dark:text-slate-700'
                  }`}
                >
                  <span className="text-xs font-mono">{format(day, 'd')}</span>

                  {/* Indicator dots for activity */}
                  <div className="flex gap-0.5 mt-auto">
                    {hasStudy && (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                    )}
                    {hasJobs && (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`} />
                    )}
                    {hasProblems && (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                    )}
                    {hasReflection && (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Selected Date Inspection Details (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-navy-800 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Date Inspection
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Day Score</span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedDateScore.overallScore}%
                </span>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="space-y-4">
              {/* Study Sessions on Date */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Study Sessions ({selectedStudySessions.length})
                </div>
                {selectedStudySessions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No study sessions saved on this date.</p>
                ) : (
                  <div className="space-y-1">
                    {selectedStudySessions.map(s => (
                      <div key={s.id} className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-navy-950 flex justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{s.topic} ({s.subject})</span>
                        <span className="font-mono text-slate-500">{s.duration_minutes}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Problems Solved on Date */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  DSA Problems ({selectedProblems.length})
                </div>
                {selectedProblems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No coding problems recorded on this date.</p>
                ) : (
                  <div className="space-y-1">
                    {selectedProblems.map(p => (
                      <div key={p.id} className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-navy-950 flex justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{p.problem_name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-navy-800">{p.difficulty}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Applications on Date */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Job Applications ({selectedJobApps.length} / 10 target)
                </div>
                {selectedJobApps.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No job applications recorded on this date.</p>
                ) : (
                  <div className="space-y-1">
                    {selectedJobApps.map(j => (
                      <div key={j.id} className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-navy-950 flex justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{j.job_title} @ {j.company_name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{j.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Night Reflection on Date */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1.5">
                  <Moon className="w-3.5 h-3.5" />
                  Night Reflection
                </div>
                {selectedReflection?.is_completed ? (
                  <div className="text-xs p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/40 dark:border-purple-900/30">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      <strong>Wins: </strong>{selectedReflection.went_well || 'Saved'}
                    </p>
                    {selectedReflection.learned && (
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        <strong>Learned: </strong>{selectedReflection.learned}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No reflection recorded for this date.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
