import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts'
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  Briefcase,
  Code2,
  CheckSquare,
  Droplet,
  Moon,
  Sparkles,
  BookOpen
} from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { format, subDays, parseISO } from 'date-fns'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

export function AnalyticsPage() {
  const {
    studySessions,
    problemRecords,
    jobApplications,
    habits,
    habitLogs,
    healthLogs,
    exportDataJSON,
    exportDataCSV
  } = useTracker()

  const [dateRangeDays, setDateRangeDays] = useState<number>(14)

  // Generate date series for trends
  const today = new Date()
  const datesSeries = Array.from({ length: dateRangeDays }, (_, i) => {
    const d = subDays(today, dateRangeDays - 1 - i)
    return format(d, 'yyyy-MM-dd')
  })

  // 1. Study Hours by Subject for pie chart
  const subjectTotals: Record<string, number> = {}
  studySessions.forEach(s => {
    subjectTotals[s.subject] = (subjectTotals[s.subject] || 0) + s.duration_minutes
  })
  const subjectPieData = Object.keys(subjectTotals).map(k => ({
    name: k.replace('_', ' ').toUpperCase(),
    value: Number((subjectTotals[k] / 60).toFixed(1))
  }))

  // 2. Daily Study Hours Trend
  const dailyStudyTrend = datesSeries.map(dateStr => {
    const totalMinutes = studySessions
      .filter(s => s.date === dateStr)
      .reduce((sum, s) => sum + s.duration_minutes, 0)
    return {
      date: format(parseISO(dateStr), 'MMM d'),
      hours: Number((totalMinutes / 60).toFixed(1))
    }
  })

  // 3. Job Applications Trend (daily + target 10 line)
  const dailyJobsTrend = datesSeries.map(dateStr => {
    const count = jobApplications.filter(
      j => j.application_date === dateStr && j.status !== 'Planned'
    ).length
    return {
      date: format(parseISO(dateStr), 'MMM d'),
      applications: count,
      target: 10
    }
  })

  // 4. DSA Difficulty Breakdown
  const dsaCounts = {
    Easy: problemRecords.filter(p => p.difficulty === 'Easy').length,
    Medium: problemRecords.filter(p => p.difficulty === 'Medium').length,
    Hard: problemRecords.filter(p => p.difficulty === 'Hard').length
  }
  const dsaBarData = [
    { difficulty: 'Easy', count: dsaCounts.Easy, fill: '#10b981' },
    { difficulty: 'Medium', count: dsaCounts.Medium, fill: '#f59e0b' },
    { difficulty: 'Hard', count: dsaCounts.Hard, fill: '#ef4444' }
  ]

  // Export handlers
  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily-tracker-export-${format(today, 'yyyyMMdd')}.json`
    a.click()
  }

  const handleDownloadCSV = () => {
    const csvStr = exportDataCSV()
    const blob = new Blob([csvStr], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily-tracker-export-${format(today, 'yyyyMMdd')}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Analytics & Performance Insights
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
              Real Data
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual graphs calculated purely from saved study sessions, problems, applications, and habits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex bg-slate-100 dark:bg-navy-800 p-1 rounded-2xl">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                onClick={() => setDateRangeDays(days)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  dateRangeDays === days
                    ? 'bg-white dark:bg-navy-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>

          {/* Export buttons */}
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            JSON
          </button>
        </div>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Study Hours Trend */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Daily Study Hours (Last {dateRangeDays} Days)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Hours / Day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStudyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Job Applications vs Target 10 */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800 mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Job Applications vs Target of 10
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">Target 10</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyJobsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Applications Submitted"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                  name="Target (10)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Study Hours Breakdown by Subject */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Study Time Distribution
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Total Hours</span>
          </div>

          {subjectPieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No study sessions logged yet.
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={entry => `${entry.name}: ${entry.value}h`}
                  >
                    {subjectPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 4: DSA Problems Solved by Difficulty */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800 mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                DSA Problem Solved by Difficulty
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              Total: {problemRecords.length}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dsaBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="difficulty" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {dsaBarData.map((entry, index) => (
                    <Cell key={`dsa-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
