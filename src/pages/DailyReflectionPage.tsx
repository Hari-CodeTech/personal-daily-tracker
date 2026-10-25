import React from 'react'
import { Moon, Calendar, Sparkles } from 'lucide-react'
import { ReflectionForm } from '@/components/reflection/ReflectionForm'
import { TomorrowPlanForm } from '@/components/reflection/TomorrowPlanForm'

export function DailyReflectionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Night Routine & Self-Reflection
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300">
            Evening Ritual
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Close out today with candid self-review and lock in tomorrow's automated curriculum blueprint.
        </p>
      </div>

      {/* Tomorrow's Plan (Pre-populated) */}
      <TomorrowPlanForm />

      {/* Night Reflection Form */}
      <ReflectionForm />
    </div>
  )
}
