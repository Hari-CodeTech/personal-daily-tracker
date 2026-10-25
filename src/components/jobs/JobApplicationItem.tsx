import React from 'react'
import { Briefcase, MapPin, ExternalLink, Calendar, Trash2, Edit2 } from 'lucide-react'
import type { JobApplication, JobStatus } from '@/types/database'
import { useTracker } from '@/context/TrackerContext'
import { Badge } from '@/components/common/Badge'

interface JobApplicationItemProps {
  app: JobApplication
  onEdit: (app: JobApplication) => void
}

const STATUS_VARIANTS: Record<JobStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'> = {
  Planned: 'default',
  Applied: 'info',
  'Assessment received': 'purple',
  'Interview scheduled': 'warning',
  Selected: 'success',
  Rejected: 'danger',
  Withdrawn: 'default',
}

export function JobApplicationItem({ app, onEdit }: JobApplicationItemProps) {
  const { updateJobApplication, deleteJobApplication } = useTracker()

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 hover:border-slate-300 dark:hover:border-navy-700 shadow-subtle transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {app.job_title}
            </h4>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              @ {app.company_name}
            </span>
            <Badge variant={STATUS_VARIANTS[app.status]}>{app.status}</Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap mt-1">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {app.application_date}
            </span>
            <span>•</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {app.work_mode}
            </span>
            {app.location && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {app.location}
                </span>
              </>
            )}
            <span>•</span>
            <span className="bg-slate-100 dark:bg-navy-800 px-2 py-0.5 rounded text-[11px] font-mono">
              {app.job_source}
            </span>
          </div>

          {app.notes && (
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-navy-950/60 p-2 rounded-xl border border-slate-100 dark:border-navy-800/60">
              {app.notes}
            </p>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {app.application_url && (
            <a
              href={app.application_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Open application URL"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <select
            value={app.status}
            onChange={e => updateJobApplication(app.id, { status: e.target.value as JobStatus })}
            className="text-xs font-semibold px-2 py-1 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300"
          >
            <option value="Planned">Planned</option>
            <option value="Applied">Applied</option>
            <option value="Assessment received">Assessment</option>
            <option value="Interview scheduled">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>

          <button
            onClick={() => onEdit(app)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            title="Edit application"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => deleteJobApplication(app.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete application"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
