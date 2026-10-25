import React, { useState } from 'react'
import { X, Briefcase, AlertTriangle, ExternalLink } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import type { JobApplication, JobStatus, JobWorkMode } from '@/types/database'
import { findDuplicateApplication } from '@/lib/jobs'

interface JobApplicationFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialApp?: JobApplication | null
}

const SOURCES = ['LinkedIn', 'Indeed', 'Naukri', 'Company Site', 'Wellfound / AngelList', 'Instahyre', 'Referral', 'Other']
const STATUSES: JobStatus[] = ['Planned', 'Applied', 'Assessment received', 'Interview scheduled', 'Rejected', 'Selected', 'Withdrawn']
const WORK_MODES: JobWorkMode[] = ['Remote', 'Hybrid', 'Onsite']

export function JobApplicationFormModal({ isOpen, onClose, initialApp }: JobApplicationFormModalProps) {
  const { addJobApplication, updateJobApplication, jobApplications, selectedDate } = useTracker()

  const [companyName, setCompanyName] = useState(initialApp?.company_name || '')
  const [jobTitle, setJobTitle] = useState(initialApp?.job_title || '')
  const [applicationUrl, setApplicationUrl] = useState(initialApp?.application_url || '')
  const [applicationDate, setApplicationDate] = useState(initialApp?.application_date || selectedDate)
  const [location, setLocation] = useState(initialApp?.location || '')
  const [workMode, setWorkMode] = useState<JobWorkMode>(initialApp?.work_mode || 'Remote')
  const [jobSource, setJobSource] = useState(initialApp?.job_source || 'LinkedIn')
  const [status, setStatus] = useState<JobStatus>(initialApp?.status || 'Applied')
  const [notes, setNotes] = useState(initialApp?.notes || '')
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCheckDuplicate = () => {
    if (!companyName.trim() || !jobTitle.trim()) return
    const dup = findDuplicateApplication(
      {
        company_name: companyName,
        job_title: jobTitle,
        application_url: applicationUrl,
        application_date: applicationDate
      },
      jobApplications,
      initialApp?.id
    )

    if (dup) {
      setDuplicateWarning(`Note: You already applied to ${dup.company_name} (${dup.job_title}) on ${dup.application_date}.`)
    } else {
      setDuplicateWarning(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || !jobTitle.trim()) return

    if (initialApp) {
      await updateJobApplication(initialApp.id, {
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        application_url: applicationUrl.trim() || undefined,
        application_date: applicationDate,
        location: location.trim() || undefined,
        work_mode: workMode,
        job_source: jobSource,
        status,
        notes: notes.trim() || undefined
      })
    } else {
      await addJobApplication({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        application_url: applicationUrl.trim() || undefined,
        application_date: applicationDate,
        location: location.trim() || undefined,
        work_mode: workMode,
        job_source: jobSource,
        status,
        notes: notes.trim() || undefined
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {initialApp ? 'Edit Job Application' : 'Log Job Application'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target: Minimum 10 applications submitted daily
            </p>
          </div>
        </div>

        {duplicateWarning && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Duplicate Warning: </span>
              {duplicateWarning}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Swiggy, TCS, Oracle, Startup..."
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                onBlur={handleCheckDuplicate}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Role / Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Java Developer, Backend Engineer..."
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                onBlur={handleCheckDuplicate}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Application Link / Posting URL
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/jobs/view/... or company career portal"
              value={applicationUrl}
              onChange={e => setApplicationUrl(e.target.value)}
              onBlur={handleCheckDuplicate}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Date Applied
              </label>
              <input
                type="date"
                required
                value={applicationDate}
                onChange={e => setApplicationDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={e => setWorkMode(e.target.value as JobWorkMode)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                {WORK_MODES.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Source
              </label>
              <select
                value={jobSource}
                onChange={e => setJobSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                {SOURCES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as JobStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                * Applications marked 'Applied' or beyond count towards today's target of 10.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore, Hyderabad, Remote..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Notes / Referral Contact
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Applied with tailored resume for Spring Boot role. Follow up on Thursday."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
            />
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
              {initialApp ? 'Save Changes' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
