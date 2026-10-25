import React, { useState } from 'react'
import {
  Sun,
  Moon,
  Calendar as CalendarIcon,
  Flame,
  ChevronLeft,
  ChevronRight,
  Bell,
  User as UserIcon,
  LogOut,
  Timer,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'
import { format, addDays, subDays, isToday, parseISO } from 'date-fns'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useTracker } from '@/context/TrackerContext'
import { getGreeting, formatDateDisplay } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'

interface HeaderProps {
  onOpenNotifications: () => void
}

export function Header({ onOpenNotifications }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, profile, signOut, isDemoMode } = useAuth()
  const { selectedDate, setSelectedDate, challengeInfo, activeTimer } = useTracker()
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  const selectedDateObj = parseISO(selectedDate)
  const isSelectedToday = isToday(selectedDateObj)

  const handlePrevDay = () => {
    setSelectedDate(format(subDays(selectedDateObj, 1), 'yyyy-MM-dd'))
  }

  const handleNextDay = () => {
    setSelectedDate(format(addDays(selectedDateObj, 1), 'yyyy-MM-dd'))
  }

  const handleGoToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Champion'

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-navy-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Greeting & Current Date */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 m-0">
              {getGreeting()}, <span className="text-emerald-600 dark:text-emerald-400">{displayName}</span>
            </h1>
            {challengeInfo && challengeInfo.currentDay > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Day {challengeInfo.currentDay} / 365
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {formatDateDisplay(selectedDate)}
          </p>
        </div>

        {/* Center: Date Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-900 p-1 rounded-xl border border-slate-200/70 dark:border-navy-800">
          <button
            onClick={handlePrevDay}
            title="Previous Day"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-navy-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleGoToday}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              isSelectedToday
                ? 'bg-white dark:bg-navy-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isSelectedToday ? 'Today' : format(selectedDateObj, 'MMM d')}
          </button>

          <button
            onClick={handleNextDay}
            title="Next Day"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-navy-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions, Timer Status, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2">
          {/* Active study timer indicator */}
          {activeTimer.isRunning && (
            <Link
              to="/study"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse hover:bg-emerald-500/20 transition-all"
            >
              <Timer className="w-3.5 h-3.5" />
              <span className="font-mono">
                {Math.floor(activeTimer.elapsedSeconds / 60)}:
                {(activeTimer.elapsedSeconds % 60).toString().padStart(2, '0')}
              </span>
            </Link>
          )}

          {/* Reminders / Notification Button */}
          <button
            onClick={onOpenNotifications}
            title="Reminders & Notifications"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-navy-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || (isDemoMode ? 'Offline Preview' : 'Authenticated')}
                  </p>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Account & Settings
                </Link>

                <Link
                  to="/setup"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Supabase Setup Guide
                </Link>

                <div className="border-t border-slate-100 dark:border-navy-800 my-1" />

                <button
                  onClick={() => {
                    setProfileOpen(false)
                    signOut()
                    navigate('/login')
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
