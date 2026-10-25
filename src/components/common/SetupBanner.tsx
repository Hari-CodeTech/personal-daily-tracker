import React, { useState } from 'react'
import { Database, AlertCircle, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

export function SetupBanner() {
  const { isConfigured, isDemoMode, enableDemoMode } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  if (isConfigured && !isDemoMode) {
    return null
  }

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(`VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-semibold">Supabase Configuration Required:</span>
          <span className="text-amber-800 dark:text-amber-300">
            {isDemoMode
              ? 'Exploring in Local Preview Mode (data saves locally in your browser).'
              : 'Add your Supabase credentials to enable multi-device sync, real auth, and cloud PostgreSQL.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/setup"
            className="font-medium underline hover:text-amber-950 dark:hover:text-white transition-colors"
          >
            Setup Guide
          </Link>
          <span className="text-amber-300 dark:text-amber-700">•</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 font-medium hover:text-amber-950 dark:hover:text-white transition-colors"
          >
            {isExpanded ? 'Hide Details' : 'Quick Steps'}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 pb-3 pt-1 border-t border-amber-500/15 text-xs text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            <div className="bg-white/80 dark:bg-navy-900/80 p-3 rounded-xl border border-amber-200/50 dark:border-navy-700/50">
              <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">1. Create Project</span>
              <p className="text-slate-600 dark:text-slate-400">
                Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline text-blue-600 dark:text-blue-400 inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a> and create a new project.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-navy-900/80 p-3 rounded-xl border border-amber-200/50 dark:border-navy-700/50">
              <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">2. Run SQL Schema</span>
              <p className="text-slate-600 dark:text-slate-400">
                In Supabase SQL Editor, paste and run <code className="px-1 py-0.5 bg-slate-100 dark:bg-navy-800 rounded font-mono text-[11px]">supabase/migrations/20261025000000_initial_schema.sql</code>.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-navy-900/80 p-3 rounded-xl border border-amber-200/50 dark:border-navy-700/50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-amber-700 dark:text-amber-400">3. Set Environment</span>
                <button
                  onClick={handleCopyEnv}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Add <code className="px-1 py-0.5 bg-slate-100 dark:bg-navy-800 rounded font-mono text-[11px]">VITE_SUPABASE_URL</code> and <code className="px-1 py-0.5 bg-slate-100 dark:bg-navy-800 rounded font-mono text-[11px]">VITE_SUPABASE_ANON_KEY</code> to your <code className="px-1 py-0.5 bg-slate-100 dark:bg-navy-800 rounded font-mono text-[11px]">.env</code> file.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
