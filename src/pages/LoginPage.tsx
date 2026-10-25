import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Target, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function LoginPage() {
  const { signIn, isConfigured, enableDemoMode } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
  }

  const handleExploreOffline = () => {
    enableDemoMode()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-3">
          <Target className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          My Daily Tracker
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Build Discipline. Track Progress. Become Better Every Day.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-navy-900 py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-slate-200/80 dark:border-navy-800/80">
          {!isConfigured && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold block mb-1">Supabase Credentials Not Yet Set</span>
              <p className="leading-relaxed">
                To connect to real Supabase Auth, add your project credentials to <code className="font-mono bg-white/50 px-1 py-0.5 rounded">.env</code>.
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  to="/setup"
                  className="font-bold underline hover:text-amber-950 dark:hover:text-white"
                >
                  View Setup Instructions →
                </Link>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleExploreOffline}
                  className="font-bold underline text-emerald-700 dark:text-emerald-400"
                >
                  Explore in Local Preview
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-navy-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
