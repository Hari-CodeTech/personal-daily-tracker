import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Briefcase,
  MoreHorizontal,
  HeartPulse,
  Moon,
  Flame,
  Calendar,
  BarChart3,
  Settings,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [showMore, setShowMore] = useState(false)

  const primaryItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Habits', path: '/habits', icon: CheckSquare },
    { name: 'Study', path: '/study', icon: BookOpen },
    { name: 'Jobs (10)', path: '/jobs', icon: Briefcase },
  ]

  const moreItems = [
    { name: 'Health & Fitness', path: '/health', icon: HeartPulse },
    { name: 'Night Reflection', path: '/reflection', icon: Moon },
    { name: '365 Challenge', path: '/challenge', icon: Flame },
    { name: 'Calendar & History', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Drawer */}
      {showMore && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white dark:bg-navy-900 rounded-t-3xl p-5 border-t border-slate-200 dark:border-navy-800 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-navy-800">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">More Pages</span>
              <button
                onClick={() => setShowMore(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {moreItems.map(item => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 p-3 rounded-2xl text-xs font-semibold transition-all',
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
                      )
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-navy-950/90 backdrop-blur-md border-t border-slate-200/80 dark:border-navy-800/80 px-2 py-1.5 flex items-center justify-around">
        {primaryItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </NavLink>
          )
        })}

        <button
          onClick={() => setShowMore(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 font-medium"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>
    </>
  )
}
