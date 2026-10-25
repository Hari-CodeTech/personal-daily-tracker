import React, { useState } from 'react'
import { Dumbbell, Plus, Trash2, Heart, Check, Sparkles, Activity } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import type { WorkoutDetail } from '@/types/database'

export function WorkoutLogger() {
  const { healthLogs, updateHealthLog, settings, selectedDate } = useTracker()
  const todayHealth = healthLogs[selectedDate.slice(0, 10)]
  const skipsCountVal = todayHealth?.skipping_count ?? 0

  const [skipsCount, setSkipsCount] = useState<number>(skipsCountVal)
  const [exerciseName, setExerciseName] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(12)
  const [exerciseDuration, setExerciseDuration] = useState(15)

  React.useEffect(() => {
    setSkipsCount(todayHealth?.skipping_count ?? 0)
  }, [todayHealth?.skipping_count, selectedDate])

  const skippingTarget = settings.skipping_target_value || 1000
  const isSkippingDone = skipsCountVal >= skippingTarget
  const isSkippingInProgress = skipsCountVal > 0 && !isSkippingDone

  const handleSaveSkipping = async () => {
    await updateHealthLog(selectedDate, { skipping_count: Number(skipsCount) })
  }

  const handleToggleHabitCommitment = async (
    key: 'no_sugar_maintained' | 'junk_food_avoided' | 'skincare_done' | 'haircare_done'
  ) => {
    const current = todayHealth ? todayHealth[key] : false
    await updateHealthLog(selectedDate, { [key]: !current })
  }

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exerciseName.trim()) return

    const newDetail: WorkoutDetail = {
      id: 'ex-' + Date.now(),
      exercise: exerciseName.trim(),
      sets: Number(sets),
      reps: Number(reps),
      duration_minutes: Number(exerciseDuration)
    }

    const currentDetails = todayHealth?.workout_details || []
    await updateHealthLog(selectedDate, {
      workout_details: [...currentDetails, newDetail]
    })

    setExerciseName('')
  }

  const handleDeleteExercise = async (id: string) => {
    const currentDetails = todayHealth?.workout_details || []
    await updateHealthLog(selectedDate, {
      workout_details: currentDetails.filter(e => e.id !== id)
    })
  }

  return (
    <div className="space-y-6">
      {/* Skipping Tracker */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Daily Skipping Commitment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target: {skippingTarget} skips (synchronized with Habits page)
              </p>
            </div>
          </div>

          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            isSkippingDone
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
              : isSkippingInProgress
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
              : 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300'
          }`}>
            {isSkippingDone
              ? 'Completed ✓'
              : isSkippingInProgress
              ? `${skipsCountVal}/${skippingTarget} skips (${Math.max(0, skippingTarget - skipsCountVal)} Remaining)`
              : `0 / ${skippingTarget} (Not Started)`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Recorded Skips:
          </span>
          <input
            type="number"
            min="0"
            step="100"
            value={skipsCount}
            onChange={e => setSkipsCount(Number(e.target.value))}
            className="w-32 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold text-center"
          />
          <button
            type="button"
            onClick={handleSaveSkipping}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
          >
            Update Skips
          </button>
        </div>
      </div>

      {/* Health Discipline Commitments */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          Nutrition & Self-Care Commitments
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* No Sugar */}
          <button
            type="button"
            onClick={() => handleToggleHabitCommitment('no_sugar_maintained')}
            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              todayHealth?.no_sugar_maintained
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-navy-800/40 border-slate-200 dark:border-navy-800'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">No Sugar Commitment</span>
              <span className="text-[11px] text-slate-500">Zero refined sugar consumed</span>
            </div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
              todayHealth?.no_sugar_maintained ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-navy-600'
            }`}>
              {todayHealth?.no_sugar_maintained && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Junk Food */}
          <button
            type="button"
            onClick={() => handleToggleHabitCommitment('junk_food_avoided')}
            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              todayHealth?.junk_food_avoided
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-navy-800/40 border-slate-200 dark:border-navy-800'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Junk Food Avoided</span>
              <span className="text-[11px] text-slate-500">Clean, whole food nutrition</span>
            </div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
              todayHealth?.junk_food_avoided ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-navy-600'
            }`}>
              {todayHealth?.junk_food_avoided && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Skincare */}
          <button
            type="button"
            onClick={() => handleToggleHabitCommitment('skincare_done')}
            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              todayHealth?.skincare_done
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-navy-800/40 border-slate-200 dark:border-navy-800'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Skincare Routine</span>
              <span className="text-[11px] text-slate-500">Cleansing & sun protection</span>
            </div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
              todayHealth?.skincare_done ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-navy-600'
            }`}>
              {todayHealth?.skincare_done && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Haircare */}
          <button
            type="button"
            onClick={() => handleToggleHabitCommitment('haircare_done')}
            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              todayHealth?.haircare_done
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-navy-800/40 border-slate-200 dark:border-navy-800'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Haircare Routine</span>
              <span className="text-[11px] text-slate-500">Oiling or routine maintenance</span>
            </div>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
              todayHealth?.haircare_done ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-navy-600'
            }`}>
              {todayHealth?.haircare_done && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        </div>
      </div>

      {/* Workout Exercises Log */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-navy-800 mb-4">
          <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Workout Exercises
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Strength training, calisthenics, and cardio
            </p>
          </div>
        </div>

        {/* Add Exercise Form */}
        <form onSubmit={handleAddExercise} className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="Exercise (e.g. Pushups, Squats, Pullups)..."
              value={exerciseName}
              onChange={e => setExerciseName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Sets"
              min="1"
              value={sets}
              onChange={e => setSets(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono text-center"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Reps"
              min="1"
              value={reps}
              onChange={e => setReps(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono text-center"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Add Set
            </button>
          </div>
        </form>

        {/* Exercises List */}
        {todayHealth?.workout_details && todayHealth.workout_details.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-navy-800">
            {todayHealth.workout_details.map(ex => (
              <div key={ex.id} className="py-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {ex.exercise}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {ex.sets} sets × {ex.reps} reps
                  </span>
                  <button
                    onClick={() => handleDeleteExercise(ex.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No strength training exercises logged for today.</p>
        )}
      </div>
    </div>
  )
}
