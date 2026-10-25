import React, { useState } from 'react'
import { Bell, CheckCircle2, AlertCircle, Clock, X, Volume2, Shield } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { formatMinutesToHours } from '@/lib/utils'

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { todaySchedule, settings, updateSettings } = useTracker()
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  )

  if (!isOpen) return null

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission()
      setNotificationPermission(perm)
      if (perm === 'granted') {
        new Notification('My Daily Tracker Reminders Enabled', {
          body: 'You will receive timely reminders for your daily study targets, job applications, and routines.',
          icon: '/favicon.svg'
        })
      }
    }
  }

  // Pending reminder items (activities scheduled for today that are not yet completed)
  const pendingTasks = todaySchedule.filter(t => t.is_required && t.status !== 'completed')
  const completedTasks = todaySchedule.filter(t => t.status === 'completed')

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="bg-white dark:bg-navy-950 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-navy-800 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Daily Reminders</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Timezone: <span className="font-medium text-slate-700 dark:text-slate-300">{settings.timezone || 'Asia/Kolkata'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Browser Notification Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Browser Desktop Notifications
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
              }`}>
                {notificationPermission}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {notificationPermission === 'granted'
                ? 'Desktop notifications are active. Reminders trigger at your configured daily checkpoint times.'
                : 'Enable system notifications so you never miss your study blocks or daily job applications target.'}
            </p>

            {notificationPermission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
              >
                Enable Notifications
              </button>
            )}
          </div>

          {/* Pending Tasks Requiring Attention */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pending Today ({pendingTasks.length})
              </h4>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Incomplete</span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  All today's tasks completed!
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Outstanding discipline!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {task.is_sensitive ? 'Private Commitment' : task.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{task.target_display}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Checkpoints */}
          {completedTasks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Completed Checkpoints ({completedTasks.length})
              </h4>
              <div className="space-y-1.5 opacity-80">
                {completedTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-navy-900 bg-slate-50 dark:bg-navy-900/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs text-slate-600 dark:text-slate-400 line-through">
                        {task.is_sensitive ? 'Private Commitment' : task.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Done</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
