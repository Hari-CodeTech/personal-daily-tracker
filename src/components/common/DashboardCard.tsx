import React from 'react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  subtitle?: string
  value?: string | number
  subtext?: string
  icon?: React.ReactNode
  iconBg?: string
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  badge?: React.ReactNode
  trend?: {
    value: string
    isPositive?: boolean
  }
}

export function DashboardCard({
  title,
  subtitle,
  value,
  subtext,
  icon,
  iconBg = 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300',
  onClick,
  children,
  className,
  badge,
  trend,
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-2xl p-5 shadow-subtle hover:shadow-card transition-all duration-200 relative overflow-hidden',
        onClick && 'cursor-pointer hover:border-slate-300 dark:hover:border-navy-700 active:scale-[0.99]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </span>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{subtitle}</p>
          )}

          {value !== undefined && (
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-sans">
                {value}
              </span>
              {trend && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                  )}
                >
                  {trend.value}
                </span>
              )}
            </div>
          )}

          {subtext && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtext}
            </p>
          )}
        </div>

        {icon && (
          <div className={cn('p-2.5 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
            {icon}
          </div>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
