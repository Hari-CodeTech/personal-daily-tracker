import React, { useState } from 'react'
import { Check, Eye, EyeOff, ShieldCheck, Flame, Trash2, Edit2, Loader2 } from 'lucide-react'
import type { Habit, DailyHabitLog } from '@/types/database'
import { useTracker } from '@/context/TrackerContext'
import { Badge } from '@/components/common/Badge'

interface HabitItemProps {
  habit: Habit
  log?: DailyHabitLog
  onEdit?: (habit: Habit) => void
}

export function HabitItem({ habit, log, onEdit }: HabitItemProps) {
  const { toggleHabitCompletion, setHabitNumericValue, archiveHabit, selectedDate, savingHabitId } = useTracker()
  const [hideSensitiveText, setHideSensitiveText] = useState(habit.is_sensitive)
  const [numericInput, setNumericInput] = useState(log?.numeric_value ?? 0)

  React.useEffect(() => {
    setNumericInput(log?.numeric_value ?? 0)
  }, [log?.numeric_value, selectedDate])

  const isCompleted = log?.is_completed ?? false
  const isSaving = savingHabitId === habit.id

  const handleToggle = () => {
    if (isSaving) return
    toggleHabitCompletion(habit.id, selectedDate)
  }

  const handleNumericBlur = () => {
    setHabitNumericValue(habit.id, Number(numericInput), selectedDate)
  }

  const getCategoryColor = (cat: Habit['category']) => {
    switch (cat) {
      case 'discipline':
        return 'purple'
      case 'fitness':
        return 'warning'
      case 'health':
        return 'info'
      case 'social_media':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isCompleted
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40'
          : 'bg-white dark:bg-navy-900 border-slate-200/80 dark:border-navy-800/80 hover:border-slate-300 dark:hover:border-navy-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isSaving}
          className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center transition-all shrink-0 ${
            isSaving ? 'opacity-60 cursor-wait' : ''
          } ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'border-2 border-slate-300 dark:border-navy-700 text-transparent hover:border-emerald-500'
          }`}
          title={isSaving ? 'Saving to database...' : isCompleted ? 'Mark uncompleted' : 'Mark completed'}
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500 dark:text-emerald-400" />
          ) : (
            <Check className={`w-3.5 h-3.5 stroke-[3] ${isCompleted ? 'block' : 'hidden'}`} />
          )}
        </button>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold truncate ${
                isCompleted
                  ? 'text-slate-800 dark:text-slate-200 font-bold'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {hideSensitiveText ? 'Private Self-Discipline Commitment' : habit.title}
            </span>

            {habit.is_sensitive && (
              <button
                type="button"
                onClick={() => setHideSensitiveText(!hideSensitiveText)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                title={hideSensitiveText ? 'Show habit title' : 'Hide habit title'}
              >
                {hideSensitiveText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}

            <Badge variant={getCategoryColor(habit.category)}>
              {habit.category.replace('_', ' ')}
            </Badge>

            {habit.is_required && (
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                Required
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {habit.tracking_type === 'avoidance' ? (
              <span>Commitment: Maintain avoidance</span>
            ) : habit.target_value ? (
              <span>
                Target: {habit.target_value} {habit.target_unit || ''}
              </span>
            ) : (
              <span>Daily goal</span>
            )}

            {/* Numeric or Duration input */}
            {(habit.tracking_type === 'numeric' || habit.tracking_type === 'duration') && (
              <div className="inline-flex items-center gap-1.5 ml-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">Recorded:</span>
                <input
                  type="number"
                  min="0"
                  value={numericInput}
                  onChange={e => setNumericInput(Number(e.target.value))}
                  onBlur={handleNumericBlur}
                  className="w-16 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-xs font-mono text-center font-bold"
                />
                <span>{habit.target_unit || ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(habit)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              title="Edit habit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => archiveHabit(habit.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Archive habit (preserves historical logs)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
