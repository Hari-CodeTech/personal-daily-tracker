import React, { useState } from 'react'
import { X, Code2, CheckCircle2, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import type { ProblemDifficulty, ProblemResult } from '@/types/database'

interface ProblemSolvingModalProps {
  isOpen: boolean
  onClose: () => void
}

const DSA_TOPICS = [
  'Arrays',
  'Strings',
  'Searching & Binary Search',
  'Sorting Algorithms',
  'Hashing & HashMaps',
  'Two Pointers & Sliding Window',
  'Linked Lists',
  'Stacks & Queues',
  'Binary Trees & BST',
  'Recursion & Backtracking',
  'Dynamic Programming',
  'Graphs',
  'Greedy',
  'Bit Manipulation',
  'Other Programming Topic'
]

export function ProblemSolvingModal({ isOpen, onClose }: ProblemSolvingModalProps) {
  const { addProblemRecord, selectedDate } = useTracker()

  const [problemName, setProblemName] = useState('')
  const [topic, setTopic] = useState('Arrays')
  const [difficulty, setDifficulty] = useState<ProblemDifficulty>('Medium')
  const [timeSpent, setTimeSpent] = useState(30)
  const [result, setResult] = useState<ProblemResult>('solved_independently')
  const [needsRevision, setNeedsRevision] = useState(false)
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!problemName.trim()) return

    await addProblemRecord({
      date: selectedDate,
      problem_name: problemName.trim(),
      topic,
      difficulty,
      time_spent_minutes: Number(timeSpent),
      result,
      needs_revision: needsRevision || result === 'needs_revision',
      notes: notes.trim() || undefined
    })

    setProblemName('')
    setNotes('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Log Problem Solved
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track coding & DSA problems solved on {selectedDate}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Problem Title / LeetCode No.
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1. Two Sum, 3. Longest Substring Without Repeating Characters..."
              value={problemName}
              onChange={e => setProblemName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Topic
              </label>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {DSA_TOPICS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Easy', 'Medium', 'Hard'] as ProblemDifficulty[]).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      difficulty === d
                        ? d === 'Easy'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : d === 'Medium'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Time Spent (Mins)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={timeSpent}
                onChange={e => setTimeSpent(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Result Status
              </label>
              <select
                value={result}
                onChange={e => setResult(e.target.value as ProblemResult)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="solved_independently">Solved Independently</option>
                <option value="solved_with_help">Solved With Hints / Editorial</option>
                <option value="attempted">Attempted But Not Solved</option>
                <option value="needs_revision">Needs Revision</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="needsRevisionCheckbox"
              checked={needsRevision}
              onChange={e => setNeedsRevision(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-navy-700"
            />
            <label htmlFor="needsRevisionCheckbox" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Mark this problem for future revision
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Approach & Edge Cases Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Used HashMap for O(n) lookup. Careful with negative integers and empty arrays..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
            >
              Save Problem Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
