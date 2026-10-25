import React, { useState } from 'react'
import { CheckSquare, Plus, Shield, Eye, EyeOff, Sparkles, Filter } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { HabitItem } from '@/components/habits/HabitItem'
import { SocialMediaTracker } from '@/components/habits/SocialMediaTracker'
import { HabitFormModal } from '@/components/habits/HabitFormModal'
import type { Habit, HabitCategory } from '@/types/database'

export function HabitsPage() {
  const { habits, habitLogs, selectedDate } = useTracker()
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const activeHabits = habits.filter(h => !h.is_archived)

  const disciplineHabits = activeHabits.filter(h => h.category === 'discipline')
  const otherHabits = activeHabits.filter(h => h.category !== 'discipline' && h.category !== 'social_media')

  const filteredList = filterCategory === 'all'
    ? activeHabits
    : activeHabits.filter(h => h.category === filterCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Habits & Discipline Tracker
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300">
              Personal Standards
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build unshakeable daily routines. Non-judgmental, private self-mastery tracking.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHabit(null)
            setShowFormModal(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Custom Habit
        </button>
      </div>

      {/* Social Media Strict Control Section */}
      <SocialMediaTracker />

      {/* Personal Discipline (Avoidance Commitments) */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-navy-800 mb-4">
          <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Personal Discipline & Avoidance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Maintained strictly private. Commitments to freedom from dopamine traps and sugar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {disciplineHabits.map(habit => {
            const log = habitLogs.find(l => l.habit_id === habit.id && l.date && l.date.slice(0, 10) === selectedDate.slice(0, 10))
            return (
              <HabitItem
                key={habit.id}
                habit={habit}
                log={log}
                onEdit={h => {
                  setEditingHabit(h)
                  setShowFormModal(true)
                }}
              />
            )
          })}
        </div>
      </div>

      {/* All Other Habits (Fitness, Health, Custom Routines) */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-navy-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Daily Routines & Fitness
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skipping, hydration, sleep, meditation, and personal growth habits
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto">
            {['all', 'fitness', 'health', 'custom'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                  filterCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {otherHabits
            .filter(h => filterCategory === 'all' || h.category === filterCategory)
            .map(habit => {
              const log = habitLogs.find(l => l.habit_id === habit.id && l.date && l.date.slice(0, 10) === selectedDate.slice(0, 10))
              return (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  log={log}
                  onEdit={h => {
                    setEditingHabit(h)
                    setShowFormModal(true)
                  }}
                />
              )
            })}
        </div>
      </div>

      {/* Habit Create / Edit Modal */}
      <HabitFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setEditingHabit(null)
        }}
        initialHabit={editingHabit}
      />
    </div>
  )
}
