import React, { useState } from 'react'
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { JobApplicationItem } from '@/components/jobs/JobApplicationItem'
import { JobApplicationFormModal } from '@/components/jobs/JobApplicationFormModal'
import { ProgressBar } from '@/components/common/ProgressBar'
import { calculateJobProgress } from '@/lib/jobs'
import { parseISO, isSameWeek, isSameMonth } from 'date-fns'
import type { JobApplication, JobStatus, JobWorkMode } from '@/types/database'

export function JobApplicationsPage() {
  const { jobApplications, settings, selectedDate } = useTracker()
  const [showModal, setShowModal] = useState(false)
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterWorkMode, setFilterWorkMode] = useState<string>('all')

  const target = settings.job_applications_daily_target || 10
  const todayProgress = calculateJobProgress(jobApplications, selectedDate, target)

  // Calculate Weekly and Monthly Totals
  const selectedDateObj = parseISO(selectedDate)
  const weeklyTotal = jobApplications.filter(j => {
    try {
      return j.status !== 'Planned' && isSameWeek(parseISO(j.application_date), selectedDateObj)
    } catch { return false }
  }).length

  const monthlyTotal = jobApplications.filter(j => {
    try {
      return j.status !== 'Planned' && isSameMonth(parseISO(j.application_date), selectedDateObj)
    } catch { return false }
  }).length

  // Filtered List
  const filteredApps = jobApplications.filter(app => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchCompany = app.company_name.toLowerCase().includes(q)
      const matchTitle = app.job_title.toLowerCase().includes(q)
      if (!matchCompany && !matchTitle) return false
    }
    if (filterStatus !== 'all' && app.status !== filterStatus) return false
    if (filterWorkMode !== 'all' && app.work_mode !== filterWorkMode) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Job Application Tracker
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300">
              Target: Minimum 10/day
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consistent pipeline generation for Java Backend & Software Developer roles
          </p>
        </div>

        <button
          onClick={() => {
            setEditingApp(null)
            setShowModal(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log Job Application
        </button>
      </div>

      {/* DAILY TARGET PROGRESS HERO */}
      <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent border border-amber-500/20 dark:border-amber-500/20 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Daily Requirement Progress ({selectedDate})
              </span>
              {todayProgress.isTargetAchieved && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Target Hit! ✓
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-4xl sm:text-5xl font-black font-mono text-slate-900 dark:text-white">
                {todayProgress.completedCount}
              </span>
              <span className="text-xl font-bold text-slate-400">
                / {todayProgress.target} applications
              </span>
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 ml-auto">
                {todayProgress.remainingCount === 0
                  ? 'All 10 Submitted!'
                  : `${todayProgress.remainingCount} more required today`}
              </span>
            </div>

            <ProgressBar
              value={todayProgress.percentage}
              color={todayProgress.isTargetAchieved ? 'brand' : 'amber'}
              size="lg"
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 text-center min-w-32 shadow-subtle">
              <span className="text-xs font-semibold uppercase text-slate-400 block">This Week</span>
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
                {weeklyTotal}
              </span>
              <span className="text-[10px] text-slate-500 block">applications</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 text-center min-w-32 shadow-subtle">
              <span className="text-xs font-semibold uppercase text-slate-400 block">This Month</span>
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
                {monthlyTotal}
              </span>
              <span className="text-[10px] text-slate-500 block">applications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or job title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview scheduled">Interview</option>
            <option value="Assessment received">Assessment</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="Planned">Planned</option>
          </select>

          <select
            value={filterWorkMode}
            onChange={e => setFilterWorkMode(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-navy-800 bg-white/50 dark:bg-navy-900/40">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No applications match criteria</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Hit your 10 daily applications requirement to accelerate your job search!
            </p>
            <button
              onClick={() => {
                setEditingApp(null)
                setShowModal(true)
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Log First Application
            </button>
          </div>
        ) : (
          filteredApps.map(app => (
            <JobApplicationItem
              key={app.id}
              app={app}
              onEdit={a => {
                setEditingApp(a)
                setShowModal(true)
              }}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <JobApplicationFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingApp(null)
        }}
        initialApp={editingApp}
      />
    </div>
  )
}
