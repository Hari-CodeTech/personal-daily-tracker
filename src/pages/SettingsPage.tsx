import React, { useState } from 'react'
import { Settings as SettingsIcon, Save, Calendar, Clock, Globe, Shield, Moon, Sun, Bell } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

export function SettingsPage() {
  const { settings, updateSettings } = useTracker()
  const { theme, toggleTheme } = useTheme()
  const { user, profile } = useAuth()

  const [javaMins, setJavaMins] = useState(settings.java_target_minutes || 120)
  const [dsaMins, setDsaMins] = useState(settings.dsa_target_minutes || 120)
  const [dsaCount, setDsaCount] = useState(settings.dsa_target_count || 3)
  const [techMins, setTechMins] = useState(settings.tech_target_minutes || 60)
  const [alternatingStartDate, setAlternatingStartDate] = useState(settings.alternating_start_date || '2026-10-25')
  const [alternatingSubject, setAlternatingSubject] = useState(settings.alternating_start_subject || 'mysql')
  const [jobTarget, setJobTarget] = useState(settings.job_applications_daily_target || 10)
  const [skippingTarget, setSkippingTarget] = useState(settings.skipping_target_value || 1000)
  const [waterTarget, setWaterTarget] = useState(settings.water_target_liters || 2.5)
  const [sleepTarget, setSleepTarget] = useState(settings.sleep_target_hours || 7.0)
  const [igLimit, setIgLimit] = useState(settings.instagram_limit_minutes || 60)
  const [ytLimit, setYtLimit] = useState(settings.youtube_limit_minutes || 60)
  const [timezone, setTimezone] = useState(settings.timezone || 'Asia/Kolkata')
  const [challengeStartDate, setChallengeStartDate] = useState(settings.challenge_start_date || '2026-10-25')
  const [remindersEnabled, setRemindersEnabled] = useState(settings.reminders_enabled ?? true)

  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault()

    await updateSettings({
      java_target_minutes: Number(javaMins),
      dsa_target_minutes: Number(dsaMins),
      dsa_target_count: Number(dsaCount),
      tech_target_minutes: Number(techMins),
      alternating_start_date: alternatingStartDate,
      alternating_start_subject: alternatingSubject as any,
      job_applications_daily_target: Number(jobTarget),
      skipping_target_value: Number(skippingTarget),
      water_target_liters: Number(waterTarget),
      sleep_target_hours: Number(sleepTarget),
      instagram_limit_minutes: Number(igLimit),
      youtube_limit_minutes: Number(ytLimit),
      timezone,
      challenge_start_date: challengeStartDate,
      reminders_enabled: remindersEnabled
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Settings & Scheduling Configuration
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300">
              Customizable
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Historical records remain completely intact when target settings are changed.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            Settings saved successfully! ✓
          </span>
        )}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Study Targets */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Curriculum Duration Targets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Java Daily Duration (Mins)
              </label>
              <input
                type="number"
                min="15"
                max="360"
                value={javaMins}
                onChange={e => setJavaMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                DSA Problem Target (Count)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={dsaCount}
                onChange={e => setDsaCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Frontend / Backend Tech (Mins)
              </label>
              <input
                type="number"
                min="15"
                max="240"
                value={techMins}
                onChange={e => setTechMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Alternating MySQL & Interview Schedule Anchor */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            Continuous Alternating Schedule Anchor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Defines the anchor date from which MySQL and Interview Prep alternate continuously across weeks without resetting.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Alternating Anchor Start Date
              </label>
              <input
                type="date"
                value={alternatingStartDate}
                onChange={e => setAlternatingStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Subject on Anchor Date
              </label>
              <select
                value={alternatingSubject}
                onChange={e => setAlternatingSubject(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-semibold"
              >
                <option value="mysql">MySQL & Database Practice</option>
                <option value="interview_prep">Interview Preparation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Daily Job Targets & Health Goals */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
            Daily Output & Physical Requirements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Job Applications Target (Daily)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={jobTarget}
                onChange={e => setJobTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Skipping Target (Skips)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={skippingTarget}
                onChange={e => setSkippingTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Hydration Target (Litres)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="6"
                value={waterTarget}
                onChange={e => setWaterTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Sleep Target (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="12"
                value={sleepTarget}
                onChange={e => setSleepTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Instagram Max Limit (Mins)
              </label>
              <input
                type="number"
                min="10"
                max="180"
                value={igLimit}
                onChange={e => setIgLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                YouTube Max Limit (Mins)
              </label>
              <input
                type="number"
                min="10"
                max="180"
                value={ytLimit}
                onChange={e => setYtLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Challenge & Timezone */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            Localization & 365 Challenge
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Time Zone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                365-Day Challenge Start Date
              </label>
              <input
                type="date"
                value={challengeStartDate}
                onChange={e => setChallengeStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  )
}
