import React, { useState } from 'react'
import { X, BookOpen, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useTracker } from '@/context/TrackerContext'
import type { RevisionStatus } from '@/types/database'

interface InterviewRevisionModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  'Core Java',
  'OOP',
  'Collections & Concurrency',
  'Spring & Spring Boot',
  'REST APIs & Microservices',
  'Hibernate & JPA',
  'MySQL & SQL Queries',
  'Frontend & React',
  'System Design & Projects',
  'HR & Behavioral'
]

export function InterviewRevisionModal({ isOpen, onClose }: InterviewRevisionModalProps) {
  const { interviewTopics, addInterviewTopic, updateInterviewTopicStatus } = useTracker()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState('Core Java')
  const [newTopicName, setNewTopicName] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('All')

  if (!isOpen) return null

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicName.trim()) return

    await addInterviewTopic({
      category: newCategory,
      topic_name: newTopicName.trim(),
      revision_status: 'not_started'
    })

    setNewTopicName('')
    setShowAddForm(false)
  }

  const filteredTopics = filterCategory === 'All'
    ? interviewTopics
    : interviewTopics.filter(t => t.category === filterCategory)

  const getStatusBadge = (status: RevisionStatus) => {
    switch (status) {
      case 'revised':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">Revised</span>
      case 'in_progress':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">In Progress</span>
      case 'needs_another_revision':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">Needs Revision</span>
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300">Not Started</span>
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Interview Preparation & Revision
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track and review topics for technical interviews
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Topic
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleCreateTopic} className="p-4 my-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-200/50 dark:border-purple-900/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-800 dark:text-slate-200"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Topic / Question Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garbage Collection algorithms, Spring bean scope..."
                  value={newTopicName}
                  onChange={e => setNewTopicName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-xs"
              >
                Save Topic
              </button>
            </div>
          </form>
        )}

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto py-2 border-b border-slate-100 dark:border-navy-800 shrink-0">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-navy-800/60 pr-1">
          {filteredTopics.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">No interview topics in this category.</p>
          ) : (
            filteredTopics.map(topic => (
              <div key={topic.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      {topic.category}
                    </span>
                    {topic.last_revised_date && (
                      <span className="text-[10px] text-slate-400">
                        • Last revised: {topic.last_revised_date}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                    {topic.topic_name}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(topic.revision_status)}

                  <select
                    value={topic.revision_status}
                    onChange={e => updateInterviewTopicStatus(topic.id, e.target.value as RevisionStatus)}
                    className="px-2 py-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="revised">Mark Revised</option>
                    <option value="needs_another_revision">Needs Revision</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
