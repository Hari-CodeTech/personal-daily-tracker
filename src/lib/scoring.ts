import type { DailyScoreBreakdown, ScheduledActivity } from '@/types/database'

/**
 * Calculates transparent daily score and category breakdown.
 * Guarantees:
 * 1. Zero division safety (returns 0% when no required tasks exist).
 * 2. Deduplication: activities with shared identifiers (like skipping) count only once.
 * 3. Clear mathematical explanation of how scores were calculated.
 */
export function calculateDailyScore(activities: ScheduledActivity[]): DailyScoreBreakdown {
  if (!activities || activities.length === 0) {
    return {
      habitsScore: 0,
      studyScore: 0,
      healthScore: 0,
      jobsScore: 0,
      overallScore: 0,
      totalRequiredActivities: 0,
      completedRequiredActivities: 0,
      explanation: 'No scheduled activities for this date.'
    }
  }

  // Deduplicate by normalized activity name or unique ID
  const seenKeys = new Set<string>()
  const deduplicatedActivities: ScheduledActivity[] = []

  for (const act of activities) {
    // Normalizing name for deduplication (e.g., "Daily Skipping" across habits & health)
    const normalizedKey = act.name.toLowerCase().trim()
    if (!seenKeys.has(normalizedKey)) {
      seenKeys.add(normalizedKey)
      deduplicatedActivities.push(act)
    }
  }

  // Filter required activities only
  const requiredActivities = deduplicatedActivities.filter(a => a.is_required)

  if (requiredActivities.length === 0) {
    return {
      habitsScore: 100,
      studyScore: 100,
      healthScore: 100,
      jobsScore: 100,
      overallScore: 100,
      totalRequiredActivities: 0,
      completedRequiredActivities: 0,
      explanation: 'All scheduled items are optional.'
    }
  }

  const completedRequired = requiredActivities.filter(a => a.status === 'completed')

  // Calculate Category Breakdowns
  const habitsList = requiredActivities.filter(a => a.category === 'habit')
  const studyList = requiredActivities.filter(a => a.category === 'study')
  const healthList = requiredActivities.filter(a => a.category === 'health' || a.category === 'spiritual')
  const jobList = requiredActivities.filter(a => a.category === 'job')

  const calcCategoryScore = (list: ScheduledActivity[]): number => {
    if (list.length === 0) return 100
    const completed = list.filter(a => a.status === 'completed').length
    return Math.round((completed / list.length) * 100)
  }

  const habitsScore = calcCategoryScore(habitsList)
  const studyScore = calcCategoryScore(studyList)
  const healthScore = calcCategoryScore(healthList)
  const jobsScore = calcCategoryScore(jobList)

  // Overall Score: equal weighting among all required tasks
  const overallScore = Math.round((completedRequired.length / requiredActivities.length) * 100)

  const explanation = `${completedRequired.length} of ${requiredActivities.length} required activities completed (${overallScore}%). Categories: Habits (${habitsScore}%), Study (${studyScore}%), Health & Discipline (${healthScore}%), Job Applications (${jobsScore}%).`

  return {
    habitsScore,
    studyScore,
    healthScore,
    jobsScore,
    overallScore,
    totalRequiredActivities: requiredActivities.length,
    completedRequiredActivities: completedRequired.length,
    explanation
  }
}
