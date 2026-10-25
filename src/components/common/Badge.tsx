import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
