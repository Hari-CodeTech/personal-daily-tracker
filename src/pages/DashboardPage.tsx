import React, { useState } from 'react'
import {
  Award,
  CheckSquare,
  BookOpen,
  Code2,
  Briefcase,
  HeartPulse,
  Flame,
  Plus,
  Play,
  HelpCircle,
  TrendingUp,
  Droplet,
  Moon
} from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { DashboardCard } from '@/components/common/DashboardCard'
import { ProgressBar } from '@/components/common/ProgressBar'
import { TodaysSchedule } from '@/components/dashboard/TodaysSchedule'
import { DailyInspirationCard } from '@/components/dashboard/DailyInspirationCard'
import { ScoreBreakdownModal } from '@/components/dashboard/ScoreBreakdownModal'
import { QuickActionsModal } from '@/components/dashboard/QuickActionsModal'
import { ProblemSolvingModal } from '@/components/study/ProblemSolvingModal'
import { JobApplicationFormModal } from '@/components/jobs/JobApplicationFormModal'
import { StudySessionTimer } from '@/components/study/StudySessionTimer'
import { formatMinutesToHours } from '@/lib/utils'
import { Link } from 'react-router-dom'
import type { StudySubject } from '@/types/database'

export function DashboardPage() {
  const {
    todayScore,
    todaySchedule,
    habits,
    habitLogs,
    studySessions,
    problemRecords,
    jobApplications,
    healthLogs,
    streakInfo,
    challengeInfo,
    settings,
    selectedDate
  } = useTracker()

  const [showScoreModal, setShowScoreModal] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showAddProblem, setShowAddProblem] = useState(false)
  const [showAddJob, setShowAddJob] = useState(false)
  const [quickStudySubject, setQuickStudySubject] = useState<StudySubject>('java')
  const [showStudyTimerModal, setShowStudyTimerModal] = useState(false)

  // Calculations from saved real records
  const normDate = selectedDate.slice(0, 10)
  const activeHabits = habits.filter(h => !h.is_archived)
  const completedHabitsCount = activeHabits.filter(h => {
    const log = habitLogs.find(l => l.habit_id === h.id && l.date && l.date.slice(0, 10) === normDate)
    return log?.is_completed ?? false
  }).length

  const studySessionMinutes = studySessions
    .filter(s => s.date && s.date.slice(0, 10) === normDate)
    .reduce((sum, s) => sum + s.duration_minutes, 0)
  const problemMinutes = problemRecords
    .filter(p => p.date && p.date.slice(0, 10) === normDate)
    .reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0)
  const todayStudyMinutes = studySessionMinutes + problemMinutes

  const totalStudyTargetMinutes =
    (settings.java_target_minutes || 120) +
    (settings.dsa_target_minutes || 120) +
    (settings.tech_target_minutes || 60) +
    120 // 2 hours for MySQL or Interview prep alternating

  const todayProblemsCount = problemRecords.filter(p => p.date && p.date.slice(0, 10) === normDate).length

  const todayJobApps = jobApplications.filter(
    j => j.application_date && j.application_date.slice(0, 10) === normDate && j.status !== 'Planned'
  )
  // Deduplicate by company + title for unique applications submitted
  const uniqueJobMap = new Map<string, typeof todayJobApps[0]>()
  for (const app of todayJobApps) {
    const key = `${app.company_name.trim().toLowerCase()}-${app.job_title.trim().toLowerCase()}`
    if (!uniqueJobMap.has(key)) {
      uniqueJobMap.set(key, app)
    }
  }
  const uniqueJobCount = uniqueJobMap.size
  const jobTarget = settings.job_applications_daily_target || 10
  const jobsRemaining = Math.max(0, jobTarget - uniqueJobCount)

  const todayHealth = healthLogs[normDate]
  const skippingTarget = settings.skipping_target_value || 1000
  const currentSkips = todayHealth?.skipping_count ?? 0
  const skipsDone = currentSkips >= skippingTarget

  const waterTarget = settings.water_target_liters || 2.5
  const currentWater = todayHealth?.water_liters ?? 0
  const waterDone = currentWater >= waterTarget

  const sleepTarget = settings.sleep_target_hours || 7
  const currentSleep = todayHealth?.sleep_hours ?? 0
  const sleepDone = currentSleep >= sleepTarget

  const healthTargetsCount = [skipsDone, waterDone, sleepDone].filter(Boolean).length
  const skipsFrac = Math.min(1, currentSkips / skippingTarget)
  const waterFrac = Math.min(1, currentWater / waterTarget)
  const sleepFrac = Math.min(1, currentSleep / sleepTarget)
  const healthPercent = Math.round(((skipsFrac + waterFrac + sleepFrac) / 3) * 100)

  const handleStartStudy = (subject: string) => {
    setQuickStudySubject(subject as StudySubject)
    setShowStudyTimerModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 text-white shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Day Dashboard
            </span>
            {challengeInfo && challengeInfo.currentDay > 0 && (
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-400/30 text-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                Challenge Day {challengeInfo.currentDay} / 365
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Consistency Over Intensity.
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-xl">
            Complete your mandatory Java, DSA problems, alternating study session, and submit 10 job applications today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowQuickActions(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Quick Action
          </button>
          <button
            onClick={() => handleStartStudy('java')}
            className="px-4 py-2.5 rounded-2xl bg-emerald-900/40 hover:bg-emerald-900/60 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Study
          </button>
        </div>
      </div>

      {/* 8 DASHBOARD SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Overall Daily Progress */}
        <DashboardCard
          title="Daily Score"
          value={`${todayScore.overallScore}%`}
          subtext={`${todayScore.completedRequiredActivities} of ${todayScore.totalRequiredActivities} required tasks`}
          icon={<Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          onClick={() => setShowScoreModal(true)}
        >
          <ProgressBar value={todayScore.overallScore} color="brand" size="sm" />
        </DashboardCard>

        {/* 2. Habits Completed */}
        <DashboardCard
          title="Habits & Discipline"
          value={`${completedHabitsCount} / ${activeHabits.length}`}
          subtext={`${Math.round((completedHabitsCount / Math.max(1, activeHabits.length)) * 100)}% habits locked`}
          icon={<CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
        >
          <ProgressBar
            value={Math.round((completedHabitsCount / Math.max(1, activeHabits.length)) * 100)}
            color="purple"
            size="sm"
          />
        </DashboardCard>

        {/* 3. Study Time Completed */}
        <DashboardCard
          title="Study Time"
          value={formatMinutesToHours(todayStudyMinutes)}
          subtext={`Target: ${formatMinutesToHours(totalStudyTargetMinutes)} total`}
          icon={<BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
        >
          <ProgressBar
            value={Math.min(100, Math.round((todayStudyMinutes / totalStudyTargetMinutes) * 100))}
            color="blue"
            size="sm"
          />
        </DashboardCard>

        {/* 4. Problem Solving (DSA) */}
        <DashboardCard
          title="Problems Solved"
          value={`${todayProblemsCount}`}
          subtext={`Target: ${settings.dsa_target_count || 3} problems today`}
          icon={<Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          onClick={() => setShowAddProblem(true)}
        >
          <ProgressBar
            value={Math.min(100, Math.round((todayProblemsCount / (settings.dsa_target_count || 3)) * 100))}
            color="purple"
            size="sm"
          />
        </DashboardCard>

        {/* 5. Job Applications Target (Minimum 10) */}
        <DashboardCard
          title="Job Target (10 Daily)"
          value={`${uniqueJobCount} / ${jobTarget}`}
          subtext={jobsRemaining === 0 ? 'Goal Achieved! ✓' : `${jobsRemaining} more required today`}
          icon={<Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          onClick={() => setShowAddJob(true)}
        >
          <ProgressBar
            value={Math.min(100, Math.round((uniqueJobCount / jobTarget) * 100))}
            color={jobsRemaining === 0 ? 'brand' : 'amber'}
            size="sm"
          />
        </DashboardCard>

        {/* 6. Workout and Health Progress */}
        <DashboardCard
          title="Health & Fitness"
          value={`${healthTargetsCount} / 3 Targets`}
          subtext={`Skips: ${currentSkips}/${skippingTarget} • Water: ${currentWater}L`}
          icon={<HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          iconBg="bg-rose-50 dark:bg-rose-950/60"
        >
          <ProgressBar
            value={healthPercent}
            color="rose"
            size="sm"
          />
        </DashboardCard>

        {/* 7. Current Streak */}
        <DashboardCard
          title="Current Streak"
          value={`${streakInfo.currentStreak} Days`}
          subtext="Consecutive calendar days"
          icon={<Flame className="w-5 h-5 text-amber-500 fill-amber-500" />}
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />

        {/* 8. Longest Streak */}
        <DashboardCard
          title="Longest Streak"
          value={`${streakInfo.longestStreak} Days`}
          subtext={`Total Active: ${streakInfo.totalSuccessfulDays} days`}
          icon={<TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
          iconBg="bg-teal-50 dark:bg-teal-950/60"
        />
      </div>

      {/* TODAY'S SCHEDULE */}
      <TodaysSchedule onQuickStartStudy={handleStartStudy} />

      {/* DAILY INSPIRATION */}
      <DailyInspirationCard dateStr={selectedDate} />

      {/* MODALS */}
      <ScoreBreakdownModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
      />

      <QuickActionsModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onOpenStudyTimer={handleStartStudy}
        onOpenAddProblem={() => setShowAddProblem(true)}
        onOpenAddJob={() => setShowAddJob(true)}
      />

      <ProblemSolvingModal
        isOpen={showAddProblem}
        onClose={() => setShowAddProblem(false)}
      />

      <JobApplicationFormModal
        isOpen={showAddJob}
        onClose={() => setShowAddJob(false)}
      />

      {/* Study Timer Popup Modal */}
      {showStudyTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="max-w-xl w-full">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowStudyTimerModal(false)}
                className="px-3 py-1 bg-white dark:bg-navy-800 text-xs font-bold rounded-xl shadow"
              >
                Close
              </button>
            </div>
            <StudySessionTimer defaultSubject={quickStudySubject} />
          </div>
        </div>
      )}
    </div>
  )
}
