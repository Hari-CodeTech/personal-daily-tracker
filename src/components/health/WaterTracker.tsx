import React, { useState } from 'react'
import { Droplet, Plus, Clock, CheckCircle } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { ProgressBar } from '@/components/common/ProgressBar'

export function WaterTracker() {
  const { waterLogs, addWaterLog, healthLogs, settings, selectedDate } = useTracker()
  const [customMl, setCustomMl] = useState(250)

  const todayWaterLogs = waterLogs.filter(w => w.date === selectedDate)
  const currentLiters = healthLogs[selectedDate]?.water_liters ?? 0
  const targetLiters = settings.water_target_liters || 2.5
  const percentage = Math.min(100, Math.round((currentLiters / targetLiters) * 100))
  const isGoalReached = currentLiters >= targetLiters

  const handleAdd = (amount: number) => {
    addWaterLog(amount, selectedDate)
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Daily Hydration Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target: {targetLiters} Litres per day
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          isGoalReached
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
            : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300'
        }`}>
          {isGoalReached ? 'Target Reached ✓' : `${(targetLiters - currentLiters).toFixed(2)} L Remaining`}
        </span>
      </div>

      {/* Progress & Current Volume */}
      <div className="text-center py-4 bg-cyan-50/40 dark:bg-navy-950/60 rounded-3xl border border-cyan-100/50 dark:border-navy-800 mb-5">
        <div className="text-4xl sm:text-5xl font-black font-mono text-cyan-600 dark:text-cyan-400">
          {currentLiters.toFixed(2)} <span className="text-xl font-bold text-slate-500 dark:text-slate-400">/ {targetLiters} L</span>
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          {percentage}% of daily hydration requirement
        </p>
        <div className="max-w-md mx-auto px-6 mt-3">
          <ProgressBar value={percentage} color="blue" size="md" />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <button
          onClick={() => handleAdd(250)}
          className="py-2.5 px-3 rounded-2xl bg-cyan-50/70 dark:bg-navy-800 border border-cyan-200/50 dark:border-navy-700 hover:bg-cyan-100 text-xs font-semibold text-cyan-800 dark:text-cyan-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          +250 ml (Glass)
        </button>

        <button
          onClick={() => handleAdd(500)}
          className="py-2.5 px-3 rounded-2xl bg-cyan-50/70 dark:bg-navy-800 border border-cyan-200/50 dark:border-navy-700 hover:bg-cyan-100 text-xs font-semibold text-cyan-800 dark:text-cyan-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          +500 ml (Bottle)
        </button>

        <button
          onClick={() => handleAdd(1000)}
          className="py-2.5 px-3 rounded-2xl bg-cyan-50/70 dark:bg-navy-800 border border-cyan-200/50 dark:border-navy-700 hover:bg-cyan-100 text-xs font-semibold text-cyan-800 dark:text-cyan-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          +1000 ml (Jug)
        </button>

        <div className="flex items-center gap-1">
          <input
            type="number"
            min="50"
            step="50"
            value={customMl}
            onChange={e => setCustomMl(Number(e.target.value))}
            className="w-full py-2 px-2 text-xs font-mono font-bold rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-center"
          />
          <button
            onClick={() => handleAdd(customMl)}
            className="p-2 rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700 text-xs font-bold shrink-0"
            title="Add Custom ml"
          >
            Add
          </button>
        </div>
      </div>

      {/* Logs History for selected date */}
      {todayWaterLogs.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-navy-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Today's Water Entries ({todayWaterLogs.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {todayWaterLogs.map((log, index) => (
              <span
                key={log.id || index}
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300"
              >
                <Droplet className="w-3 h-3 text-cyan-500" />
                +{log.amount_ml}ml
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
