import React, { useState } from 'react'
import { X, CheckSquare, Plus } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import type { Habit, HabitCategory, HabitTrackingType } from '@/types/database'

interface HabitFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialHabit?: Habit | null
}

export function HabitFormModal({ isOpen, onClose, initialHabit }: HabitFormModalProps) {
  const { addHabit, updateHabit, habits } = useTracker()

  const [title, setTitle] = useState(initialHabit?.title || '')
  const [category, setCategory] = useState<HabitCategory>(initialHabit?.category || 'custom')
  const [trackingType, setTrackingType] = useState<HabitTrackingType>(initialHabit?.tracking_type || 'boolean')
  const [targetValue, setTargetValue] = useState(initialHabit?.target_value ?? 1)
  const [targetUnit, setTargetUnit] = useState(initialHabit?.target_unit || '')
  const [isRequired, setIsRequired] = useState(initialHabit?.is_required ?? true)
  const [isSensitive, setIsSensitive] = useState(initialHabit?.is_sensitive ?? false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (initialHabit) {
      await updateHabit(initialHabit.id, {
        title: title.trim(),
        category,
        tracking_type: trackingType,
        target_value: trackingType === 'boolean' || trackingType === 'avoidance' ? undefined : Number(targetValue),
        target_unit: trackingType === 'boolean' || trackingType === 'avoidance' ? undefined : targetUnit.trim(),
        is_required: isRequired,
        is_sensitive: isSensitive
      })
    } else {
      await addHabit({
        title: title.trim(),
        category,
        tracking_type: trackingType,
        target_value: trackingType === 'boolean' || trackingType === 'avoidance' ? undefined : Number(targetValue),
        target_unit: trackingType === 'boolean' || trackingType === 'avoidance' ? undefined : targetUnit.trim(),
        is_required: isRequired,
        is_sensitive: isSensitive,
        is_archived: false,
        display_order: habits.length + 1
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {initialHabit ? 'Edit Habit' : 'Create Custom Habit'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure daily goals, metrics, and privacy settings
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Habit Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 20-min Meditation, Reading 10 pages, Haircare routine..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="discipline">Personal Discipline</option>
                <option value="fitness">Fitness & Exercise</option>
                <option value="health">Health & Routine</option>
                <option value="social_media">Social Media Control</option>
                <option value="custom">General / Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Tracking Type
              </label>
              <select
                value={trackingType}
                onChange={e => setTrackingType(e.target.value as HabitTrackingType)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="boolean">Yes / No Checkbox</option>
                <option value="avoidance">Avoidance Commitment (Discipline)</option>
                <option value="numeric">Numeric Quantity (e.g. Skips, Pages)</option>
                <option value="duration">Duration (Minutes)</option>
              </select>
            </div>
          </div>

          {(trackingType === 'numeric' || trackingType === 'duration') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Daily Target Value
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetValue}
                  onChange={e => setTargetValue(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Unit Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. skips, mins, pages, glasses"
                  value={targetUnit}
                  onChange={e => setTargetUnit(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs"
                />
              </div>
            </div>
          )}

          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-navy-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={e => setIsRequired(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-navy-700"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Required for daily completion score (mandatory)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSensitive}
                onChange={e => setIsSensitive(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-navy-700"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Mark as sensitive/private (hides name in public UI & notification texts)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
            >
              {initialHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
