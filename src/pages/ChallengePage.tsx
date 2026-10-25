import React from 'react'
import { Flame, Trophy, Calendar, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { YearGrid365 } from '@/components/challenge/YearGrid365'
import { ProgressBar } from '@/components/common/ProgressBar'

export function ChallengePage() {
  const { challengeInfo, streakInfo, settings, updateSettings, setSelectedDate } = useTracker()

  const startDateStr = settings.challenge_start_date || new Date().toISOString().slice(0, 10)

  const milestones = [
    { day: 30, title: 'Habit Formation', description: 'Rewire neural pathways and build core daily rhythm.' },
    { day: 100, title: 'Centurion of Discipline', description: 'Core Java, DSA mastery & strong interview readiness.' },
    { day: 200, title: 'Unshakeable Momentum', description: 'Hundreds of job applications & high technical confidence.' },
    { day: 365, title: 'Total Transformation', description: 'A complete year of relentless, documented daily growth.' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              365 Days of Self-Improvement
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Year of Mastery
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Inspired by bullet journals and 365-day challenge trackers. One full year to transform career and mindset.
          </p>
        </div>
      </div>

      {/* Challenge Hero Card */}
      {challengeInfo ? (
        <div className="bg-gradient-to-br from-amber-500/10 via-teal-500/5 to-transparent border border-amber-500/20 dark:border-amber-500/20 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                Challenge Progress
              </span>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-slate-900 dark:text-white">
                  Day {challengeInfo.currentDay}
                </span>
                <span className="text-xl font-bold text-slate-400">
                  / {challengeInfo.totalDays} Days
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-auto">
                  {challengeInfo.daysRemaining} days remaining until {challengeInfo.endDate}
                </span>
              </div>
              <ProgressBar
                value={Math.round((challengeInfo.currentDay / challengeInfo.totalDays) * 100)}
                color="amber"
                size="lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 text-center min-w-32 shadow-subtle">
                <span className="text-xs font-semibold uppercase text-slate-400 block">Current Streak</span>
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {streakInfo.currentStreak}
                </span>
                <span className="text-[10px] text-slate-500 block">consecutive days</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 text-center min-w-32 shadow-subtle">
                <span className="text-xs font-semibold uppercase text-slate-400 block">Active Days</span>
                <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {streakInfo.totalSuccessfulDays}
                </span>
                <span className="text-[10px] text-slate-500 block">days completed</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            365-Day Challenge is currently inactive.
          </p>
          <button
            onClick={() => updateSettings({ challenge_is_active: true, challenge_start_date: new Date().toISOString().slice(0, 10) })}
            className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            Start 365-Day Challenge Today
          </button>
        </div>
      )}

      {/* Visual 365-Day Heatmap Grid */}
      <YearGrid365
        startDateStr={startDateStr}
        onSelectDate={dateStr => setSelectedDate(dateStr)}
      />

      {/* Milestones Road Map */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
          Challenge Milestones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map(m => {
            const isReached = (challengeInfo?.currentDay ?? 0) >= m.day

            return (
              <div
                key={m.day}
                className={`p-4 rounded-2xl border transition-all ${
                  isReached
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-500">Day {m.day}</span>
                  {isReached && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                      Reached ✓
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {m.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
