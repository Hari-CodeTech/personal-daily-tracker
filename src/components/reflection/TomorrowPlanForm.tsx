import React, { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, Save, Sparkles, CheckSquare } from 'lucide-react'
import { format, addDays, parseISO } from 'date-fns'
import { useTracker } from '@/context/TrackerContext'
import { getAlternatingStudySubject, isTuesday } from '@/lib/scheduler'
import type { TomorrowPlan } from '@/types/database'

export function TomorrowPlanForm() {
  const { tomorrowPlans, saveTomorrowPlan, settings, selectedDate } = useTracker()

  const tomorrowDateStr = format(addDays(parseISO(selectedDate), 1), 'yyyy-MM-dd')
  const existingPlan = tomorrowPlans[tomorrowDateStr]

  // Calculate tomorrow's automated subject
  const tomorrowAlternatingSubject = getAlternatingStudySubject(
    tomorrowDateStr,
    settings.alternating_start_date || selectedDate,
    settings.alternating_start_subject || 'mysql'
  )
  const tomorrowIsTuesday = isTuesday(tomorrowDateStr)

  const [javaTopic, setJavaTopic] = useState(existingPlan?.java_topic || 'Collections & Concurrency Revision')
  const [dsaTopic, setDsaTopic] = useState(existingPlan?.dsa_topic || 'Binary Search & Sliding Window')
  const [mysqlOrInterviewTopic, setMysqlOrInterviewTopic] = useState(
    existingPlan?.mysql_or_interview_topic ||
      (tomorrowAlternatingSubject === 'mysql'
        ? 'MySQL Joins, Indexing & Query Tuning'
        : 'Spring Boot REST APIs & Annotations')
  )
  const [techTopic, setTechTopic] = useState(existingPlan?.tech_topic || 'React Hooks & State Management')
  const [priorities, setPriorities] = useState(existingPlan?.priorities || '')
  const [newCustomTask, setNewCustomTask] = useState('')
  const [additionalTasks, setAdditionalTasks] = useState<Array<{ id: string; title: string; completed: boolean }>>(
    existingPlan?.additional_tasks || []
  )
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Prepopulate if new plan
  useEffect(() => {
    if (existingPlan) {
      setJavaTopic(existingPlan.java_topic || '')
      setDsaTopic(existingPlan.dsa_topic || '')
      setMysqlOrInterviewTopic(existingPlan.mysql_or_interview_topic || '')
      setTechTopic(existingPlan.tech_topic || '')
      setPriorities(existingPlan.priorities || '')
      setAdditionalTasks(existingPlan.additional_tasks || [])
    }
  }, [existingPlan, tomorrowDateStr])

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustomTask.trim()) return
    setAdditionalTasks(prev => [
      ...prev,
      { id: 'task-' + Date.now(), title: newCustomTask.trim(), completed: false }
    ])
    setNewCustomTask('')
  }

  const handleRemoveTask = (id: string) => {
    setAdditionalTasks(prev => prev.filter(t => t.id !== id))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveTomorrowPlan(tomorrowDateStr, {
      date: tomorrowDateStr,
      java_topic: javaTopic,
      dsa_topic: dsaTopic,
      mysql_or_interview_topic: mysqlOrInterviewTopic,
      tech_topic: techTopic,
      job_target: settings.job_applications_daily_target || 10,
      priorities,
      additional_tasks: additionalTasks
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2000)
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-3xl p-6 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Tomorrow's Action Blueprint ({tomorrowDateStr})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pre-populated according to curriculum rules & alternating schedule
            </p>
          </div>
        </div>

        {tomorrowIsTuesday && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            ★ Tuesday Temple Visit Scheduled
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Java Study Topic (Daily Mandatory)
            </label>
            <input
              type="text"
              value={javaTopic}
              onChange={e => setJavaTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              DSA / Problem Solving Topic (Daily Mandatory)
            </label>
            <input
              type="text"
              value={dsaTopic}
              onChange={e => setDsaTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              {tomorrowAlternatingSubject === 'mysql' ? 'MySQL Study Topic' : 'Interview Preparation Topic'} (Alternating)
            </label>
            <input
              type="text"
              value={mysqlOrInterviewTopic}
              onChange={e => setMysqlOrInterviewTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Technical Learning Topic (Frontend / Backend)
            </label>
            <input
              type="text"
              value={techTopic}
              onChange={e => setTechTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Key Priorities & Focus Statement
          </label>
          <textarea
            rows={2}
            placeholder="What is the #1 highest-leverage priority for tomorrow? Keep target of minimum 10 job applications..."
            value={priorities}
            onChange={e => setPriorities(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Additional Custom Tasks */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Custom Priorities & Tasks
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add another custom task for tomorrow..."
              value={newCustomTask}
              onChange={e => setNewCustomTask(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Add
            </button>
          </div>

          {additionalTasks.length > 0 && (
            <div className="space-y-1.5">
              {additionalTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800 text-xs">
                  <span className="text-slate-800 dark:text-slate-200">{task.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(task.id)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
              Plan saved for tomorrow! ✓
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            Lock In Tomorrow's Plan
          </button>
        </div>
      </form>
    </div>
  )
}
