import React from 'react'
import { X, Award, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { ProgressBar } from '@/components/common/ProgressBar'

interface ScoreBreakdownModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScoreBreakdownModal({ isOpen, onClose }: ScoreBreakdownModalProps) {
  const { todayScore, todaySchedule } = useTracker()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Daily Score Calculation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transparent, mathematical breakdown of today's progress
            </p>
          </div>
        </div>

        {/* Overall Big Score Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 mb-5">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Overall Daily Completion
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {todayScore.overallScore}%
            </span>
          </div>
          <ProgressBar value={todayScore.overallScore} size="lg" color="brand" />
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
            {todayScore.explanation}
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Category Breakdown
          </h4>

          {/* Study */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/70 dark:border-navy-800">
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Technical Study & Problem Solving</span>
              <span className="font-mono">{todayScore.studyScore}%</span>
            </div>
            <ProgressBar value={todayScore.studyScore} size="sm" color="blue" />
          </div>

          {/* Habits & Discipline */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/70 dark:border-navy-800">
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Habits & Discipline Commitments</span>
              <span className="font-mono">{todayScore.habitsScore}%</span>
            </div>
            <ProgressBar value={todayScore.habitsScore} size="sm" color="purple" />
          </div>

          {/* Job Applications Target */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/70 dark:border-navy-800">
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Job Applications (Target 10)</span>
              <span className="font-mono">{todayScore.jobsScore}%</span>
            </div>
            <ProgressBar value={todayScore.jobsScore} size="sm" color="brand" />
          </div>

          {/* Health & Fitness */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/70 dark:border-navy-800">
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Health, Sleep, Water & Fitness</span>
              <span className="font-mono">{todayScore.healthScore}%</span>
            </div>
            <ProgressBar value={todayScore.healthScore} size="sm" color="amber" />
          </div>
        </div>

        {/* Deduplication Guarantee note */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-navy-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Deduplication Guarantee: Shared habits (such as skipping or water) are deduplicated so each unique activity contributes exactly once to your overall score.
          </p>
        </div>
      </div>
    </div>
  )
}
