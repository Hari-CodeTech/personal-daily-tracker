import React from 'react'
import { Loader2, Inbox, AlertCircle, RefreshCw } from 'lucide-react'

export function LoadingState({ message = 'Loading records...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}

export function EmptyState({
  title = 'No records found',
  description = 'Get started by creating your first record.',
  icon,
  action,
}: {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-navy-800 bg-white/50 dark:bg-navy-900/40">
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400 mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while processing your request.',
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20">
      <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mt-1 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  )
}
