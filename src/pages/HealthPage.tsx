import React from 'react'
import { HeartPulse, Droplet, Moon, Activity, Sparkles } from 'lucide-react'
import { WaterTracker } from '@/components/health/WaterTracker'
import { SleepTracker } from '@/components/health/SleepTracker'
import { WorkoutLogger } from '@/components/health/WorkoutLogger'

export function HealthPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Health, Fitness & Vitality
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">
            Physical Peak
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          High-energy foundation for peak programming performance. Single source of truth synchronized with habits.
        </p>
      </div>

      {/* Grid of Health Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Tracker */}
        <WaterTracker />

        {/* Sleep Tracker */}
        <SleepTracker />
      </div>

      {/* Skipping, Workouts & Nutrition Commitments */}
      <WorkoutLogger />
    </div>
  )
}
