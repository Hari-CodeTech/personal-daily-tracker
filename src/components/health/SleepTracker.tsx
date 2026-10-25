import React, { useState } from 'react'
import { Moon, Sunrise, Sunset, Clock, CheckCircle } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { ProgressBar } from '@/components/common/ProgressBar'

export function SleepTracker() {
  const { healthLogs, updateHealthLog, settings, selectedDate } = useTracker()
  const todayHealth = healthLogs[selectedDate]

  const [sleepHours, setSleepHours] = useState<number>(todayHealth?.sleep_hours ?? 7)
  const [bedTime, setBedTime] = useState<string>(todayHealth?.sleep_start_time ?? '23:30')
  const [wakeTime, setWakeTime] = useState<string>(todayHealth?.sleep_wake_time ?? '07:00')

  const targetHours = settings.sleep_target_hours || 7
  const isTargetAchieved = (todayHealth?.sleep_hours ?? 0) >= targetHours

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateHealthLog(selectedDate, {
      sleep_hours: Number(sleepHours),
      sleep_start_time: bedTime,
      sleep_wake_time: wakeTime
    })
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Sleep & Recovery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target: At least {targetHours} hours restorative sleep
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          isTargetAchieved
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
        }`}>
          {isTargetAchieved ? 'Target Met (>= 7 hrs) ✓' : 'Under Target'}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Sunset className="w-3.5 h-3.5 text-amber-500" />
              Bed Time
            </label>
            <input
              type="time"
              value={bedTime}
              onChange={e => setBedTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Sunrise className="w-3.5 h-3.5 text-amber-500" />
              Wake Up Time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              Duration (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="16"
              value={sleepHours}
              onChange={e => setSleepHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Recorded for {selectedDate}: <strong className="text-slate-800 dark:text-slate-200 font-mono">{todayHealth?.sleep_hours ?? 0} hrs</strong>
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
          >
            Save Sleep Record
          </button>
        </div>
      </form>
    </div>
  )
}
