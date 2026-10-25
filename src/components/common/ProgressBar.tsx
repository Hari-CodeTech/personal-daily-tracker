import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0 to 100
  color?: 'brand' | 'blue' | 'amber' | 'rose' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  value,
  color = 'brand',
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, isNaN(value) ? 0 : value))

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colorClasses = {
    brand: 'bg-emerald-500 dark:bg-emerald-400',
    blue: 'bg-blue-500 dark:bg-blue-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    rose: 'bg-rose-500 dark:bg-rose-400',
    purple: 'bg-purple-500 dark:bg-purple-400',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span className="font-mono">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden', heightClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colorClasses[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
