import React, { useState } from 'react'
import {
  Database,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Terminal,
  FileCode,
  Key,
  Globe,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

export function SetupInstructionsPage() {
  const { isConfigured, isDemoMode, enableDemoMode } = useAuth()
  const [copiedEnv, setCopiedEnv] = useState(false)
  const [copiedSql, setCopiedSql] = useState(false)

  const envSample = `VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample)
    setCopiedEnv(true)
    setTimeout(() => setCopiedEnv(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Supabase Backend & Security Configuration
          </h2>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            isConfigured
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
          }`}>
            {isConfigured ? 'Status: Connected ✓' : 'Status: Configuration Pending'}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Follow these 3 simple steps to connect your own Supabase project for real authentication, persistent database storage, and Row Level Security (RLS).
        </p>
      </div>

      {/* Step 1: Create Supabase Project */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Create a Free Supabase Project
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Free cloud PostgreSQL with built-in Auth & RLS
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          1. Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> and sign in with GitHub or email.<br />
          2. Click <strong>"New Project"</strong>, give it a name like <code className="font-mono bg-slate-100 dark:bg-navy-800 px-1 py-0.5 rounded">my-daily-tracker</code>, set a database password, and select your preferred region.
        </p>
      </div>

      {/* Step 2: Execute SQL Migration Schema */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Run Database Schema & RLS Policies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Creates tables, constraints, indexes, RLS security policies, and signup trigger
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          In your Supabase dashboard, click on <strong>SQL Editor</strong> in the left sidebar, click <strong>"New query"</strong>, and run the complete SQL script located in your project at:
        </p>

        <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs flex justify-between items-center mb-3">
          <span>supabase/migrations/20261025000000_initial_schema.sql</span>
          <span className="text-emerald-400 text-[11px]">✓ Ready in workspace</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          This single script creates: User Profiles, Settings, Habits, Daily Logs, Study Sessions, DSA Problems, Job Applications, Health Logs, Water Logs, Reflections, and Tomorrow Plans with Row Level Security enforcing user isolation.
        </p>
      </div>

      {/* Step 3: Add Credentials to .env */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Configure Environment Variables
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                In Supabase: Project Settings → API → Copy URL & Anon Key
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyEnv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300"
          >
            {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedEnv ? 'Copied' : 'Copy Example'}
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          Create a file named <code className="font-mono bg-slate-100 dark:bg-navy-800 px-1 py-0.5 rounded font-bold">.env</code> in the project root directory and add:
        </p>

        <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
{envSample}
        </pre>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
          Note: Never use the service_role key in frontend code. The anon key combined with RLS protects all records securely.
        </p>
      </div>

      {/* Deployment & Offline Mode Info */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-navy-800/40 border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Explore with Local Storage Persistence
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            You can also test all features immediately in your browser; all data saves locally.
          </p>
        </div>

        <button
          onClick={() => {
            enableDemoMode()
            alert('Local preview mode enabled! You can now explore the dashboard and all tracking pages.')
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
        >
          Enable Local Preview Mode
        </button>
      </div>
    </div>
  )
}
