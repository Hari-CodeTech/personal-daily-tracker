import React, { useState } from 'react'
import { Play, Pause, Square, RotateCcw, Clock, BookOpen, Save, Plus } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import type { StudySubject } from '@/types/database'

const SUBJECT_OPTIONS: { id: StudySubject; label: string }[] = [
  { id: 'java', label: 'Java (Mandatory Daily)' },
  { id: 'problem_solving', label: 'Problem Solving / DSA (Mandatory Daily)' },
  { id: 'mysql', label: 'MySQL & SQL Practice (Alternating)' },
  { id: 'interview_prep', label: 'Interview Preparation (Alternating)' },
  { id: 'technical_learning', label: 'Frontend / Backend / Tech Learning' },
  { id: 'custom', label: 'Custom Study Subject' },
]

export function StudySessionTimer({ defaultSubject = 'java' }: { defaultSubject?: StudySubject }) {
  const {
    activeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimerAndSave,
    resetTimer,
    addStudySession,
    selectedDate
  } = useTracker()

  const [subject, setSubject] = useState<StudySubject>(
    (activeTimer.subject as StudySubject) || defaultSubject
  )
  const [topic, setTopic] = useState(activeTimer.topic || '')
  const [notes, setNotes] = useState(activeTimer.notes || '')
  const [manualMode, setManualMode] = useState(false)
  const [manualMinutes, setManualMinutes] = useState(60)

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    startTimer(subject, topic || 'General Study', notes)
  }

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (manualMinutes <= 0) return

    await addStudySession({
      date: selectedDate,
      subject,
      topic: topic || 'Study Session',
      duration_minutes: Number(manualMinutes),
      notes,
      is_completed: true
    })

    setTopic('')
    setNotes('')
    setManualMode(false)
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Study Timer & Stopwatch
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live tracking persisted across page reloads
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {manualMode ? 'Switch to Live Timer' : 'Manual Time Entry'}
        </button>
      </div>

      {!manualMode ? (
        <div>
          {/* Big Digital Display */}
          <div className="text-center py-6 bg-slate-50 dark:bg-navy-950/60 rounded-3xl border border-slate-100 dark:border-navy-800/80 mb-6">
            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-50">
              {formatTimer(activeTimer.elapsedSeconds)}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
              {activeTimer.isRunning
                ? 'Session in progress • Auto-saving elapsed time'
                : activeTimer.elapsedSeconds > 0
                ? 'Timer paused'
                : 'Ready to begin study session'}
            </p>
          </div>

          {/* Configuration Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Subject
              </label>
              <select
                value={activeTimer.isRunning ? activeTimer.subject : subject}
                disabled={activeTimer.isRunning}
                onChange={e => setSubject(e.target.value as StudySubject)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
              >
                {SUBJECT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Topic / Chapter
              </label>
              <input
                type="text"
                placeholder="e.g. Collections Framework, Arrays, Joins..."
                value={activeTimer.isRunning ? activeTimer.topic : topic}
                disabled={activeTimer.isRunning}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Session Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Key concepts learned, problems attempted, or revision points..."
              value={activeTimer.isRunning ? activeTimer.notes : notes}
              disabled={activeTimer.isRunning}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
            />
          </div>

          {/* Timer Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!activeTimer.isRunning && activeTimer.elapsedSeconds === 0 ? (
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Study Session
              </button>
            ) : activeTimer.isRunning ? (
              <>
                <button
                  type="button"
                  onClick={pauseTimer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
                <button
                  type="button"
                  onClick={stopTimerAndSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Completed Session
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={resumeTimer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Resume
                </button>
                <button
                  type="button"
                  onClick={stopTimerAndSave}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Session
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Manual Time Form */
        <form onSubmit={handleManualSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as StudySubject)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {SUBJECT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="720"
                value={manualMinutes}
                onChange={e => setManualMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Topic / Chapter
            </label>
            <input
              type="text"
              placeholder="e.g. Multithreading, Binary Search Trees..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Notes
            </label>
            <textarea
              rows={2}
              placeholder="What did you study during this session?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setManualMode(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
            >
              Record Study Session
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
