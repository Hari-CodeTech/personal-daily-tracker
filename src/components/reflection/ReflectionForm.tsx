import React, { useState, useEffect } from 'react'
import { Moon, Save, Smile, Meh, Frown, Sparkles, CheckCircle2 } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import type { ReflectionMood } from '@/types/database'

export function ReflectionForm() {
  const { reflections, saveDailyReflection, selectedDate } = useTracker()
  const existingReflection = reflections[selectedDate]

  const [wentWell, setWentWell] = useState(existingReflection?.went_well || '')
  const [learned, setLearned] = useState(existingReflection?.learned || '')
  const [failedTasks, setFailedTasks] = useState(existingReflection?.failed_tasks || '')
  const [missedReason, setMissedReason] = useState(existingReflection?.missed_reason || '')
  const [distractions, setDistractions] = useState(existingReflection?.distractions || '')
  const [improveTomorrow, setImproveTomorrow] = useState(existingReflection?.improve_tomorrow || '')
  const [mood, setMood] = useState<ReflectionMood | undefined>(existingReflection?.mood)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (existingReflection) {
      setWentWell(existingReflection.went_well || '')
      setLearned(existingReflection.learned || '')
      setFailedTasks(existingReflection.failed_tasks || '')
      setMissedReason(existingReflection.missed_reason || '')
      setDistractions(existingReflection.distractions || '')
      setImproveTomorrow(existingReflection.improve_tomorrow || '')
      setMood(existingReflection.mood)
    } else {
      setWentWell('')
      setLearned('')
      setFailedTasks('')
      setMissedReason('')
      setDistractions('')
      setImproveTomorrow('')
      setMood(undefined)
    }
  }, [existingReflection, selectedDate])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveDailyReflection(selectedDate, {
      date: selectedDate,
      went_well: wentWell,
      learned,
      failed_tasks: failedTasks,
      missed_reason: missedReason,
      distractions,
      improve_tomorrow: improveTomorrow,
      mood,
      is_completed: true
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2000)
  }

  const moods: { id: ReflectionMood; label: string; icon: string }[] = [
    { id: 'great', label: 'Victorious', icon: '🔥' },
    { id: 'good', label: 'Productive', icon: '💪' },
    { id: 'neutral', label: 'Steady', icon: '⚖️' },
    { id: 'low', label: 'Fatigued', icon: '🥱' },
    { id: 'tough', label: 'Challenging', icon: '🌧️' },
  ]

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Nightly Reflection & Honest Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Private journal for {selectedDate}. Build self-awareness without guilt.
            </p>
          </div>
        </div>

        {existingReflection?.is_completed && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            Reflection Saved ✓
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Mood Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Overall Day Sentiment
          </label>
          <div className="flex flex-wrap gap-2">
            {moods.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  mood === m.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              1. What went well today? (Wins & Discipline)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Solved 3 medium DSA problems independently, avoided sugar completely..."
              value={wentWell}
              onChange={e => setWentWell(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              2. What did I learn today? (Key Concepts)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Mastered Java Concurrency ExecutorService and MySQL composite indexes..."
              value={learned}
              onChange={e => setLearned(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              3. What did I fail to complete or miss?
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Submitted only 7 job applications instead of 10..."
              value={failedTasks}
              onChange={e => setFailedTasks(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              4. Why was it missed & what distracted me?
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Got caught up in YouTube rabbit hole for 45 minutes after lunch..."
              value={distractions}
              onChange={e => setDistractions(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            5. What concrete adjustment will I make tomorrow?
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Start job application block at 10 AM sharp before checking social media..."
            value={improveTomorrow}
            onChange={e => setImproveTomorrow(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
              Reflection saved privately! ✓
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Night Reflection
          </button>
        </div>
      </form>
    </div>
  )
}
