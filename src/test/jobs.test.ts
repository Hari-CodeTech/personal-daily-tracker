import { describe, it, expect } from 'vitest'
import { calculateJobProgress, findDuplicateApplication } from '@/lib/jobs'
import type { JobApplication } from '@/types/database'

describe('Job Application Target and Duplicate Detection', () => {
  it('calculates daily progress accurately towards target of 10', () => {
    const apps: JobApplication[] = [
      {
        id: '1',
        user_id: 'u1',
        company_name: 'Google',
        job_title: 'SDE 1',
        application_date: '2026-10-25',
        work_mode: 'Remote',
        job_source: 'LinkedIn',
        status: 'Applied',
        created_at: '2026-10-25'
      },
      {
        id: '2',
        user_id: 'u1',
        company_name: 'Amazon',
        job_title: 'Software Dev',
        application_date: '2026-10-25',
        work_mode: 'Hybrid',
        job_source: 'Company Site',
        status: 'Interview scheduled',
        created_at: '2026-10-25'
      },
      {
        id: '3',
        user_id: 'u1',
        company_name: 'Microsoft',
        job_title: 'Frontend Eng',
        application_date: '2026-10-25',
        work_mode: 'Remote',
        job_source: 'Indeed',
        status: 'Planned', // Planned does NOT count toward submitted target!
        created_at: '2026-10-25'
      },
      {
        id: '4',
        user_id: 'u1',
        company_name: 'Apple',
        job_title: 'iOS Dev',
        application_date: '2026-10-24', // Different date
        work_mode: 'Onsite',
        job_source: 'Referral',
        status: 'Applied',
        created_at: '2026-10-24'
      }
    ]

    const progress = calculateJobProgress(apps, '2026-10-25', 10)
    expect(progress.target).toBe(10)
    expect(progress.completedCount).toBe(2) // Google and Amazon
    expect(progress.remainingCount).toBe(8)
    expect(progress.percentage).toBe(20)
    expect(progress.isTargetAchieved).toBe(false)
  })

  it('detects duplicate applications based on company and role or URL', () => {
    const existing: JobApplication[] = [
      {
        id: 'app-1',
        user_id: 'u1',
        company_name: 'Infosys',
        job_title: 'Java Developer',
        application_url: 'https://careers.infosys.com/job/123',
        application_date: '2026-10-25',
        work_mode: 'Hybrid',
        job_source: 'LinkedIn',
        status: 'Applied',
        created_at: '2026-10-25'
      }
    ]

    // Same company and title on same date
    const dupByCompanyRole = findDuplicateApplication(
      {
        company_name: 'Infosys',
        job_title: 'Java Developer',
        application_date: '2026-10-25'
      },
      existing
    )
    expect(dupByCompanyRole).toBeDefined()
    expect(dupByCompanyRole?.id).toBe('app-1')

    // Same URL
    const dupByUrl = findDuplicateApplication(
      {
        company_name: 'Infosys Corp',
        job_title: 'Backend Engineer',
        application_url: 'https://careers.infosys.com/job/123',
        application_date: '2026-10-25'
      },
      existing
    )
    expect(dupByUrl).toBeDefined()
    expect(dupByUrl?.id).toBe('app-1')

    // Distinct application to different role
    const nonDup = findDuplicateApplication(
      {
        company_name: 'Infosys',
        job_title: 'DevOps Engineer',
        application_url: 'https://careers.infosys.com/job/456',
        application_date: '2026-10-25'
      },
      existing
    )
    expect(nonDup).toBeNull()
  })
})
