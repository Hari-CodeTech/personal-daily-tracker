import React from 'react'
import {
  CheckCircle2,
  Circle,
  Play,
  Clock,
  Sparkles,
  BookOpen,
  Briefcase,
  HeartPulse,
  Flame,
  Check,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import type { ScheduledActivity } from '@/types/database'
import { Badge } from '@/components/common/Badge'
import { Link } from 'react-router-dom'

interface TodaysScheduleProps {
  onQuickStartStudy: (subject: string) => void
}

export function TodaysSchedule({ onQuickStartStudy }: TodaysScheduleProps) {
  const { todaySchedule, toggleHabitCompletion, habits, toggleTempleVisit, selectedDate, savingHabitId } = useTracker()

  const handleToggle = (activity: ScheduledActivity) => {
    if (activity.habit_id) {
      toggleHabitCompletion(activity.habit_id, selectedDate)
    } else if (activity.id.startsWith('habit-')) {
      const habitId = activity.id.replace('habit-', '').replace(`-${selectedDate.slice(0, 10)}`, '')
      toggleHabitCompletion(habitId, selectedDate)
    } else if (activity.id.startsWith('temple-visit')) {
      toggleTempleVisit(selectedDate)
    }
  }

  const getStatusBadge = (status: ScheduledActivity['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>
      case 'missed':
        return <Badge variant="danger">Limit Exceeded</Badge>
      case 'skipped':
        return <Badge variant="default">Skipped</Badge>
      default:
        return <Badge variant="default">Not Started</Badge>
    }
  }

  const getCategoryIcon = (category: ScheduledActivity['category']) => {
    switch (category) {
      case 'study':
        return <BookOpen className="w-4 h-4 text-blue-500" />
      case 'job':
        return <Briefcase className="w-4 h-4 text-emerald-500" />
      case 'health':
        return <HeartPulse className="w-4 h-4 text-rose-500" />
      case 'spiritual':
        return <Sparkles className="w-4 h-4 text-amber-500" />
      default:
        return <Flame className="w-4 h-4 text-purple-500" />
    }
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-2xl p-5 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Today's Scheduled Activities
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Auto-calculated from your curriculum rules, alternating days, and commitments
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400">
          {todaySchedule.filter(s => s.status === 'completed').length} / {todaySchedule.length} Done
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-navy-800/60 mt-2">
        {todaySchedule.map(activity => {
          const isDone = activity.status === 'completed'
          const isInProgress = activity.status === 'in_progress'

          return (
            <div
              key={activity.id}
              className={`py-3.5 flex items-center justify-between gap-3 transition-colors rounded-xl px-2.5 -mx-2.5 ${
                isDone
                  ? 'bg-slate-50/50 dark:bg-navy-950/20'
                  : 'hover:bg-slate-50 dark:hover:bg-navy-800/50'
              }`}
            >
              {/* Left Checkbox / Category Icon */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {(() => {
                  const isSaving = Boolean(savingHabitId && (activity.habit_id === savingHabitId || activity.id.includes(savingHabitId)))
                  return (
                    <button
                      type="button"
                      onClick={() => handleToggle(activity)}
                      disabled={isSaving}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        isSaving ? 'opacity-60 cursor-wait' : ''
                      } ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isInProgress
                          ? 'border-2 border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-navy-800'
                          : 'border-2 border-slate-300 dark:border-navy-700 text-transparent hover:border-emerald-500'
                      }`}
                      title={isSaving ? 'Saving to database...' : isDone ? 'Mark Incomplete' : 'Mark Completed'}
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Check className={`w-3.5 h-3.5 stroke-[3] ${isDone ? 'block' : 'hidden'}`} />
                      )}
                    </button>
                  )
                })()}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isDone
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {activity.is_sensitive ? 'Private Commitment' : activity.name}
                    </span>
                    {activity.is_required && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="inline-flex items-center gap-1">
                      {getCategoryIcon(activity.category)}
                      <span className="capitalize">{activity.category}</span>
                    </span>
                    <span>•</span>
                    <span>Target: {activity.target_display}</span>
                    {activity.details && (
                      <>
                        <span>•</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {activity.details}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Status & Action Button */}
              <div className="flex items-center gap-2.5 shrink-0">
                {getStatusBadge(activity.status)}

                {/* Study activities have a quick Start Timer button */}
                {activity.category === 'study' && activity.subject && !isDone && (
                  <button
                    onClick={() => onQuickStartStudy(activity.subject!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span className="hidden sm:inline">Start</span>
                  </button>
                )}

                {/* Job application shortcut */}
                {activity.category === 'job' && !isDone && (
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    Log App
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
