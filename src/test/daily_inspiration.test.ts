import { describe, it, expect } from 'vitest'
import {
  getDailyInspirationForDate,
  getWeekdayFromDate,
  formatInspirationDate,
  DAILY_INSPIRATION_SCHEDULE
} from '@/lib/dailyInspiration'

describe('Daily Inspiration System', () => {
  it('selects the correct image and theme for all 7 weekdays', () => {
    // 2026-10-19 is Monday
    const monday = getDailyInspirationForDate('2026-10-19')
    expect(monday.weekdayName).toBe('Monday')
    expect(monday.subject).toBe('Lord Shiva')
    expect(monday.imagePath).toBe('/images/daily-inspiration/monday-shiva.png')
    expect(monday.quote).toContain('Master your mind')

    // 2026-10-20 is Tuesday
    const tuesday = getDailyInspirationForDate('2026-10-20')
    expect(tuesday.weekdayName).toBe('Tuesday')
    expect(tuesday.subject).toBe('Lord Hanuman')
    expect(tuesday.imagePath).toBe('/images/daily-inspiration/tuesday-hanuman.png')
    expect(tuesday.quote).toContain('courage')

    // 2026-10-21 is Wednesday
    const wednesday = getDailyInspirationForDate('2026-10-21')
    expect(wednesday.weekdayName).toBe('Wednesday')
    expect(wednesday.subject).toBe('Lord Ganesha')
    expect(wednesday.imagePath).toBe('/images/daily-inspiration/wednesday-ganesha.png')
    expect(wednesday.quote).toContain('wisdom')

    // 2026-10-22 is Thursday
    const thursday = getDailyInspirationForDate('2026-10-22')
    expect(thursday.weekdayName).toBe('Thursday')
    expect(thursday.subject).toBe('Shirdi Sai Baba')
    expect(thursday.imagePath).toBe('/images/daily-inspiration/thursday-sai-baba.png')
    expect(thursday.quote).toContain('patience')

    // 2026-10-23 is Friday
    const friday = getDailyInspirationForDate('2026-10-23')
    expect(friday.weekdayName).toBe('Friday')
    expect(friday.subject).toBe('Ammavari (Goddess Lakshmi)')
    expect(friday.imagePath).toBe('/images/daily-inspiration/friday-ammavari.png')
    expect(friday.quote).toContain('prosperity')

    // 2026-10-24 is Saturday
    const saturday = getDailyInspirationForDate('2026-10-24')
    expect(saturday.weekdayName).toBe('Saturday')
    expect(saturday.subject).toBe('Lord Venkateswara (Balaji)')
    expect(saturday.imagePath).toBe('/images/daily-inspiration/saturday-balaji.png')
    expect(saturday.quote).toContain('righteous action')

    // 2026-10-25 is Sunday
    const sunday = getDailyInspirationForDate('2026-10-25')
    expect(sunday.weekdayName).toBe('Sunday')
    expect(sunday.subject).toBe('Beautiful Sunrise')
    expect(sunday.imagePath).toBe('/images/daily-inspiration/sunday-sunrise.png')
    expect(sunday.quote).toContain('sunrise')
  })

  it('guarantees consistency and does not randomly flip on refresh', () => {
    const testDate = '2026-10-25'
    const firstCall = getDailyInspirationForDate(testDate)
    for (let i = 0; i < 50; i++) {
      const nextCall = getDailyInspirationForDate(testDate)
      expect(nextCall.quote).toBe(firstCall.quote)
      expect(nextCall.imagePath).toBe(firstCall.imagePath)
      expect(nextCall.subject).toBe(firstCall.subject)
    }
  })

  it('safely extracts weekday from Date objects, ISO strings, and partial dates', () => {
    // Sunday
    expect(getWeekdayFromDate(new Date(2026, 9, 25))).toBe(0)
    // Monday
    expect(getWeekdayFromDate(new Date(2026, 9, 26))).toBe(1)
    // Tuesday
    expect(getWeekdayFromDate('2026-10-27')).toBe(2)
    // Wednesday
    expect(getWeekdayFromDate('2026-10-28')).toBe(3)
  })

  it('formats inspiration date accurately for header display', () => {
    const formatted = formatInspirationDate('2026-10-25')
    expect(formatted).toContain('Sunday')
    expect(formatted).toContain('25')
    expect(formatted).toContain('2026')
  })
})
