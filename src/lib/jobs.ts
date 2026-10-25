import type { JobApplication } from '@/types/database'

export interface JobProgress {
  target: number
  completedCount: number
  remainingCount: number
  percentage: number
  isTargetAchieved: boolean
}

/**
 * Calculates job application progress towards daily target.
 * Only applications with status other than 'Planned' count as applied.
 */
export function calculateJobProgress(
  applications: JobApplication[],
  dateStr: string,
  target: number = 10
): JobProgress {
  const appliedToday = applications.filter(
    app => app.application_date === dateStr && app.status !== 'Planned'
  )

  const completedCount = appliedToday.length
  const remainingCount = Math.max(0, target - completedCount)
  const percentage = Math.min(100, Math.round((completedCount / target) * 100))

  return {
    target,
    completedCount,
    remainingCount,
    percentage,
    isTargetAchieved: completedCount >= target
  }
}

/**
 * Checks if a new job application is a duplicate for the given date
 * based on matching URL, or matching company name + role.
 */
export function findDuplicateApplication(
  newApp: { company_name: string; job_title: string; application_url?: string; application_date: string },
  existingApps: JobApplication[],
  excludeId?: string
): JobApplication | null {
  const normCompany = newApp.company_name.toLowerCase().trim()
  const normTitle = newApp.job_title.toLowerCase().trim()
  const normUrl = newApp.application_url?.toLowerCase().trim()

  for (const existing of existingApps) {
    if (excludeId && existing.id === excludeId) continue

    // URL match
    if (normUrl && existing.application_url && existing.application_url.toLowerCase().trim() === normUrl) {
      return existing
    }

    // Same company + same role on same date
    if (
      existing.application_date === newApp.application_date &&
      existing.company_name.toLowerCase().trim() === normCompany &&
      existing.job_title.toLowerCase().trim() === normTitle
    ) {
      return existing
    }
  }

  return null
}
