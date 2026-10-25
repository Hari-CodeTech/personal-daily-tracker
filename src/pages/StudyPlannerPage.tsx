import React, { useState } from 'react'
import {
  BookOpen,
  Code2,
  Database,
  Briefcase,
  Layers,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import { StudySessionTimer } from '@/components/study/StudySessionTimer'
import { ProblemSolvingModal } from '@/components/study/ProblemSolvingModal'
import { InterviewRevisionModal } from '@/components/study/InterviewRevisionModal'
import { getAlternatingStudySubject } from '@/lib/scheduler'
import { formatMinutesToHours } from '@/lib/utils'
import type { StudySubject } from '@/types/database'

export function StudyPlannerPage() {
  const {
    studySessions,
    deleteStudySession,
    problemRecords,
    deleteProblemRecord,
    settings,
    selectedDate
  } = useTracker()

  const [showProblemModal, setShowProblemModal] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<StudySubject>('java')

  // Check alternating schedule for selectedDate
  const alternatingSubject = getAlternatingStudySubject(
    selectedDate,
    settings.alternating_start_date || selectedDate,
    settings.alternating_start_subject || 'mysql'
  )

  const isMySQLDay = alternatingSubject === 'mysql'
  const isInterviewDay = alternatingSubject === 'interview_prep'

  // Filter today's study sessions
  const todaySessions = studySessions.filter(s => s.date === selectedDate)
  const todayProblems = problemRecords.filter(p => p.date === selectedDate)

  const getSubjectMinutes = (subj: StudySubject) => {
    return todaySessions
      .filter(s => s.subject === subj)
      .reduce((sum, s) => sum + s.duration_minutes, 0)
  }

  const javaMins = getSubjectMinutes('java')
  const dsaMins = getSubjectMinutes('problem_solving')
  const mysqlMins = getSubjectMinutes('mysql')
  const interviewMins = getSubjectMinutes('interview_prep')
  const techMins = getSubjectMinutes('technical_learning')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Study Planner & Curriculum
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
              Automated Schedule
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Strict alternating day schedule for MySQL & Interview Prep with mandatory daily Java & DSA
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowProblemModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Log DSA Problem
          </button>
          <button
            onClick={() => setShowInterviewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Interview Topics
          </button>
        </div>
      </div>

      {/* TODAY'S CURRICULUM OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Java Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 shadow-subtle">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Daily Mandatory
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              javaMins >= (settings.java_target_minutes || 120)
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70'
                : 'bg-slate-100 text-slate-600 dark:bg-navy-800'
            }`}>
              {javaMins >= (settings.java_target_minutes || 120) ? 'Target Met ✓' : `${javaMins}/${settings.java_target_minutes || 120}m`}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Core Java
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            OOP, Collections, Generics, Concurrency, JDBC
          </p>
          <button
            onClick={() => setSelectedSubject('java')}
            className="mt-3 w-full py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            Select Java Timer
          </button>
        </div>

        {/* DSA Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 shadow-subtle">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Daily Mandatory
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              todayProblems.length >= (settings.dsa_target_count || 3)
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70'
                : 'bg-slate-100 text-slate-600 dark:bg-navy-800'
            }`}>
              {todayProblems.length} Problems
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Problem Solving / DSA
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Arrays, Binary Search, Trees, Graphs, DP
          </p>
          <button
            onClick={() => setSelectedSubject('problem_solving')}
            className="mt-3 w-full py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            Select DSA Timer
          </button>
        </div>

        {/* Alternating Subject: MySQL or Interview Prep */}
        <div className={`p-4 rounded-3xl border shadow-subtle ${
          isMySQLDay
            ? 'bg-amber-50/40 dark:bg-navy-900 border-amber-300 dark:border-amber-800/60'
            : 'bg-purple-50/40 dark:bg-navy-900 border-purple-300 dark:border-purple-800/60'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Alternating (Scheduled Today)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-navy-800 shadow-2xs">
              2 Hours Target
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            {isMySQLDay ? <Database className="w-4 h-4 text-amber-500" /> : <Briefcase className="w-4 h-4 text-purple-500" />}
            {isMySQLDay ? 'MySQL & SQL Practice' : 'Interview Preparation'}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {isMySQLDay
              ? 'Joins, indexing, subqueries & normalization'
              : 'Spring Boot, REST APIs, Architecture, HR review'}
          </p>
          <button
            onClick={() => setSelectedSubject(isMySQLDay ? 'mysql' : 'interview_prep')}
            className="mt-3 w-full py-1.5 rounded-xl bg-white dark:bg-navy-800 text-xs font-bold shadow-2xs hover:bg-slate-100 transition-colors"
          >
            Select {isMySQLDay ? 'MySQL' : 'Interview'} Timer
          </button>
        </div>

        {/* Tech Learning Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 shadow-subtle">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Daily Flexible
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800">
              {techMins}/{settings.tech_target_minutes || 60}m
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Frontend / Backend Tech
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            React, TypeScript, Spring Boot, REST, Microservices
          </p>
          <button
            onClick={() => setSelectedSubject('technical_learning')}
            className="mt-3 w-full py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100 transition-colors"
          >
            Select Tech Timer
          </button>
        </div>
      </div>

      {/* LIVE STUDY TIMER */}
      <StudySessionTimer defaultSubject={selectedSubject} />

      {/* TODAY'S SAVED PROBLEMS & STUDY SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problems Solved Today */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800 mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Problems Solved Today ({todayProblems.length})
              </h3>
            </div>
            <button
              onClick={() => setShowProblemModal(true)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              + Add Problem
            </button>
          </div>

          {todayProblems.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              No problems logged yet today. Solve at least 3 problems!
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-navy-800/60">
              {todayProblems.map(p => (
                <div key={p.id} className="py-3 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        p.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-700'
                          : p.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {p.difficulty}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {p.problem_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{p.topic}</span>
                      <span>•</span>
                      <span>{p.time_spent_minutes} mins</span>
                      <span>•</span>
                      <span className="capitalize">{p.result.replace('_', ' ')}</span>
                      {p.needs_revision && (
                        <span className="text-rose-500 font-semibold">• Needs Revision</span>
                      )}
                    </div>
                    {p.notes && (
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 italic">
                        "{p.notes}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteProblemRecord(p.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Sessions Recorded Today */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Completed Study Sessions ({todaySessions.length})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              Total: {formatMinutesToHours(todaySessions.reduce((sum, s) => sum + s.duration_minutes, 0))}
            </span>
          </div>

          {todaySessions.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              No study sessions saved for {selectedDate}. Use the live timer or manual entry above!
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-navy-800/60">
              {todaySessions.map(session => (
                <div key={session.id} className="py-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {session.subject.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {session.topic}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{session.duration_minutes} minutes</span>
                      {session.notes && <span>• {session.notes}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteStudySession(session.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProblemSolvingModal
        isOpen={showProblemModal}
        onClose={() => setShowProblemModal(false)}
      />

      <InterviewRevisionModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
      />
    </div>
  )
}
