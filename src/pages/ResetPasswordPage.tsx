import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Target, Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function ResetPasswordPage() {
  const { resetPassword, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await resetPassword(email)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-3">
          <Target className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Enter your email to receive a password recovery link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-navy-900 py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-slate-200/80 dark:border-navy-800/80">
          {success ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recovery Link Sent
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If an account exists for {email}, a password reset link has been dispatched.
              </p>
              <Link
                to="/login"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-navy-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
