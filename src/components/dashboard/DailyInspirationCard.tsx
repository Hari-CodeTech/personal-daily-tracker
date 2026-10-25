import React, { useState } from 'react'
import { Sparkles, Quote, Calendar, ImageOff } from 'lucide-react'
import { getDailyInspirationForDate, formatInspirationDate } from '@/lib/dailyInspiration'

interface DailyInspirationCardProps {
  dateStr?: string
}

export function DailyInspirationCard({ dateStr }: DailyInspirationCardProps) {
  const [imageError, setImageError] = useState(false)
  const item = getDailyInspirationForDate(dateStr)
  const formattedDate = formatInspirationDate(dateStr)

  // Reset image error state if date/weekday changes
  React.useEffect(() => {
    setImageError(false)
  }, [item.imagePath])

  return (
    <div
      className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-subtle transition-all"
      data-testid="daily-inspiration-card"
    >
      {/* Header with Heading & Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-navy-800/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Daily Inspiration
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Main Content: Responsive layout (desktop: side-by-side, mobile: column if cramped) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
        {/* Sacred / Motivational Image (approx 56–72px) */}
        <div className="shrink-0 self-center sm:self-auto">
          {!imageError ? (
            <div className="relative group">
              <img
                src={item.imagePath}
                alt={item.altText}
                onError={() => setImageError(true)}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-slate-200 dark:border-navy-700/80 shadow-xs ring-2 ring-amber-500/10 dark:ring-amber-400/10 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                width={72}
                height={72}
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10 pointer-events-none" />
            </div>
          ) : (
            /* Graceful Fallback if image asset is unavailable */
            <div
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-navy-800 dark:to-navy-750 border border-amber-200 dark:border-navy-700 flex flex-col items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs"
              title={`${item.subject} (${item.weekdayName})`}
            >
              <Sparkles className="w-6 h-6 mb-0.5" />
              <span className="text-[10px] font-bold uppercase tracking-tight line-clamp-1 px-1 text-center">
                {item.weekdayName.slice(0, 3)}
              </span>
            </div>
          )}
        </div>

        {/* Quote & Attribution Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" />
            <blockquote className="text-sm sm:text-base font-medium italic text-slate-800 dark:text-slate-100 leading-relaxed">
              "{item.quote}"
            </blockquote>
          </div>

          {/* Theme Subject & Attribution */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 pl-6 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {item.subject}
            </span>
            {item.attribution && (
              <>
                <span className="text-slate-300 dark:text-navy-700">•</span>
                <cite className="not-italic text-slate-500 dark:text-slate-400">
                  — {item.attribution}
                </cite>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
