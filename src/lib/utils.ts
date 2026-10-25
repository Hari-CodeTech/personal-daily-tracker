import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMinutesToHours(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs === 0) return `${mins}m`
  if (mins === 0) return `${hrs}h`
  return `${hrs}h ${mins}m`
}

export function getTodayDateString(timezone?: string): string {
  try {
    // Return YYYY-MM-DD
    const d = new Date()
    return format(d, 'yyyy-MM-dd')
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const d = parseISO(dateStr.slice(0, 10))
    return format(d, 'EEEE, MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function getGreeting(hour?: number): string {
  const currentHour = hour !== undefined ? hour : new Date().getHours()
  if (currentHour < 12) return 'Good morning'
  if (currentHour < 17) return 'Good afternoon'
  return 'Good evening'
}
