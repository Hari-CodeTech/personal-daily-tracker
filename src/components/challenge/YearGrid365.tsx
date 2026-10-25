import React from 'react'
import { format, addDays, parseISO, isAfter, isBefore, isSameDay } from 'date-fns'
import { useTracker } from '@/context/TrackerContext'
import { calculateDailyScore } from '@/lib/scoring'
import { generateScheduleForDate } from '@/lib/scheduler'

interface YearGrid365Props {
  startDateStr: string
  onSelectDate: (dateStr: string) => void
}

export function YearGrid365({ startDateStr, onSelectDate }: YearGrid365Props) {
  const {
    settings,
    habits,
    habitLogs,
    studySessions,
    jobApplications,
    healthLogs,
    templeVisits,
    selectedDate
  } = useTracker()

  const startDate = parseISO(startDateStr.slice(0, 10))
  const today = new Date()

  // Generate 365 days
  const days = Array.from({ length: 365 }, (_, i) => {
    const d = addDays(startDate, i)
    const dateStr = format(d, 'yyyy-MM-dd')
    const isFuture = isAfter(d, today)
    const isCurrent = isSameDay(d, today)

    // Calculate score if past or today
    let score = 0
    let hasRecord = false

    if (!isFuture || isCurrent) {
      const schedule = generateScheduleForDate({
        dateStr,
        settings,
        habits,
        habitLogs,
        studySessions,
        jobApplications,
        healthLog: healthLogs[dateStr],
        templeVisit: templeVisits[dateStr]
      })
      const scoreObj = calculateDailyScore(schedule)
      score = scoreObj.overallScore
      hasRecord = scoreObj.completedRequiredActivities > 0
    }

    return {
      dayNumber: i + 1,
      date: d,
      dateStr,
      isFuture,
      isCurrent,
      score,
      hasRecord
    }
  })

  const getCellColor = (day: typeof days[0]) => {
    if (day.isFuture && !day.isCurrent) {
      return 'bg-slate-100 dark:bg-navy-800/50 border-slate-200/50 dark:border-navy-800'
    }
    if (day.score >= 80) {
      return 'bg-emerald-600 dark:bg-emerald-500 text-white'
    }
    if (day.score >= 50) {
      return 'bg-emerald-400 dark:bg-emerald-600 text-white'
    }
    if (day.score > 0) {
      return 'bg-amber-400 dark:bg-amber-500 text-white'
    }
    // Past day with 0 score
    if (!day.isFuture) {
      return 'bg-slate-200 dark:bg-navy-800 text-slate-400'
    }
    return 'bg-slate-100 dark:bg-navy-800/50'
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            365-Day Discipline Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Every cell represents 1 day of relentless consistency. Click any day to view records.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-slate-100 dark:bg-navy-800 border" />
            <span className="text-[11px]">Upcoming</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-amber-400" />
            <span className="text-[11px]">Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-emerald-500" />
            <span className="text-[11px]">Accomplished</span>
          </div>
        </div>
      </div>

      {/* Grid: 365 blocks */}
      <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-25 lg:grid-cols-26 gap-1.5 p-2 bg-slate-50 dark:bg-navy-950/60 rounded-2xl border border-slate-100 dark:border-navy-800/80 max-h-96 overflow-y-auto">
        {days.map(day => {
          const isSelected = day.dateStr === selectedDate

          return (
            <button
              key={day.dayNumber}
              onClick={() => onSelectDate(day.dateStr)}
              title={`Day ${day.dayNumber} (${day.dateStr}): ${day.score}% completed`}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all relative group ${getCellColor(
                day
              )} ${
                isSelected
                  ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-navy-950 scale-110 z-10'
                  : 'hover:scale-115 hover:z-10'
              }`}
            >
              <span className="truncate">{day.dayNumber}</span>

              {/* Today marker dot */}
              {day.isCurrent && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 ring-1 ring-white" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
