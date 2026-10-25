import React, { useState } from 'react'
import {
  X,
  BookOpen,
  CheckSquare,
  Droplet,
  Code2,
  Briefcase,
  Moon,
  Plus,
  Play
} from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { useNavigate } from 'react-router-dom'

interface QuickActionsModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenStudyTimer: (subject: string) => void
  onOpenAddProblem: () => void
  onOpenAddJob: () => void
}

export function QuickActionsModal({
  isOpen,
  onClose,
  onOpenStudyTimer,
  onOpenAddProblem,
  onOpenAddJob,
}: QuickActionsModalProps) {
  const { addWaterLog, selectedDate } = useTracker()
  const navigate = useNavigate()
  const [waterLoggedMessage, setWaterLoggedMessage] = useState('')

  if (!isOpen) return null

  const handleQuickWater = async (amount: number) => {
    await addWaterLog(amount, selectedDate)
    setWaterLoggedMessage(`+${amount}ml water logged!`)
    setTimeout(() => {
      setWaterLoggedMessage('')
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          Quick Actions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Fast logging without leaving your current workflow
        </p>

        {waterLoggedMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            {waterLoggedMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Start Java Timer */}
          <button
            onClick={() => {
              onClose()
              onOpenStudyTimer('java')
            }}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-navy-800/80 flex flex-col items-start text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Study Session</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Launch study timer</span>
          </button>

          {/* Add Problem Solved */}
          <button
            onClick={() => {
              onClose()
              onOpenAddProblem()
            }}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-navy-800/80 flex flex-col items-start text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">DSA Problem</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Record solved problem</span>
          </button>

          {/* Record Job Application */}
          <button
            onClick={() => {
              onClose()
              onOpenAddJob()
            }}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-navy-800/80 flex flex-col items-start text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Job Application</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Progress toward 10</span>
          </button>

          {/* Daily Reflection */}
          <button
            onClick={() => {
              onClose()
              navigate('/reflection')
            }}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 hover:border-purple-500 hover:bg-purple-50/30 dark:hover:bg-navy-800/80 flex flex-col items-start text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-105 transition-transform">
              <Moon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Daily Reflection</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Night self-review</span>
          </button>
        </div>

        {/* Quick Water Logging */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-navy-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Quick Water Log
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickWater(250)}
              className="flex-1 py-2 px-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold hover:bg-cyan-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5" />
              +250 ml (1 glass)
            </button>
            <button
              onClick={() => handleQuickWater(500)}
              className="flex-1 py-2 px-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold hover:bg-cyan-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5" />
              +500 ml (1 bottle)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
