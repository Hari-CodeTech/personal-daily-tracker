import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Briefcase,
  HeartPulse,
  Moon,
  Flame,
  Calendar,
  BarChart3,
  Settings,
  Target,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTracker } from '@/context/TrackerContext'

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Habits & Discipline', path: '/habits', icon: CheckSquare },
  { name: 'Study Planner', path: '/study', icon: BookOpen },
  { name: 'Job Applications', path: '/jobs', icon: Briefcase, badge: '10/day' },
  { name: 'Health & Fitness', path: '/health', icon: HeartPulse },
  { name: 'Night Reflection', path: '/reflection', icon: Moon },
  { name: '365 Challenge', path: '/challenge', icon: Flame },
  { name: 'Calendar & History', path: '/calendar', icon: Calendar },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export function Sidebar() {
  const { streakInfo, challengeInfo } = useTracker()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-navy-800/80 bg-white dark:bg-navy-950 p-4 shrink-0 transition-colors">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            My Daily Tracker
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-1">
            Build Discipline Daily
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-navy-900/60'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Streak / Motivation Card */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Current Streak
            </span>
          </div>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
          Longest: <span className="font-semibold text-slate-700 dark:text-slate-300">{streakInfo.longestStreak} days</span> • Consistency is power.
        </p>
      </div>
    </aside>
  )
}
