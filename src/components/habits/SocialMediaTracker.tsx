import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { ProgressBar } from '@/components/common/ProgressBar'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
    </svg>
  )
}

export function SocialMediaTracker() {
  const { habits, habitLogs, setHabitNumericValue, toggleHabitCompletion, settings, selectedDate } = useTracker()
  const normDate = selectedDate.slice(0, 10)

  // Find Instagram and YouTube habits
  const igHabit = habits.find(h => h.title.toLowerCase().includes('instagram'))
  const ytHabit = habits.find(h => h.title.toLowerCase().includes('youtube'))

  const igLog = igHabit ? habitLogs.find(l => l.habit_id === igHabit.id && l.date && l.date.slice(0, 10) === normDate) : undefined
  const ytLog = ytHabit ? habitLogs.find(l => l.habit_id === ytHabit.id && l.date && l.date.slice(0, 10) === normDate) : undefined

  const [igMinutes, setIgMinutes] = useState(igLog?.numeric_value ?? 0)
  const [ytMinutes, setYtMinutes] = useState(ytLog?.numeric_value ?? 0)

  // Synchronize state when selected date or logs change
  React.useEffect(() => {
    setIgMinutes(igLog?.numeric_value ?? 0)
  }, [igLog?.numeric_value, normDate])

  React.useEffect(() => {
    setYtMinutes(ytLog?.numeric_value ?? 0)
  }, [ytLog?.numeric_value, normDate])

  const igLimit = igHabit?.target_value ?? settings.instagram_limit_minutes ?? 60
  const ytLimit = ytHabit?.target_value ?? settings.youtube_limit_minutes ?? 60

  const handleSaveIg = () => {
    if (igHabit) {
      setHabitNumericValue(igHabit.id, Number(igMinutes), normDate)
    }
  }

  const handleSaveYt = () => {
    if (ytHabit) {
      setHabitNumericValue(ytHabit.id, Number(ytMinutes), normDate)
    }
  }

  const handleConfirmIg = () => {
    if (igHabit) {
      toggleHabitCompletion(igHabit.id, normDate)
    }
  }

  const handleConfirmYt = () => {
    if (ytHabit) {
      toggleHabitCompletion(ytHabit.id, normDate)
    }
  }

  const igExceeded = igMinutes > igLimit
  const ytExceeded = ytMinutes > ytLimit

  const isIgConfirmed = igLog?.is_completed === true
  const isYtConfirmed = ytLog?.is_completed === true

  const isIgLogged = igLog !== undefined && ((typeof igLog.numeric_value === 'number' && igLog.numeric_value > 0) || isIgConfirmed)
  const isYtLogged = ytLog !== undefined && ((typeof ytLog.numeric_value === 'number' && ytLog.numeric_value > 0) || isYtConfirmed)

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-navy-800 mb-5">
        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Social Media Time Discipline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Strict daily caps: Instagram (max {igLimit}m) & YouTube (max {ytLimit}m)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Instagram Card */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-navy-950/60 border border-slate-200/70 dark:border-navy-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Instagram
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isIgConfirmed
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : igExceeded
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  : isIgLogged
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-400'
              }`}>
                {isIgConfirmed
                  ? 'Goal Achieved ✓'
                  : igExceeded
                  ? 'Limit Exceeded'
                  : isIgLogged
                  ? 'Within Limit'
                  : 'Not Logged Yet'}
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>Usage: <strong className="font-mono text-slate-900 dark:text-slate-100">{igMinutes}m</strong> / {igLimit}m limit</span>
                <span className="font-mono">
                  {igExceeded ? `+${igMinutes - igLimit}m over` : `${Math.max(0, igLimit - igMinutes)}m left`}
                </span>
              </div>
              <ProgressBar
                value={Math.round((igMinutes / igLimit) * 100)}
                color={igExceeded ? 'rose' : isIgConfirmed ? 'brand' : 'amber'}
                size="sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-navy-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">Log Actual:</span>
            <input
              type="number"
              min="0"
              max="600"
              value={igMinutes}
              onChange={e => setIgMinutes(Number(e.target.value))}
              onBlur={handleSaveIg}
              className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold text-center"
            />
            <span className="text-xs text-slate-500">m</span>
            <button
              onClick={handleSaveIg}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 dark:bg-navy-700 text-white hover:bg-slate-900 transition-colors shadow-2xs"
            >
              Save
            </button>
            <button
              onClick={handleConfirmIg}
              className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shadow-2xs ${
                isIgConfirmed
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
              title="Confirm that you stayed within your daily social media goal"
            >
              {isIgConfirmed ? 'Confirmed ✓' : 'Confirm Goal ✓'}
            </button>
          </div>
        </div>

        {/* YouTube Card */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-navy-950/60 border border-slate-200/70 dark:border-navy-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-600 text-white">
                  <YoutubeIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  YouTube
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isYtConfirmed
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : ytExceeded
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  : isYtLogged
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-400'
              }`}>
                {isYtConfirmed
                  ? 'Goal Achieved ✓'
                  : ytExceeded
                  ? 'Limit Exceeded'
                  : isYtLogged
                  ? 'Within Limit'
                  : 'Not Logged Yet'}
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>Usage: <strong className="font-mono text-slate-900 dark:text-slate-100">{ytMinutes}m</strong> / {ytLimit}m limit</span>
                <span className="font-mono">
                  {ytExceeded ? `+${ytMinutes - ytLimit}m over` : `${Math.max(0, ytLimit - ytMinutes)}m left`}
                </span>
              </div>
              <ProgressBar
                value={Math.round((ytMinutes / ytLimit) * 100)}
                color={ytExceeded ? 'rose' : isYtConfirmed ? 'brand' : 'amber'}
                size="sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-navy-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">Log Actual:</span>
            <input
              type="number"
              min="0"
              max="600"
              value={ytMinutes}
              onChange={e => setYtMinutes(Number(e.target.value))}
              onBlur={handleSaveYt}
              className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold text-center"
            />
            <span className="text-xs text-slate-500">m</span>
            <button
              onClick={handleSaveYt}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 dark:bg-navy-700 text-white hover:bg-slate-900 transition-colors shadow-2xs"
            >
              Save
            </button>
            <button
              onClick={handleConfirmYt}
              className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shadow-2xs ${
                isYtConfirmed
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
              title="Confirm that you stayed within your daily social media goal"
            >
              {isYtConfirmed ? 'Confirmed ✓' : 'Confirm Goal ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
