export interface DailyInspirationItem {
  weekdayNumber: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  weekdayName: string
  subject: string
  quote: string
  attribution?: string
  imagePath: string
  altText: string
}

export const DAILY_INSPIRATION_SCHEDULE: Record<number, DailyInspirationItem> = {
  1: {
    weekdayNumber: 1,
    weekdayName: 'Monday',
    subject: 'Lord Shiva',
    quote: 'Master your mind, and you master your destiny. In stillness and unwavering focus, true strength is revealed.',
    attribution: 'Ancient Wisdom',
    imagePath: '/images/daily-inspiration/monday-shiva.png',
    altText: 'Lord Shiva in serene meditation'
  },
  2: {
    weekdayNumber: 2,
    weekdayName: 'Tuesday',
    subject: 'Lord Hanuman',
    quote: 'With unwavering devotion and relentless courage, no obstacle is insurmountable. Awaken the dormant strength within you.',
    attribution: 'Sundara Kanda',
    imagePath: '/images/daily-inspiration/tuesday-hanuman.png',
    altText: 'Lord Hanuman in prayer posture radiating strength'
  },
  3: {
    weekdayNumber: 3,
    weekdayName: 'Wednesday',
    subject: 'Lord Ganesha',
    quote: 'Every challenge is an invitation to exercise wisdom. Begin with faith, learn with humility, and every obstacle turns into a pathway.',
    attribution: 'Traditional Wisdom',
    imagePath: '/images/daily-inspiration/wednesday-ganesha.png',
    altText: 'Lord Ganesha offering blessing and wisdom'
  },
  4: {
    weekdayNumber: 4,
    weekdayName: 'Thursday',
    subject: 'Shirdi Sai Baba',
    quote: 'Trust the process with patience and wholehearted faith. Keep doing your duty; what is destined for you will arrive in its perfect time.',
    attribution: 'Shraddha & Saburi',
    imagePath: '/images/daily-inspiration/thursday-sai-baba.png',
    altText: 'Shirdi Sai Baba in peaceful blessing'
  },
  5: {
    weekdayNumber: 5,
    weekdayName: 'Friday',
    subject: 'Ammavari (Goddess Lakshmi)',
    quote: 'True prosperity follows purity of purpose and diligent action. Cultivate gratitude in your heart and excellence in your daily work.',
    attribution: 'Spiritual Wisdom',
    imagePath: '/images/daily-inspiration/friday-ammavari.png',
    altText: 'Goddess Lakshmi Ammavari on lotus radiating grace'
  },
  6: {
    weekdayNumber: 6,
    weekdayName: 'Saturday',
    subject: 'Lord Venkateswara (Balaji)',
    quote: 'Focus single-mindedly on righteous action without attachment to the outcome. Surrender your sincere efforts to the divine, and peace will reign.',
    attribution: 'Bhagavad Gita Philosophy',
    imagePath: '/images/daily-inspiration/saturday-balaji.png',
    altText: 'Lord Venkateswara Balaji in majestic temple form'
  },
  0: {
    weekdayNumber: 0,
    weekdayName: 'Sunday',
    subject: 'Beautiful Sunrise',
    quote: 'Each sunrise brings an untouched page of life. Rise with fresh resolve, radiate your positive light, and make today count.',
    attribution: 'Daily Reflection',
    imagePath: '/images/daily-inspiration/sunday-sunrise.png',
    altText: 'Glorious morning sunrise over mountains'
  }
}

/**
 * Extracts local weekday index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * safely without UTC timezone shift.
 */
export function getWeekdayFromDate(dateInput?: string | Date): number {
  if (!dateInput) {
    return new Date().getDay()
  }
  if (dateInput instanceof Date) {
    return dateInput.getDay()
  }
  if (typeof dateInput === 'string') {
    const parts = dateInput.slice(0, 10).split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day).getDay()
      }
    }
    const d = new Date(dateInput)
    return isNaN(d.getTime()) ? new Date().getDay() : d.getDay()
  }
  return new Date().getDay()
}

/**
 * Returns the exact Daily Inspiration item for a given date or weekday.
 * Consistent across reloads on the same calendar day.
 */
export function getDailyInspirationForDate(dateInput?: string | Date): DailyInspirationItem {
  const weekday = getWeekdayFromDate(dateInput)
  return DAILY_INSPIRATION_SCHEDULE[weekday] || DAILY_INSPIRATION_SCHEDULE[0]
}

/**
 * Formats a date string for display (e.g. "Sunday, 25 October 2026")
 */
export function formatInspirationDate(dateInput?: string | Date): string {
  let targetDate: Date
  if (!dateInput) {
    targetDate = new Date()
  } else if (dateInput instanceof Date) {
    targetDate = dateInput
  } else {
    const parts = dateInput.slice(0, 10).split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      targetDate = new Date(year, month, day)
    } else {
      targetDate = new Date(dateInput)
    }
  }

  if (isNaN(targetDate.getTime())) {
    targetDate = new Date()
  }

  return targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
